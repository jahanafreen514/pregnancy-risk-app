import React, { useEffect, useState } from "react";


const API_URL = "http://127.0.0.1:8000/api";


function DoctorVerification() {

    const [doctors, setDoctors] = useState([]);


    const token = localStorage.getItem("token");


    const fetchPendingDoctors = async () => {

        const response = await fetch(
            `${API_URL}/admin/doctors/pending`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data = await response.json();

        setDoctors(data);
    };


    useEffect(() => {
        fetchPendingDoctors();
    }, []);



    const approveDoctor = async(id)=>{

        await fetch(
            `${API_URL}/admin/doctors/${id}/approve`,
            {
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );


        fetchPendingDoctors();
    }



    const rejectDoctor = async(id)=>{

        await fetch(
            `${API_URL}/admin/doctors/${id}/reject`,
            {
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );


        fetchPendingDoctors();
    }



    return (

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Doctor Verification
            </h1>


            <div className="grid gap-5">


            {
                doctors.map((doctor)=>(

                    <div
                    key={doctor.id}
                    className="bg-white shadow-lg rounded-xl p-5"
                    >


                    <h2 className="text-xl font-semibold">
                        Doctor ID:
                        {doctor.user_id}
                    </h2>


                    <p>
                        Specialization:
                        {doctor.specialization}
                    </p>


                    <p>
                        Hospital:
                        {doctor.hospital}
                    </p>


                    <p>
                        License OCR:
                        {doctor.extracted_license_number}
                    </p>


                    <p>
                        Hospital OCR:
                        {doctor.extracted_hospital_name}
                    </p>



                    <div className="flex gap-4 mt-4">


                    <button
                    onClick={()=>approveDoctor(doctor._id)}
                    className="bg-green-500 text-white px-5 py-2 rounded"
                    >
                        Approve
                    </button>


                    <button
                    onClick={()=>rejectDoctor(doctor._id)}
                    className="bg-red-500 text-white px-5 py-2 rounded"
                    >
                        Reject
                    </button>


                    </div>


                    </div>

                ))
            }


            </div>

        </div>

    )

}


export default DoctorVerification;