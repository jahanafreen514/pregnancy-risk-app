from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from jose import JWTError, jwt

from app.config.security import ALGORITHM
from app.config.settings import get_settings
from app.models.pregnancy_model import Appointment
from app.middleware.auth_middleware import get_current_user
from app.models.user_model import User
from datetime import datetime, timezone

router = APIRouter(prefix="/calls", tags=["Calls"])
connections: dict[str, set[WebSocket]] = defaultdict(set)


async def get_participant_appointment(appointment_id: str, user: User) -> Appointment:
    appointment = await Appointment.get(appointment_id)
    if not appointment or str(user.id) not in {appointment.patient_id, appointment.doctor_id}:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if appointment.appointment_type != "online" or appointment.status not in {"accepted", "completed"}:
        raise HTTPException(status_code=400, detail="This appointment is not an active online consultation")
    return appointment


@router.post("/{appointment_id}/joined")
async def confirm_call_joined(appointment_id: str, user: User = Depends(get_current_user)):
    appointment = await get_participant_appointment(appointment_id, user)
    user_id = str(user.id)
    if user_id not in appointment.call_joined_by:
        appointment.call_joined_by.append(user_id)
    both_joined = {appointment.patient_id, appointment.doctor_id}.issubset(set(appointment.call_joined_by))
    if both_joined:
        appointment.call_status = "active"
        appointment.call_started_at = appointment.call_started_at or datetime.now(timezone.utc)
    await appointment.save()
    return {"both_joined": both_joined, "call_status": appointment.call_status}


@router.get("/{appointment_id}/status")
async def call_status(appointment_id: str, user: User = Depends(get_current_user)):
    """Lets either participant update the completion screen without a reload."""
    appointment = await get_participant_appointment(appointment_id, user)
    return {"appointment_status": appointment.status, "call_status": appointment.call_status}


@router.post("/{appointment_id}/complete")
async def confirm_call_complete(appointment_id: str, user: User = Depends(get_current_user)):
    appointment = await get_participant_appointment(appointment_id, user)
    user_id = str(user.id)
    if user_id not in appointment.call_joined_by:
        raise HTTPException(status_code=400, detail="Confirm that you joined the consultation first")
    if user_id not in appointment.call_completed_by:
        appointment.call_completed_by.append(user_id)
    completed = {appointment.patient_id, appointment.doctor_id}.issubset(set(appointment.call_completed_by))
    if completed:
        appointment.status = "completed"
        appointment.call_status = "ended"
        appointment.call_ended_at = datetime.now(timezone.utc)
        if appointment.call_started_at:
            appointment.call_duration_seconds = max(0, int((appointment.call_ended_at - appointment.call_started_at).total_seconds()))
    await appointment.save()
    return {"completed": completed, "message": "Appointment marked completed for both participants." if completed else "Waiting for the other participant to confirm completion."}


@router.get("/{appointment_id}/config")
async def call_config(appointment_id: str, user: User = Depends(get_current_user)):
    """Return ICE configuration only to an accepted appointment participant."""
    appointment = await Appointment.get(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if appointment.status != "accepted" or appointment.appointment_type != "online":
        raise HTTPException(status_code=400, detail="This appointment is not ready for an online call")
    if str(user.id) not in {appointment.patient_id, appointment.doctor_id}:
        raise HTTPException(status_code=403, detail="Not allowed")
    return {"ice_servers": get_settings().ice_servers}


@router.websocket("/ws/{appointment_id}")
async def call_signalling_socket(websocket: WebSocket, appointment_id: str, token: str):
    """Authenticated WebRTC signalling channel for accepted online appointments.

    Clients exchange offer/answer/ICE JSON messages here; media stays peer-to-peer.
    A TURN server should be configured by the deployment for restrictive networks.
    """
    try:
        claims = jwt.decode(token, get_settings().secret_key, algorithms=[ALGORITHM])
        if claims.get("type") != "access" or not claims.get("sub"):
            await websocket.close(code=1008)
            return
        appointment = await Appointment.get(appointment_id)
        if not appointment or appointment.status != "accepted" or appointment.appointment_type != "online" or claims["sub"] not in {appointment.patient_id, appointment.doctor_id}:
            await websocket.close(code=1008)
            return
    except JWTError:
        await websocket.close(code=1008)
        return

    await websocket.accept()
    connections[appointment_id].add(websocket)
    # Do not start media negotiation until the invited participant opens the call.
    for peer in connections[appointment_id].copy():
        if peer is not websocket:
            await peer.send_json({"type": "participant-joined"})
    try:
        while True:
            event = await websocket.receive_json()
            if event.get("type") not in {"offer", "answer", "ice-candidate", "hangup", "call-accepted", "call-rejected"}:
                continue
            if event.get("type") == "call-accepted":
                appointment.call_status = "active"
                appointment.call_started_at = datetime.now(timezone.utc)
                await appointment.save()
            elif event.get("type") == "call-rejected":
                appointment.call_status = "rejected"
                appointment.call_ended_at = datetime.now(timezone.utc)
                await appointment.save()
            elif event.get("type") == "hangup":
                appointment.call_status = "ended"
                appointment.call_ended_at = datetime.now(timezone.utc)
                if appointment.call_started_at:
                    appointment.call_duration_seconds = max(0, int((appointment.call_ended_at - appointment.call_started_at).total_seconds()))
                await appointment.save()
            for peer in connections[appointment_id].copy():
                if peer is not websocket:
                    await peer.send_json(event)
    except (WebSocketDisconnect, RuntimeError):
        pass
    finally:
        connections[appointment_id].discard(websocket)
        if not connections[appointment_id]:
            connections.pop(appointment_id, None)
