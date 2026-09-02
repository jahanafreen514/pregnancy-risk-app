import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { apiUrl } from "../../config/runtime";

import {
  FileText,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";


const API_URL = apiUrl();


const AdminReports = () => {


  const [reports,setReports] = useState([]);

  const [filteredReports,setFilteredReports] = useState([]);

  const [loading,setLoading] = useState(true);

  const [searchTerm,setSearchTerm] = useState("");

  const [riskFilter,setRiskFilter] = useState("all");



  const [stats,setStats] = useState({

    total:0,

    high:0,

    medium:0,

    low:0

  });



  useEffect(()=>{

    loadReports();

  },[]);





  // =========================
  // FETCH REPORTS FROM BACKEND
  // =========================


  const loadReports = async()=>{


    try{


      setLoading(true);



      const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");



      const response = await fetch(

        `${API_URL}/admin/reports`,

        {

          headers:{

            Authorization:
            `Bearer ${token}`

          }

        }

      );



      if(response.status===401){

        console.log(
          "Unauthorized"
        );

        return;

      }



      const data =
      await response.json();



      console.log(
        "ADMIN REPORTS:",
        data
      );



      const reportsData =
      Array.isArray(data)
      ?
      data
      :
      [];



      setReports(
        reportsData
      );


      setFilteredReports(
        reportsData
      );





      setStats({

        total:
        reportsData.length,



        high:
        reportsData.filter(
          r=>
          r.risk_level?.toLowerCase()
          ==="high"
        ).length,



        medium:
        reportsData.filter(
          r=>
          r.risk_level?.toLowerCase()
          ==="medium"
        ).length,



        low:
        reportsData.filter(
          r=>
          r.risk_level?.toLowerCase()
          ==="low"
        ).length


      });



    }


    catch(error){


      console.log(
        "REPORT FETCH ERROR:",
        error
      );


    }


    finally{


      setLoading(false);


    }


  };







  // =========================
  // SEARCH + FILTER
  // =========================


  useEffect(()=>{


    let filtered =
    [...reports];



    if(searchTerm){


      const search =
      searchTerm.toLowerCase();



      filtered =
      filtered.filter(
        report =>

        report.patient_name
        ?.toLowerCase()
        .includes(search)


        ||

        report.patient_email
        ?.toLowerCase()
        .includes(search)

      );


    }






    if(riskFilter!=="all"){


      filtered =
      filtered.filter(

        report =>

        report.risk_level
        ?.toLowerCase()
        ===
        riskFilter

      );


    }





    setFilteredReports(
      filtered
    );



  },[

    searchTerm,

    riskFilter,

    reports

  ]);









  const getRiskStyle=(risk)=>{


    switch(
      risk?.toLowerCase()
    ){


      case "high":

        return "bg-red-100 text-red-700";



      case "medium":

        return "bg-orange-100 text-orange-700";



      case "low":

        return "bg-green-100 text-green-700";



      default:

        return "bg-gray-100 text-gray-700";


    }


  };








  return (


    <AdminLayout activeTab="reports">


      <div className="space-y-6">






        {/* HEADER */}


        <div className="
        flex
        justify-between
        items-center
        bg-white/70
        backdrop-blur-xl
        p-5
        rounded-2xl
        ">


          <div>


            <h2 className="
            text-2xl
            font-bold
            flex
            items-center
            gap-2
            text-gray-800
            ">


              <FileText
              className="text-pink-500"
              />

              Health Reports


            </h2>



            <p className="
            text-sm
            text-gray-500
            ">

              Patient risk monitoring reports

            </p>



          </div>




          <button

          onClick={loadReports}

          className="
          bg-pink-500
          text-white
          px-4
          py-2
          rounded-xl
          flex
          gap-2
          items-center
          ">


            <RefreshCw size={16}/>

            Refresh


          </button>



        </div>








        {/* STATS */}


        <div className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-4
        ">



          <StatCard
          title="Total Reports"
          value={stats.total}
          icon={<FileText/>}
          />



          <StatCard
          title="High Risk"
          value={stats.high}
          icon={<AlertTriangle/>}
          />



          <StatCard
          title="Medium Risk"
          value={stats.medium}
          icon={<Clock/>}
          />



          <StatCard
          title="Low Risk"
          value={stats.low}
          icon={<CheckCircle/>}
          />


        </div>









        {/* SEARCH */}


        <div className="
        bg-white
        rounded-2xl
        p-4
        flex
        gap-3
        ">


          <div className="
          flex-1
          relative
          ">


            <Search
            className="
            absolute
            left-3
            top-3
            text-gray-400
            "
            size={18}
            />


            <input

            value={searchTerm}

            onChange={
              e=>
              setSearchTerm(e.target.value)
            }

            placeholder="
            Search patient...
            "

            className="
            w-full
            pl-10
            p-2
            border
            rounded-xl
            "

            />


          </div>





          <select

          value={riskFilter}

          onChange={
            e=>
            setRiskFilter(e.target.value)
          }

          className="
          border
          rounded-xl
          px-4
          ">


            <option value="all">
              All
            </option>


            <option value="high">
              High
            </option>


            <option value="medium">
              Medium
            </option>


            <option value="low">
              Low
            </option>


          </select>



        </div>









        {/* REPORT CARDS */}


        {

        loading ?


        <div className="
        text-center
        p-10
        ">

          Loading reports...

        </div>


        :


        <div className="
        grid
        md:grid-cols-2
        gap-5
        ">


        {
        filteredReports.map(
          (report,index)=>(


          <div

          key={index}

          className="
          bg-white/80
          rounded-2xl
          p-5
          shadow-lg
          ">



            <div className="
            flex
            justify-between
            ">



              <div>


                <h3 className="
                font-bold
                text-gray-800
                ">

                  {report.patient_name || "Unknown"}

                </h3>


                <p className="
                text-sm
                text-gray-500
                ">

                  {report.patient_email}

                </p>


              </div>




              <span

              className={`
              px-3
              py-1
              rounded-full
              text-xs
              ${getRiskStyle(
                report.risk_level
              )}
              `}

              >

                {report.risk_level || "Unknown"}

              </span>



            </div>





            <div className="
            mt-4
            space-y-2
            text-sm
            ">


              <p>
              Risk Score:
              <b>
              {" "}
              {report.risk_score || 0}%
              </b>
              </p>



              <p>
              Symptoms:
              {" "}
              {report.symptoms?.length || 0}
              </p>




              {
              report.vitals &&

              <p className="
              bg-pink-50
              p-2
              rounded-lg
              ">

              BP:
              {report.vitals.bpSystolic}/
              {report.vitals.bpDiastolic}

              {" | "}

              HR:
              {report.vitals.heartRate}


              </p>

              }




            </div>




          </div>


        ))

        }





        {
        filteredReports.length===0 &&

        <div className="
        text-center
        col-span-2
        p-10
        text-gray-400
        ">

          No reports found

        </div>

        }



        </div>


        }



      </div>


    </AdminLayout>


  );

};





const StatCard=({
  title,
  value,
  icon
})=>(


<div className="
bg-white
rounded-2xl
p-5
shadow
">


<div className="
flex
items-center
gap-3
">


<div className="
text-pink-500
">

{icon}

</div>


<div>

<p className="
text-gray-500
text-sm
">

{title}

</p>


<h2 className="
text-3xl
font-bold
">

{value}

</h2>


</div>


</div>


</div>


);



export default AdminReports;
