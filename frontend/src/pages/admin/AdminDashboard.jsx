// AdminDashboard.jsx PART 1/3
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Users,
  UserCog,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Eye,
  Home,
  Settings,
  LogOut,
  Server,
  Shield,
  Activity,
  TrendingUp,
  Bell,
  Download,
  Save as SaveIcon
} from "lucide-react";

import bg from "../../assets/images/bg.png";



const API_URL = "http://127.0.0.1:8000/api";



const AdminDashboard = () => {


  const navigate = useNavigate();
  const location = useLocation();



  const [admin,setAdmin] = useState(null);
  const [loading,setLoading] = useState(true);


  const [activeTab,setActiveTab] = useState("dashboard");


  const [stats,setStats] = useState({

    totalUsers:0,
    totalDoctors:0,
    totalReports:0,
    totalAppointments:0,
    highRiskCases:0,
    unreadAlerts:0

  });



  const [allUsersList,setAllUsersList] = useState([]);
  const [allDoctorsList,setAllDoctorsList] = useState([]);


  const [recentReports,setRecentReports] = useState([]);
  const [alerts,setAlerts] = useState([]);



  const [lastUpdated,setLastUpdated] =
      useState(new Date());




  // ==========================
  // TOKEN
  // ==========================

  const getToken = () => {

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token")
    );

  };




  // ==========================
  // API HEADERS
  // ==========================

  const getHeaders = () => {

    return {

      "Content-Type":"application/json",

      Authorization:
      `Bearer ${getToken()}`

    };

  };





  // ==========================
  // LOAD DATA FROM BACKEND
  // ==========================

  const loadData = async()=>{


    try{


      setLoading(true);



      const headers = getHeaders();



      const [
        dashboardResponse,
        usersResponse,
        doctorsResponse

      ] = await Promise.all([


        fetch(
          `${API_URL}/admin/dashboard`,
          {
            headers
          }
        ),



        fetch(
          `${API_URL}/admin/users`,
          {
            headers
          }
        ),



        fetch(
          `${API_URL}/admin/doctors`,
          {
            headers
          }
        )

      ]);





      if(
        dashboardResponse.status===401 ||
        usersResponse.status===401 ||
        doctorsResponse.status===401
      ){

        localStorage.removeItem("token");
        localStorage.removeItem("access_token");

        navigate("/admin-login");

        return;

      }





      const dashboard =
        await dashboardResponse.json();



      const usersData =
await usersResponse.json();


const users =
Array.isArray(usersData)
?
usersData
:
usersData.users ||
usersData.data ||
[];
setAllUsersList(users);



      const doctors =
        await doctorsResponse.json();






      console.log(
        "BACKEND USERS:",
        users
      );


      console.log(
        "BACKEND DOCTORS:",
        doctors
      );





      setStats({

        totalUsers:
          dashboard.users || 0,


        totalDoctors:
          dashboard.doctors || 0,


        totalAppointments:
          dashboard.appointments || 0,


        highRiskCases:
          dashboard.highRiskRecords || 0,


        unreadAlerts:
          dashboard.unreadAlerts || 0,


        totalReports:0

      });






      setAllUsersList(
        Array.isArray(users)
        ? users
        : []
      );



      setAllDoctorsList(
        Array.isArray(doctors)
        ? doctors
        : []
      );



      setLastUpdated(
        new Date()
      );



    }


    catch(error){

      console.error(
        "ADMIN LOAD ERROR:",
        error
      );

    }


    finally{

      setLoading(false);

    }

  };






  // ==========================
  // AUTH CHECK
  // ==========================

  useEffect(()=>{


    const currentUser =
    JSON.parse(
      localStorage.getItem("currentUser")
    );


    if(
      !currentUser ||
      currentUser.role !== "admin"
    ){

      navigate("/admin-login");
      return;

    }



    setAdmin(currentUser);



    loadData();



  },[]);






  // ==========================
  // TAB CHANGE
  // ==========================

  useEffect(()=>{


    const path =
    location.pathname.split("/").pop();


    if(path){

      setActiveTab(path);

    }


  },[location]);







  // AUTO REFRESH

  useEffect(()=>{


    const interval =
    setInterval(()=>{

      loadData();

    },15000);



    return ()=>clearInterval(interval);



  },[]);





  const handleLogout=()=>{


    localStorage.removeItem(
      "currentUser"
    );


    localStorage.removeItem(
      "token"
    );


    localStorage.removeItem(
      "access_token"
    );


    navigate(
      "/admin-login"
    );


  };
// ==========================
// DOCTOR APPROVE / REJECT
// ==========================

const updateDoctorStatus = async (doctorId, action) => {

  try {

    const response = await fetch(
      `${API_URL}/admin/doctors/${doctorId}/${action}`,
      {
        method: "PUT",
        headers: getHeaders()
      }
    );


    const data = await response.json();


    console.log(
      "DOCTOR STATUS UPDATE:",
      data
    );


    loadData();


  } catch(error){

    console.error(
      "Doctor update error:",
      error
    );

  }

};





// ==========================
// NAVIGATION ITEMS
// ==========================

const navItems = [

  {
    id:"dashboard",
    label:"Dashboard",
    icon:<Home className="w-5 h-5"/>,
    path:"/admin-dashboard"
  },


  {
    id:"users",
    label:"Users",
    icon:<Users className="w-5 h-5"/>,
    path:"/admin-users"
  },


  {
    id:"doctors",
    label:"Doctors",
    icon:<UserCog className="w-5 h-5"/>,
    path:"/admin-doctors",
    badge:stats.totalDoctors
  },


  {
    id:"reports",
    label:"Reports",
    icon:<FileText className="w-5 h-5"/>,
    path:"/admin-reports"
  },


  {
    id:"system-status",
    label:"System Status",
    icon:<Server className="w-5 h-5"/>,
    path:"/admin-systemstatus"
  },


  {
    id:"settings",
    label:"Settings",
    icon:<Settings className="w-5 h-5"/>,
    path:"/admin-settings"
  }

];





// ==========================
// LOADING
// ==========================

if(loading){

 return(

 <div className="
 min-h-screen
 flex
 items-center
 justify-center
 bg-pink-50
 ">

 <div className="
 w-12
 h-12
 border-4
 border-pink-500
 border-t-transparent
 rounded-full
 animate-spin
 "></div>


 </div>

 );

}





// ==========================
// DASHBOARD CONTENT
// ==========================

const renderDashboard = ()=> (

<div className="space-y-6">


<div className="
flex
justify-between
items-center
bg-white/70
backdrop-blur-xl
rounded-2xl
p-5
">


<div>

<h1 className="
text-2xl
font-bold
text-gray-800
flex
items-center
gap-2
">

<Activity className="text-pink-500"/>

Admin Dashboard

</h1>


<p className="text-gray-500 text-sm">

Welcome,
<span className="text-pink-500 font-semibold">
 {admin?.name}
</span>

</p>


</div>



<button
onClick={loadData}
className="
bg-gradient-to-r
from-pink-500
to-sky-400
text-white
px-4
py-2
rounded-xl
flex
gap-2
items-center
"
>

<RefreshCw size={16}/>

Refresh

</button>



</div>





<div className="
grid
grid-cols-1
md:grid-cols-4
gap-4
">


<StatCard

title="Users"

value={stats.totalUsers}

icon={<Users/>}

/>



<StatCard

title="Doctors"

value={stats.totalDoctors}

icon={<UserCog/>}

/>



<StatCard

title="Appointments"

value={stats.totalAppointments}

icon={<Clock/>}

/>



<StatCard

title="High Risk"

value={stats.highRiskCases}

icon={<AlertTriangle/>}

/>


</div>






<div className="
bg-white/80
rounded-3xl
p-6
shadow-lg
">


<h2 className="
font-bold
text-lg
mb-4
">

Recent Doctors

</h2>



<div className="space-y-3">


{
allDoctorsList
.slice(0,5)
.map((doctor)=>(


<div
key={doctor.user_id}
className="
flex
justify-between
items-center
p-4
bg-pink-50
rounded-xl
"
>


<div>

<p className="font-semibold">

{doctor.name}

</p>


<p className="text-sm text-gray-500">

{doctor.email}

</p>


</div>



<span className="
px-3
py-1
rounded-full
text-xs
bg-yellow-100
text-yellow-700
">

{doctor.verification_status}

</span>



</div>


))

}



{
allDoctorsList.length===0 &&

<p className="text-gray-400">

No doctors found

</p>

}


</div>


</div>




</div>

);








// ==========================
// PAGE ROUTER
// ==========================

const renderContent = ()=>{


switch(activeTab){


case "users":

return (

<AdminUsersPage

users={allUsersList}

/>

);



case "doctors":

return (

<AdminDoctorsPage

doctors={allDoctorsList}

updateDoctorStatus={updateDoctorStatus}

/>

);



case "dashboard":

default:

return renderDashboard();



}



};







return (

<div
className="
min-h-screen
bg-cover
bg-center
flex
"
style={{
backgroundImage:`url(${bg})`
}}
>


<div className="
fixed
inset-0
bg-white/70
backdrop-blur-sm
">
</div>





{/* SIDEBAR */}

<div className="
fixed
left-0
top-0
h-screen
w-72
bg-white/80
backdrop-blur-xl
border-r
z-20
">


<div className="p-5">


<h1 className="
text-3xl
font-bold
text-pink-500
">

GlowCare

</h1>


<p className="text-sm text-gray-500">

Admin Panel

</p>


</div>





<nav className="
p-4
space-y-2
">


{
navItems.map(item=>(


<Link

key={item.id}

to={item.path}

onClick={()=>
setActiveTab(item.id)
}

className={`
flex
items-center
gap-3
p-3
rounded-xl

${
activeTab===item.id

?

"bg-pink-500 text-white"

:

"text-gray-600 hover:bg-pink-50"

}

`}

>


{item.icon}


<span>

{item.label}

</span>



</Link>


))

}


</nav>




<button

onClick={handleLogout}

className="
absolute
bottom-5
left-5
right-5
bg-pink-100
text-pink-600
p-3
rounded-xl
flex
justify-center
gap-2
"

>

<LogOut size={18}/>

Logout

</button>



</div>







<div className="
ml-72
flex-1
p-6
relative
z-10
">


{renderContent()}


</div>





</div>


);


};
const StatCard = ({title,value,icon}) => (

<div className="
bg-white/80
backdrop-blur-xl
rounded-2xl
p-5
shadow-lg
border
border-pink-100
hover:scale-105
transition
">

<div className="
flex
items-center
gap-4
">


<div className="
w-12
h-12
rounded-xl
bg-pink-100
text-pink-500
flex
items-center
justify-center
">

{icon}

</div>


<div>

<p className="
text-sm
text-gray-500
">

{title}

</p>


<p className="
text-3xl
font-bold
text-gray-800
">

{value}

</p>


</div>


</div>


</div>

);







// ==========================
// USERS PAGE
// ==========================

const AdminUsersPage = ({users}) => {


return (

<div className="space-y-6">


<h1 className="
text-2xl
font-bold
text-gray-800
flex
items-center
gap-2
">

<Users className="text-pink-500"/>

All Users

</h1>





<div className="
bg-white/80
rounded-3xl
shadow-lg
p-6
overflow-x-auto
">


<table className="w-full">


<thead>

<tr className="
border-b
">

<th className="p-3 text-left">
Name
</th>


<th className="p-3 text-left">
Email
</th>


<th className="p-3 text-left">
Role
</th>


<th className="p-3 text-left">
Status
</th>


</tr>

</thead>



<tbody>


{

users.map((user)=>(


<tr

key={user.id}

className="
border-b
hover:bg-pink-50
"

>


<td className="p-3">

{user.name}

</td>


<td className="p-3">

{user.email}

</td>


<td className="p-3">


<span className="
px-3
py-1
rounded-full
bg-pink-100
text-pink-600
text-xs
">

{user.role}

</span>


</td>


<td className="p-3">


<span className="
px-3
py-1
rounded-full
bg-green-100
text-green-600
text-xs
">

Active

</span>


</td>



</tr>


))


}




{
users.length===0 &&

<tr>

<td
colSpan="4"
className="
text-center
p-6
text-gray-400
">

No users found

</td>

</tr>

}



</tbody>


</table>


</div>


</div>

);


};








// ==========================
// DOCTORS PAGE
// ==========================


const AdminDoctorsPage = ({
doctors,
updateDoctorStatus
}) => {


return (

<div className="space-y-6">


<div className="
flex
justify-between
items-center
">


<h1 className="
text-2xl
font-bold
flex
items-center
gap-2
">

<UserCog className="text-pink-500"/>

Doctors Management

</h1>


</div>





<div className="
bg-white/80
rounded-3xl
shadow-lg
p-6
overflow-x-auto
">


<table className="w-full">


<thead>

<tr className="border-b">


<th className="p-3 text-left">
Doctor
</th>


<th className="p-3 text-left">
Hospital
</th>


<th className="p-3 text-left">
Specialization
</th>


<th className="p-3 text-left">
Status
</th>


<th className="p-3 text-left">
Actions
</th>


</tr>


</thead>



<tbody>


{

doctors.map((doctor)=>(


<tr
key={doctor.user_id}
className="
border-b
hover:bg-pink-50
"
>


<td className="p-3">


<p className="font-semibold">

{doctor.name}

</p>


<p className="text-sm text-gray-500">

{doctor.email}

</p>


</td>





<td className="p-3">

{doctor.hospital || "N/A"}

</td>





<td className="p-3">

{doctor.specialization || "N/A"}

</td>





<td className="p-3">


<span
className={`

px-3
py-1
rounded-full
text-xs


${
doctor.verification_status==="approved"

?

"bg-green-100 text-green-700"

:

doctor.verification_status==="rejected"

?

"bg-red-100 text-red-700"

:

"bg-yellow-100 text-yellow-700"

}

`}
>


{doctor.verification_status}


</span>


</td>





<td className="p-3">


<div className="flex gap-2">


<button

onClick={()=>
updateDoctorStatus(
doctor.user_id,
"approve"
)
}

className="
bg-green-500
text-white
px-3
py-1
rounded-lg
text-xs
flex
items-center
gap-1
"

>


<CheckCircle size={14}/>

Approve

</button>





<button

onClick={()=>
updateDoctorStatus(
doctor.user_id,
"reject"
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


</div>


</td>



</tr>


))


}



{
doctors.length===0 &&


<tr>

<td
colSpan="5"
className="
text-center
p-8
text-gray-400
">

No doctors registered

</td>

</tr>


}



</tbody>


</table>


</div>


</div>


);


};





export default AdminDashboard;



