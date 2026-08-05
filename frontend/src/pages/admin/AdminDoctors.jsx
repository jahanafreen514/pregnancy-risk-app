import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

import {
  UserCog,
  Search,
  RefreshCw,
  CheckCircle,
  Stethoscope,
  Hospital,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

import { FaUserMd } from "react-icons/fa";


const AdminDoctors = () => {


  const [doctors, setDoctors] = useState([]);

  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");


  const [stats, setStats] = useState({

    total: 0,

    verified: 0,

    pending: 0,

  });



  useEffect(() => {

    loadDoctors();

  }, []);



const loadDoctors = async () => {

  try {

    setLoading(true);

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");


    const headers = {
      Authorization:`Bearer ${token}`,
      "Content-Type":"application/json"
    };


    const pendingResponse = await fetch(
      "http://127.0.0.1:8000/api/admin/doctors/pending",
      {
        headers
      }
    );


    const pendingData =
      await pendingResponse.json();



    const verifiedResponse = await fetch(
      "http://127.0.0.1:8000/api/doctors/verified",
      {
        headers
      }
    );


    const verifiedData =
      await verifiedResponse.json();



    const pendingDoctors =
      Array.isArray(pendingData)
      ? pendingData
      : pendingData.doctors || [];



    const verifiedDoctors =
      Array.isArray(verifiedData)
      ? verifiedData
      : verifiedData.doctors || [];




    const combined = [
      ...pendingDoctors,
      ...verifiedDoctors
    ];



    const uniqueDoctors =
      combined.filter(
        (doctor,index,self)=>

        index === self.findIndex(
          d =>
          (
            d.user_id ||
            d.id ||
            d._id
          )
          ===
          (
            doctor.user_id ||
            doctor.id ||
            doctor._id
          )

        )

      );



    setDoctors(uniqueDoctors);
    setFilteredDoctors(uniqueDoctors);



    setStats({

      total:uniqueDoctors.length,


      verified:
      uniqueDoctors.filter(
        d =>
        d.is_verified === true ||
        d.is_verified === 1 ||
        d.is_verified === "true"
      ).length,


      pending:
      uniqueDoctors.filter(
        d =>
        d.verification_status === "pending"
      ).length

    });


  }

  catch(error){

    console.log(
      "Doctor loading error:",
      error
    );

  }

  finally{

    setLoading(false);

  }

};
const approveDoctor = async(id)=>{


try{


const token =
localStorage.getItem("token") ||
localStorage.getItem("access_token");



const response =
await fetch(

`http://127.0.0.1:8000/api/admin/doctors/${id}/approve`,

{

method:"PUT",

headers:{
Authorization:`Bearer ${token}`,
"Content-Type":"application/json"
}

}

);



const data =
await response.json();



console.log(
"APPROVE RESPONSE",
data
);



if(response.ok){

alert(
"Doctor approved successfully"
);

loadDoctors();


}
else{

alert(
data.detail || "Approval failed"
);

}



}

catch(error){

console.log(
error
);

}



};





  const rejectDoctor = async (id) => {

    try {

      const token =
        localStorage.getItem("token");



      const response = await fetch(

        `http://127.0.0.1:8000/api/admin/doctors/${id}/reject`,

        {

          method:"PUT",

          headers:{

            Authorization:
            `Bearer ${token}`

          }

        }

      );



      if(response.ok){

        alert(
          "Doctor rejected"
        );


        loadDoctors();

      }


    }
    catch(error){

      console.log(
        "Reject error:",
        error
      );

    }

  };





  const removeDoctor = (email)=>{


    const updatedDoctors =
      doctors.filter(

        doctor =>
        doctor.email !== email

      );


    setDoctors(updatedDoctors);

    setFilteredDoctors(updatedDoctors);


  };





  useEffect(()=>{


let filtered = [...doctors];


if(searchTerm.trim()){


const search =
searchTerm.toLowerCase();



filtered =
filtered.filter(doctor=>

doctor.name
?.toLowerCase()
.includes(search)

||

doctor.email
?.toLowerCase()
.includes(search)

||

doctor.specialization
?.toLowerCase()
.includes(search)

||

doctor.hospital
?.toLowerCase()
.includes(search)

);



}



if(filterStatus==="verified"){


filtered =
filtered.filter(
doctor =>
doctor.is_verified === true ||
doctor.is_verified === 1 ||
doctor.is_verified === "true"
);


}



if(filterStatus==="pending"){


filtered =
filtered.filter(
doctor =>
doctor.verification_status === "pending"
);


}



setFilteredDoctors(filtered);



},[
searchTerm,
filterStatus,
doctors
]);
const getInitials = (name) => {

  if(!name)
    return "D";


  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0,2);

};
    return (

    <AdminLayout activeTab="doctors">

      <div className="space-y-6">


        {/* HEADER */}

        <div className="flex flex-wrap justify-between items-center gap-4 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl">


          <div>

            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">

              <UserCog className="text-pink-500"/>

              Doctors Management

            </h2>


            <p className="text-sm text-gray-500">

              Manage verified and pending doctors

            </p>


          </div>



          <div className="flex gap-3">


            <button

              onClick={loadDoctors}

              className="bg-white px-4 py-2 rounded-xl shadow flex items-center gap-2"

            >

              <RefreshCw className="w-4 h-4"/>

              Refresh

            </button>



            <div className="bg-white px-4 py-2 rounded-xl shadow">

              {filteredDoctors.length} Doctors

            </div>


          </div>


        </div>





        {/* STATS */}


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          <div className="bg-white rounded-2xl p-5 shadow">

            <p className="text-gray-500">
              Total Doctors
            </p>


            <h2 className="text-3xl font-bold">

              {stats.total}

            </h2>


            <FaUserMd className="text-pink-500 mt-2"/>


          </div>





          <div className="bg-white rounded-2xl p-5 shadow">


            <p className="text-gray-500">
              Verified
            </p>


            <h2 className="text-3xl font-bold text-green-600">

              {stats.verified}

            </h2>


            <CheckCircle className="text-green-500 mt-2"/>


          </div>





          <div className="bg-white rounded-2xl p-5 shadow">


            <p className="text-gray-500">
              Pending
            </p>


            <h2 className="text-3xl font-bold text-yellow-600">

              {stats.pending}

            </h2>


            <Clock className="text-yellow-500 mt-2"/>


          </div>


        </div>






        {/* SEARCH + FILTER */}



        <div className="bg-white rounded-2xl p-4 shadow flex flex-wrap gap-3">


          <div className="flex-1 relative">


            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>


            <input

              value={searchTerm}

              onChange={
                e=>setSearchTerm(e.target.value)
              }

              placeholder="Search doctor..."

              className="w-full pl-10 p-2 rounded-xl border"

            />


          </div>





          <button

            onClick={
              ()=>setFilterStatus("all")
            }

            className="px-4 py-2 rounded-xl bg-gray-100"

          >

            All

          </button>




          <button

            onClick={
              ()=>setFilterStatus("verified")
            }

            className="px-4 py-2 rounded-xl bg-green-100"

          >

            Verified

          </button>





          <button

            onClick={
              ()=>setFilterStatus("pending")
            }

            className="px-4 py-2 rounded-xl bg-yellow-100"

          >

            Pending

          </button>



        </div>
                {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredDoctors.map((doctor) => (

            <div
              key={doctor.user_id || doctor.id || doctor._id}
              className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 border border-pink-100 shadow-lg hover:shadow-xl transition-all"
            >

              {/* Header */}
              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-xl">
                  {getInitials(doctor.name)}
                </div>


                <div>
                  <h4 className="font-semibold text-gray-800">
                    {doctor.name}
                  </h4>

                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3"/>
                    {doctor.specialization}
                  </p>

                </div>

              </div>



              {/* Details */}
              <div className="mt-4 space-y-2 text-sm">

                <p className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4"/>
                  {doctor.email}
                </p>


                <p className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4"/>
                  {doctor.phone || "N/A"}
                </p>


                <p className="flex items-center gap-2 text-gray-600">
                  <Hospital className="w-4 h-4"/>
                  {doctor.hospital}
                </p>


                <p className="text-xs text-gray-500">
                  License: {doctor.license_number}
                </p>


              </div>



              {/* Status + Actions */}
              <div className="mt-5 flex justify-between items-center">


                <span
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                    doctor.is_verified
                    ? "bg-green-100 text-green-700"
                    : doctor.verification_status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}
                >

                  {
                    doctor.is_verified 
                    ?
                    <CheckCircle className="w-3 h-3"/>
                    :
                    <Clock className="w-3 h-3"/>
                  }


                  {
                    doctor.is_verified
                    ?
                    "Verified"
                    :
                    doctor.verification_status === "rejected"
                    ?
                    "Rejected"
                    :
                    "Pending"
                  }

                </span>




                <div className="flex gap-2">


                  {!doctor.is_verified && doctor.verification_status !== "rejected" && (

                    <button

                      onClick={() =>
                        approveDoctor(
 doctor.user_id ||
 doctor.id ||
 doctor._id
)
                      }

                      className="px-3 py-1 text-xs rounded-lg bg-green-50 text-green-600 hover:bg-green-100"

                    >
                      Approve
                    </button>

                  )}




                  {doctor.is_verified && (

                    <button

                      className="px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-600"

                    >

                      View

                    </button>

                  )}



                </div>


              </div>


            </div>

          ))}



          {
            filteredDoctors.length === 0 &&

            <div className="col-span-3 text-center py-12 text-gray-400">

              <UserCog className="w-12 h-12 mx-auto mb-3"/>

              <p>
                No doctors found
              </p>

            </div>
          }


        </div>


      </div>

    </AdminLayout>

  );

};


export default AdminDoctors;