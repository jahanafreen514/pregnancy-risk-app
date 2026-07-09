import {
  LayoutDashboard,
  Users,
  HeartPulse,
  Activity,
  CalendarDays,
  Bell,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";


const menuItems = [
  {
    icon:<LayoutDashboard size={20}/>,
    name:"Dashboard",
    path:"/admin-dashboard"
  },

  {
    icon:<Users size={20}/>,
    name:"Users",
    path:"/users"
  },

  {
    icon:<HeartPulse size={20}/>,
    name:"Pregnancy Records",
    path:"/pregnancy-records"
  },

  {
    icon:<Activity size={20}/>,
    name:"Health Monitoring",
    path:"/health-monitoring"
  },

  {
    icon:<Activity size={20}/>,
    name:"Risk Prediction",
    path:"/risk-prediction"
  },

  {
    icon:<CalendarDays size={20}/>,
    name:"Appointments",
    path:"/appointments"
  },

  {
    icon:<Bell size={20}/>,
    name:"SOS Alerts",
    path:"/sos-alerts"
  },

  {
    icon:<FileText size={20}/>,
    name:"Reports",
    path:"/reports"
  },

  {
    icon:<Settings size={20}/>,
    name:"Settings",
    path:"/settings"
  }

];


function AdminSidebar(){

return(

<div
  className="
  fixed
  left-0
  top-0
  h-screen
  w-72
  bg-white
  border-r
  shadow-lg
  overflow-y-auto
  z-50
  "
>

<div className="bg-pink-500 text-white p-8">

<h1 className="text-3xl font-bold">
GlowCare
</h1>

<p className="text-pink-100">
Admin Panel
</p>

</div>


<div className="p-4">

{
menuItems.map((item,index)=>(

<NavLink
key={index}
to={item.path}

className={({isActive})=>

`
flex items-center gap-4
px-4 py-4
rounded-xl
mb-2
transition

${
isActive
?
"bg-pink-100 text-pink-600 font-semibold"
:
"text-gray-700 hover:bg-gray-100"
}

`

}

>

{item.icon}

<span>
{item.name}
</span>


</NavLink>

))
}


</div>



<div className="absolute bottom-5 left-5 right-5">

<button className="
w-64
ml-64
flex
items-center
justify-center
gap-2
border
rounded-xl
py-3
hover:bg-gray-100
">

<LogOut size={18}/>

Logout

</button>


</div>


</div>


)

}


export default AdminSidebar;