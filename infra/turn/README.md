# GlowCare TURN deployment

This starts a private Coturn relay for the WebRTC call feature. Deploy it on a
Linux VM with a public static IPv4 address (not on a home NAT or the frontend
hosting platform). Copy `.env.example` to `.env`, replace every value, then run:

```bash
docker compose up -d
docker compose logs -f coturn
```

Open these inbound firewall/security-group rules on that VM:

- TCP 3478
- UDP 3478
- UDP 49160-49200

Then add the same username/password to `backend/.env`:

```dotenv
TURN_URL=turn:turn.example.com:3478?transport=udp
TURN_USERNAME=glowcare-turn
TURN_CREDENTIAL=the-long-random-turn-password
```

Restart the backend after changing its environment. The backend supplies these
credentials only from its authenticated call configuration endpoint, and only
to accepted appointment participants.

For TLS TURN (`turns:`) terminate TLS on Coturn with a real certificate and
also expose TCP 5349. The official Coturn Docker image documents the UDP relay
port range and custom configuration options: https://hub.docker.com/r/coturn/coturn/
