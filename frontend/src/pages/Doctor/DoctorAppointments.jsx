// DoctorAppointments.jsx PART 1/3

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
 FaCalendarCheck,
 FaChartLine,
 FaUsers,
 FaFileMedical,
 FaPrescription,
 FaBell,
 FaUserMd,
 FaCog,
 FaSignOutAlt,
 FaClock,
 FaCheckCircle,
 FaTimesCircle,
 FaSpinner,
 FaSearch,
 FaEnvelope,
 FaPhone
} from "react-icons/fa";

import bg from "../../assets/images/bg.png";


const API_URL="http://127.0.0.1:8000/api";


const DoctorAppointments=()=>{


const navigate=useNavigate();


const [doctor,setDoctor]=useState(null);

const [appointments,setAppointments]=useState([]);

const [filteredAppointments,setFilteredAppointments]=useState([]);

const [loading,setLoading]=useState(true);

const [searchTerm,setSearchTerm]=useState("");

const [statusFilter,setStatusFilter]=useState("all");

const [typeFilter,setTypeFilter]=useState("all");

const [selectedAppointment,setSelectedAppointment]=useState(null);

const [showModal,setShowModal]=useState(false);

const [showStatusMessage,setShowStatusMessage]=useState(null);

const [activeTab,setActiveTab]=useState("appointments");

const [notifications,setNotifications]=useState([]);



/*
 LOAD LOGIN DOCTOR
*/

useEffect(()=>{


 const currentUser=
 JSON.parse(
 localStorage.getItem("currentUser")
 );


 if(
 !currentUser ||
 currentUser.role!=="doctor"
 ){

 navigate("/doctor-login");
 return;

 }


 setDoctor(currentUser);


},[]);



/*
 LOAD APPOINTMENTS AFTER DOCTOR AVAILABLE
*/

useEffect(()=>{


 if(doctor){

   loadAppointments();

 }


},[doctor]);





/*
 FETCH APPOINTMENTS
*/


const loadAppointments = async () => {

 try {

  setLoading(true);


  const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));


  const token = currentUser?.token;


  if(!token){
    console.log("JWT token missing");
    navigate("/doctor-login");
    return;
  }



  const response =
    await fetch(
      `${API_URL}/appointments/doctor`,
      {
        method:"GET",

        headers:{
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json"
        }
      }
    );



  if(!response.ok){

    const errorData = await response.json();

    console.log(
      "Appointment API Error:",
      errorData
    );

    throw new Error(
      "Failed loading appointments"
    );

  }



  const data =
    await response.json();



  console.log(
    "Doctor appointments:",
    data
  );



  setAppointments(data);

  setFilteredAppointments(data);



 }
 catch(error){

  console.log(
    "Appointment loading error:",
    error
  );


 }
 finally{

  setLoading(false);

 }

};





/*
 UPDATE STATUS
*/


const updateAppointmentStatus =
async(id,status)=>{


try{


const currentUser =
JSON.parse(
localStorage.getItem("currentUser")
);



const token =
currentUser?.token;



if(!token){

 navigate("/doctor-login");
 return;

}



const response =
await fetch(
`${API_URL}/appointments/${id}`,
{

method:"PATCH",

headers:{

"Content-Type":"application/json",

"Authorization":
`Bearer ${token}`

},


body:JSON.stringify({

status:status

})


});



if(!response.ok){


const err =
await response.json();


console.log(
"PATCH ERROR",
err
);


throw new Error(
"Update failed"
);


}



const result =
await response.json();



console.log(
"Updated:",
result
);



setShowStatusMessage(
{
message:`Appointment ${status}`,
type:"success"
}
);



setTimeout(
()=>setShowStatusMessage(null),
3000
);



loadAppointments();



}
catch(error){


console.log(
error
);



setShowStatusMessage(
{
message:"Status update failed",
type:"error"
}
);


}



};

// FILTER APPOINTMENTS

useEffect(()=>{


let filtered=[...appointments];



if(searchTerm.trim()){


const search=
searchTerm.toLowerCase();


filtered=
filtered.filter((app)=>{


const name=
(
app.patientName ||
app.patient ||
""
).toLowerCase();



const email=
(
app.patientEmail ||
""
).toLowerCase();



return (
name.includes(search) ||
email.includes(search)
);


});


}




if(statusFilter!=="all"){


filtered=
filtered.filter(
(app)=>
app.status?.toLowerCase()
===
statusFilter.toLowerCase()
);


}



if(typeFilter!=="all"){


filtered=
filtered.filter(
(app)=>
app.type?.toLowerCase()
===
typeFilter.toLowerCase()
);

}



setFilteredAppointments(filtered);



},[
searchTerm,
statusFilter,
typeFilter,
appointments
]);






// REAL TIME UPDATE

useEffect(()=>{


const refresh=()=>{

loadAppointments();

};


window.addEventListener(
"appointmentUpdated",
refresh
);



return()=>{

window.removeEventListener(
"appointmentUpdated",
refresh
);

};


},[doctor]);








const getStatusBadge=(status)=>{


const map={


pending:
"bg-yellow-100 text-yellow-700 border-yellow-200",


approved:
"bg-green-100 text-green-700 border-green-200",


completed:
"bg-blue-100 text-blue-700 border-blue-200",


rejected:
"bg-red-100 text-red-700 border-red-200",


cancelled:
"bg-gray-100 text-gray-700 border-gray-200"


};



return map[status?.toLowerCase()]
||
map.pending;



};







const getStatusIcon=(status)=>{


switch(status?.toLowerCase()){


case "approved":
return <FaCheckCircle className="text-green-500"/>;


case "completed":
return <FaCheckCircle className="text-blue-500"/>;



case "rejected":
case "cancelled":
return <FaTimesCircle className="text-red-500"/>;



default:
return <FaClock className="text-yellow-500"/>;


}



};







const formatDate=(date)=>{


if(!date)
return "N/A";


return new Date(date)
.toLocaleDateString();



};








const total=
appointments.length;



const pending=
appointments.filter(
a=>a.status==="pending"
).length;



const approved =
appointments.filter(
a => a.status === "accepted"
).length;


const completed=
appointments.filter(
a=>a.status==="completed"
).length;







if(loading){


return(

<div className="
min-h-screen 
flex 
items-center 
justify-center
">


<FaSpinner
className="
text-5xl
text-pink-500
animate-spin
"
/>


</div>


);


}






return(


<div

className="
relative
h-screen
overflow-hidden
bg-cover
bg-center
flex
"

style={{
backgroundImage:`url(${bg})`
}}

>


<div className="
absolute
inset-0
bg-white/70
backdrop-blur-sm
"/>





{
showStatusMessage &&

<div className="
fixed
top-5
right-5
z-50
bg-green-500
text-white
px-5
py-3
rounded-xl
shadow-lg
">


{showStatusMessage.message}


</div>


}
<div className="relative z-10 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 flex-shrink-0 h-full flex flex-col">
        {/* Doctor Profile */}
        <div className="p-5 border-b border-pink-100/50">
          <Link to="/doctor-dashboard" className="block">
            <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </Link>
          <div className="mt-4 flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl border border-pink-100/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {doctor?.name?.charAt(0).toUpperCase() || "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{doctor?.name}</p>
              <p className="text-xs text-gray-500 truncate">{doctor?.specialization || "Doctor"}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Online</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavItem 
            label="Dashboard" 
            icon={<FaChartLine />} 
            to="/doctor-dashboard" 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")}
          />
          <NavItem 
            label="Patients" 
            icon={<FaUsers />} 
            to="/doctor-patients" 
            active={activeTab === "patients"} 
            onClick={() => setActiveTab("patients")}
          />
          <NavItem 
            label="Appointments" 
            icon={<FaCalendarCheck />} 
            to="/doctor-appointments" 
            active={activeTab === "appointments"} 
            onClick={() => setActiveTab("appointments")}
          />
          <NavItem 
            label="Reports" 
            icon={<FaFileMedical />} 
            to="/doctor-reports" 
            active={activeTab === "reports"} 
            onClick={() => setActiveTab("reports")}
          />
          <NavItem 
            label="Prescriptions" 
            icon={<FaPrescription />} 
            to="/doctor-prescriptions" 
            active={activeTab === "prescriptions"} 
            onClick={() => setActiveTab("prescriptions")}
          />
          <NavItem 
            label="Notifications" 
            icon={<FaBell />} 
            to="/doctor-notifications" 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")}
            badge={notifications.filter(n => !n.read).length}
          />
          <NavItem 
            label="Profile" 
            icon={<FaUserMd />} 
            to="/doctor-profile" 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")}
          />
          <NavItem 
            label="Settings" 
            icon={<FaCog />} 
            to="/doctor-settings" 
            active={activeTab === "settings"} 
            onClick={() => setActiveTab("settings")}
          />
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-pink-100/50">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/doctor-login";
            }}
            className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl hover:bg-pink-100 transition-all duration-300 text-sm font-semibold"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>


{/* MAIN */}

<div className="
relative
z-10
flex-1
p-6
overflow-y-auto
">



<h2 className="
text-3xl
font-bold
text-gray-800
flex
items-center
gap-2
">


<FaCalendarCheck
className="text-pink-500"
/>


Appointments


</h2>



<p className="
text-gray-500
mb-6
">

Manage patient appointments

</p>





{/* STATS */}

<div className="
grid
grid-cols-4
gap-4
mb-6
">


<div className="card">

Total
<br/>
<b>{total}</b>

</div>


<div className="card">

Pending
<br/>
<b>{pending}</b>

</div>



<div className="card">

Approved
<br/>
<b>{approved}</b>

</div>



<div className="card">

Completed
<br/>
<b>{completed}</b>

</div>



</div>

{/* FILTERS */}

<div className="
bg-white/80
rounded-2xl
p-4
mb-6
flex
flex-wrap
gap-3
">


<div className="
flex-1
min-w-[220px]
relative
">


<FaSearch
className="
absolute
left-3
top-3
text-gray-400
"/>


<input

type="text"

placeholder="Search patient..."

value={searchTerm}

onChange={(e)=>
setSearchTerm(e.target.value)
}

className="
w-full
pl-10
py-2
rounded-xl
border
border-pink-100
outline-none
"

/>


</div>





<select

value={statusFilter}

onChange={(e)=>
setStatusFilter(e.target.value)
}

className="
px-4
py-2
rounded-xl
border
"


>


<option value="all">
All Status
</option>


<option value="pending">
Pending
</option>


<option value="accepted">
Accepted
</option>


<option value="completed">
Completed
</option>


<option value="rejected">
Rejected
</option>


</select>







<select

value={typeFilter}

onChange={(e)=>
setTypeFilter(e.target.value)
}

className="
px-4
py-2
rounded-xl
border
"


>


<option value="all">
All Types
</option>


<option value="online">
Online
</option>


<option value="in-person">
In Person
</option>


</select>




<button

onClick={loadAppointments}

className="
bg-pink-500
text-white
px-5
rounded-xl
"


>

Refresh

</button>



</div>







{/* TABLE */}


<div className="
bg-white/80
rounded-3xl
p-6
shadow-xl
">


<table className="
w-full
text-sm
">


<thead>

<tr className="
border-b
">

<th className="text-left p-3">
Patient
</th>


<th className="text-left p-3">
Date
</th>


<th className="text-left p-3">
Time
</th>


<th className="text-left p-3">
Status
</th>


<th className="text-left p-3">
Action
</th>


</tr>


</thead>






<tbody>


{

filteredAppointments.length===0 ?


<tr>

<td
colSpan="5"
className="
text-center
py-10
text-gray-400
">

No appointments found

</td>

</tr>



:



filteredAppointments.map((app)=>(


<tr

key={app.id}

className="
border-b
hover:bg-pink-50
"


>


<td className="p-3">


<div className="
font-semibold
">


{app.patient_name || app.patientName || app.patient || "N/A"}


</div>


<div className="
text-xs
text-gray-400
flex
items-center
gap-1
">

<FaEnvelope/>

{app.patient_email || app.patientEmail || "N/A"}


</div>


</td>






<td className="p-3">

{formatDate(app.scheduled_for || app.date)}

</td>





<td className="p-3">

{
 app.scheduled_for
 ?
 new Date(app.scheduled_for).toLocaleTimeString([],{
   hour:"2-digit",
   minute:"2-digit"
 })
 :
 "N/A"
}

</td>






<td className="p-3">


<span className={`
px-3
py-1
rounded-full
border
flex
items-center
gap-1
w-fit
${getStatusBadge(app.status)}
`}>

{getStatusIcon(app.status)}

{app.status}

</span>


</td>






<td className="p-3">


<div className="
flex
gap-2
">


{

app.status==="pending"

&&

<>


<button

onClick={()=>
updateAppointmentStatus(
app.id,
"accepted"
)
}

className="
bg-green-500
text-white
px-3
py-1
rounded-lg
text-xs
"

>

Accept

</button>





<button

onClick={()=>
updateAppointmentStatus(
app.id,
"rejected"
)
}

className="
bg-red-500
text-white
px-3
py-1
rounded-lg
text-xs
"

>

Reject

</button>


</>


}






{

app.status==="accepted"

&&

<button

onClick={()=>
updateAppointmentStatus(
app.id,
"completed"
)
}

className="
bg-blue-500
text-white
px-3
py-1
rounded-lg
text-xs
"

>

Complete

</button>


}




</div>


</td>





</tr>



))

}



</tbody>



</table>


</div>





</div>



</div>


);



};










// NAV ITEM

const NavItem=({
label,
icon,
to,
active
})=>(


<Link

to={to}

className={`
flex
items-center
gap-3
p-3
rounded-xl
transition

${
active

?

"bg-gradient-to-r from-pink-500 to-sky-400 text-white"

:

"hover:bg-pink-100 text-gray-700"

}

`}

>


{icon}

<span>

{label}

</span>


</Link>


);





export default DoctorAppointments;