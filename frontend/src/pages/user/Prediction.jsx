import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaHeartbeat,
  FaFileMedical,
  FaArrowLeft,
  FaChartLine,
  FaRobot,
  FaShieldAlt,
  FaUserInjured,
  FaNotesMedical,
  FaCheckCircle,
  FaHospital,
  FaTint,
  FaBaby,
  FaStethoscope,
  FaBell,
  FaCalendarAlt,
  FaSpinner,
  FaLightbulb,
  FaUser,
} from "react-icons/fa";

import bg from "../../assets/images/bg.png";
import UserSidebar from "../../components/UserSidebar";


function Prediction() {


  const [riskData, setRiskData] = useState({

    risk: "Not assessed",

    score: null,

    confidence: null,

    recommendation: "",

    symptoms: [],

    riskFactors: [],

    vitals: {},

  });



  const [isLoading, setIsLoading] = useState(true);


  const [heartRate, setHeartRate] = useState(78);


  const [bloodPressure, setBloodPressure] = useState("120/80");




  useEffect(() => {


    const loadRisk = () => {


      try {


        const currentUser =
          JSON.parse(localStorage.getItem("currentUser")) || {};



        const mlResult =
          JSON.parse(
            localStorage.getItem("predictionResult") || "null"
          );



        const patientVitals =
          JSON.parse(
            localStorage.getItem("patientVitals") || "{}"
          );

        if (!mlResult || typeof mlResult.risk_score !== "number") {
          setRiskData({ risk: "Not assessed", score: null, confidence: null, recommendation: "Complete the symptoms assessment to generate your personalised risk prediction.", symptoms: [], riskFactors: [], vitals: {} });
          return;
        }

// The backend returns a clinical screening percentage.  Do not mix it with
// the model's class-confidence values: doing so turned a 2% fatigue result
// into an incorrect 50% score on this screen.
// The API returns the trained model's class and probability. Do not recreate
// a risk class from the separate clinical screening score in the browser.
const displayedScore = Math.max(0, Math.min(100, Math.round(Number(mlResult.probability_percent) || 0)));
const riskLevel = mlResult.risk_level || "Not assessed";

const saved = {
  recommendation: mlResult.recommendation || "",

  risk: riskLevel,
 score: displayedScore,

  // ML confidence (highest probability)
  confidence: displayedScore,

  // Keep probabilities if you want to display them
  lowRisk: Number(mlResult.low_risk || 0),
  mediumRisk: Number(mlResult.medium_risk || 0),
  highRisk: Number(mlResult.high_risk || 0),

  symptoms: patientVitals.symptoms || [],
  riskFactors: mlResult.reasons || [],
  vitals: patientVitals
};





        // Heart Rate Loading


        let hr = 78;



        const heartRateData =
          localStorage.getItem("heartRate");



        if(heartRateData){


          try{


            const parsed =
              JSON.parse(heartRateData);



            if(
              typeof parsed === "number" &&
              parsed > 0
            ){

              hr = parsed;

            }


            else if(
              typeof parsed === "string" &&
              !isNaN(parsed)
            ){

              hr = Number(parsed);

            }



          }

          catch{


            const num =
              Number(heartRateData);



            if(
              !isNaN(num) &&
              num > 0
            ){

              hr = num;

            }

          }

        }





        if(
          saved.vitals?.heartRate &&
          saved.vitals.heartRate > 0
        ){

          hr =
            saved.vitals.heartRate;

        }



        setHeartRate(hr);







        // Blood Pressure


        if(

          saved.vitals?.bpSystolic &&

          saved.vitals?.bpDiastolic

        ){

          setBloodPressure(

            `${saved.vitals.bpSystolic}/${saved.vitals.bpDiastolic}`

          );

        }







        // SEND DATA TO DOCTOR DASHBOARD


        const doctorUpdates =

          JSON.parse(
            localStorage.getItem(
              "doctorPatientUpdates"
            )
          ) || [];




        const existingIndex =

          doctorUpdates.findIndex(

            (p)=>

              p.email === currentUser.email

          );






        const updateData = {


          patient:

            currentUser.name,



          email:

            currentUser.email,



          risk:

            saved.risk,



          score:

            saved.score,



          confidence:

            saved.confidence,



          symptoms:

            saved.symptoms,



          riskFactors:

            saved.riskFactors,



          vitals:

            saved.vitals,



          heartRate:

            hr,



          updatedAt:

            new Date().toLocaleString()



        };






        if(existingIndex !== -1){


          doctorUpdates[existingIndex] =
            updateData;


        }

        else{


          doctorUpdates.push(updateData);


        }






        localStorage.setItem(

          "doctorPatientUpdates",

          JSON.stringify(doctorUpdates)

        );







        setRiskData(saved);



      }

      catch(err){


        console.error(
          "Prediction Load Error:",
          err
        );


      }


      finally{


        setIsLoading(false);
      }
 };

    loadRisk();
    window.addEventListener(
      "storage",
      loadRisk
    );
    return ()=>{
      window.removeEventListener(
        "storage",
        loadRisk
      );

    };



  }, []);
    const getTheme = () => {


    if (riskData.risk === "High") {


      return {

        bg: "from-red-500 to-pink-500",

        card: "bg-red-50 border-red-100",

        text: "text-red-500",

        badge: "bg-red-100 text-red-600",

        emoji: "🔴",

        status: "Critical",


      };


    }





    if (
      riskData.risk === "Medium" ||
      riskData.risk === "Moderate"
    ) {


      return {


        bg: "from-orange-400 to-pink-400",

        card: "bg-orange-50 border-orange-100",

        text: "text-orange-500",

        badge: "bg-orange-100 text-orange-600",

        emoji: "🟡",

        status: "Attention Needed",


      };


    }





    return {


      bg: "from-pink-500 to-sky-400",

      card: "bg-pink-50 border-pink-100",

      text: "text-pink-500",

      badge: "bg-pink-100 text-pink-600",

      emoji: "🟢",

      status: "Good",


    };


  };




  const theme = getTheme();






  const suggestions = {


    Low: [

      "Continue prenatal supplements regularly",

      "Drink 8-10 glasses of water daily",

      "Attend scheduled checkups on time",

      "Walk daily for 20-30 minutes",

      "Maintain a balanced diet",

    ],




    Moderate: [

      "Monitor blood pressure regularly",

      "Consult your gynecologist within 24 hours",

      "Increase hydration and rest",

      "Avoid unnecessary stress",

      "Track fetal movements",

    ],




    Medium: [

      "Monitor blood pressure regularly",

      "Consult your gynecologist within 24 hours",

      "Increase hydration and rest",

      "Avoid unnecessary stress",

      "Track fetal movements",

    ],




    High: [

      "Visit hospital immediately",

      "Monitor fetal movement",

      "Stay under medical observation",

      "Avoid physical strain",

      "Contact doctor if symptoms worsen",

    ],


  };







  const getRiskKey = () => {


    if(riskData.risk === "High")

      return "High";



    if(
      riskData.risk === "Medium" ||
      riskData.risk === "Moderate"
    )

      return "Moderate";



    return "Low";


  };







  return (


    <div

      className="relative min-h-screen bg-cover bg-center flex"

      style={{

        backgroundImage:`url(${bg})`

      }}

    >





      {/* Glass Overlay */}


      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>







      {/* Floating Background Blobs */}



      <div

        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"

      ></div>




      <div

        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse"

      ></div>






      <div

        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-pink-200 blur-[120px] opacity-10 animate-pulse"

      ></div>
      <UserSidebar />
      {/* Legacy navigation kept out of the DOM layout; all user pages now use
          the shared, responsive sidebar above. */}
      <div className="hidden">
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard" />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/reports" />
          <NavItem label="Prescriptions" icon={<FaFileMedical />} to="/prescriptions" />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
          <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" active />
          <NavItem label="Alerts" icon={<FaBell />} to="/alerts" />
          <NavItem label="Appointments" icon={<FaCalendarAlt />} to="/appointment" />
          <NavItem label="Reminders" icon={<FaBell />} to="/reminders" />
          <NavItem label="Feedback" icon={<FaLightbulb />} to="/share-feedback" />
          <NavItem label="Profile" icon={<FaUser />} to="/profile" />
          <NavItem label="Settings" icon={<FaShieldAlt />} to="/settings" />
        </div>

        <div className="pt-4 border-t border-pink-100/50">
          <button
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
            className="w-full bg-pink-100 text-pink-600 px-5 py-2 rounded-xl hover:bg-pink-200 transition-all duration-300 text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}



      <div

        className="relative z-10 flex-1 px-4 py-4 sm:px-6 lg:ml-64 lg:px-8"

      >







        {/* TOP BAR */}



        <div

          className="flex flex-wrap justify-between items-center gap-4 mb-6 sticky top-0 bg-white/30 backdrop-blur-sm py-3 px-4 rounded-2xl -mx-4 z-20"

        >



          <div>


            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">


              <FaRobot className="text-pink-500"/>


              ML Pregnancy Prediction



              <span className="text-sm font-normal text-gray-500 bg-pink-50 px-3 py-1 rounded-full">


                {theme.emoji} {theme.status}


              </span>



            </h2>





            <p className="text-sm text-gray-500 mt-1">


              Hospital Decision Support Dashboard


            </p>



          </div>








          <Link


            to="/dashboard"


            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-sky-400 text-white px-6 py-2.5 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"


          >


            <FaArrowLeft/>


            Dashboard


          </Link>




        </div>
                {isLoading ? (

          <div className="flex justify-center items-center h-64">

            <div className="text-center">

              <FaSpinner className="text-5xl text-pink-500 animate-spin mx-auto mb-4"/>

              <p className="text-gray-500">
                Loading prediction data...
              </p>

            </div>

          </div>


        ) : (


        <>





        {/* TOP GRID */}


        <div className="grid lg:grid-cols-3 gap-6 mb-6">






          {/* AI SCORE CARD */}


          <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border border-white/70">





            <div className="flex items-center gap-4">


              <div

                className={`w-20 h-20 rounded-full bg-gradient-to-br ${theme.bg} flex items-center justify-center text-white text-4xl shadow-lg animate-pulse`}

              >

                <FaRobot/>

              </div>




              <div>


                <h2 className="text-3xl font-bold text-gray-800">

                  Pregnancy Risk Analysis

                </h2>



                <p className="text-gray-500">

                  Clinical screening assessment

                </p>


              </div>



            </div>









            {/* RISK SCORE CIRCLE */}


            <div className="flex justify-center mt-8">


              <div

                className={`w-56 h-56 rounded-full bg-gradient-to-br ${theme.bg} flex justify-center items-center shadow-2xl animate-pulse relative`}

              >



                <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"></div>




                <div className="w-44 h-44 bg-white rounded-full flex flex-col justify-center items-center relative z-10">


                  <h2 className={`text-5xl font-bold ${theme.text}`}>


                    {riskData.score}%


                  </h2>



                  <p className="text-gray-500 text-sm">

                    Risk Percentage

                  </p>



                </div>



              </div>



            </div>








            {/* RISK LABEL */}



            <div className="text-center mt-6">


              <span

                className={`${theme.badge} px-6 py-2.5 rounded-full font-semibold text-base inline-flex items-center gap-2`}

              >


                {theme.emoji}

                {riskData.risk.toUpperCase()} RISK


              </span>


            </div>









            {/* CONFIDENCE */}



            <div className="mt-6">


              <div className="flex justify-between mb-2">


                <span className="font-semibold text-gray-700">

                  Model confidence (not risk percentage)

                </span>




                <span className="font-bold text-gray-800">

                  {riskData.confidence}%

                </span>



              </div>





              <div className="w-full bg-gray-200 rounded-full h-3">


                <div

                  className={`bg-gradient-to-r ${theme.bg} h-3 rounded-full transition-all duration-1000`}


                  style={{

                    width:`${riskData.confidence}%`

                  }}


                />


              </div>



            </div>









            {/* RISK FACTORS */}



            {

            riskData.riskFactors &&

            riskData.riskFactors.length > 0 && (


              <div className="mt-6 pt-6 border-t border-pink-100">


                <h4 className="font-semibold text-gray-700 mb-3">


                  ⚠️ Risk Factors Identified


                </h4>




                <div className="flex flex-wrap gap-2">



                  {

                  riskData.riskFactors.map(

                    (factor,index)=>(


                    <span

                      key={index}

                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-sm border border-red-200"

                    >

                      {factor}


                    </span>



                  ))}



                </div>



              </div>



            )}





          </div>












          {/* PATIENT SUMMARY */}



          <div className="space-y-6">





            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-6 border border-white/70">


              <div className="flex items-center gap-3 mb-5">


                <FaUserInjured className="text-pink-500 text-2xl"/>


                <h3 className="text-xl font-bold text-gray-800">

                  Patient Summary

                </h3>


              </div>






              <div className="space-y-4">





                <div className="flex justify-between py-2 border-b border-pink-50">


                  <span className="text-gray-500">

                    Status

                  </span>



                  <span className={`${theme.text} font-bold`}>

                    {theme.emoji}

                    {" "}

                    {riskData.risk}

                  </span>


                </div>






                <div className="flex justify-between py-2 border-b border-pink-50">


                  <span className="text-gray-500">

                  Risk Percentage

                  </span>



                  <span className="font-bold text-gray-800">

                    {riskData.score}%

                  </span>



                </div>






                <div className="flex justify-between py-2 border-b border-pink-50">


                  <span className="text-gray-500">

                    Model confidence

                  </span>




                  <span className="font-bold text-gray-800">

                    {riskData.confidence}%

                  </span>



                </div>






                <div className="flex justify-between py-2 border-b border-pink-50">


                  <span className="text-gray-500">

                    Pregnancy Week

                  </span>




                  <span className="font-bold text-gray-800">

                    {riskData.vitals?.week || "—"}

                  </span>



                </div>






                <div className="flex justify-between py-2">


                  <span className="text-gray-500">

                    Symptoms

                  </span>



                  <span className="font-bold text-gray-800">

                    {riskData.symptoms?.length || 0}

                  </span>


                </div>




              </div>



            </div>









            {/* HOSPITAL RECOMMENDATION */}



            <div

              className={`bg-gradient-to-r ${theme.bg} rounded-3xl p-6 text-white shadow-xl relative overflow-hidden`}

            >




              <FaHospital className="text-4xl mb-4 animate-bounce"/>




              <h3 className="text-xl font-bold">

                Hospital Recommendation

              </h3>




              <p className="mt-3 leading-7 text-white/90">


                {

                riskData.recommendation

                ||

                (

                riskData.risk === "High"

                ?

                "🚨 Immediate hospital consultation recommended."

                :

                riskData.risk === "Medium"

                ?

                "📋 Consult your gynecologist within 24 hours."

                :

                "✅ Continue regular prenatal care and healthy lifestyle."

                )

                }



              </p>



            </div>





          </div>





        </div>
                {/* ANALYTICS SECTION */}

        <div className="grid lg:grid-cols-3 gap-6 mb-6">



          {/* HEART RATE */}


          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-lg p-6 border border-white/70 hover:-translate-y-1 transition-all">


            <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-4">


              <FaHeartbeat className="text-3xl text-pink-500"/>


            </div>



            <h3 className="font-bold text-xl text-gray-800">

              Heart Rate

            </h3>



            <p className="text-4xl font-bold mt-2 text-pink-500">

              {heartRate} BPM

            </p>



            <p className="text-gray-500 mt-2 text-sm">

              {
              heartRate >=60 && heartRate<=100

              ?

              "Normal range"

              :

              heartRate >100

              ?

              "Elevated - Monitor"

              :

              "Low - Consult doctor"

              }

            </p>


          </div>







          {/* BLOOD PRESSURE */}


          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-lg p-6 border border-white/70 hover:-translate-y-1 transition-all">


            <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mb-4">


              <FaTint className="text-3xl text-sky-500"/>


            </div>



            <h3 className="font-bold text-xl text-gray-800">

              Blood Pressure

            </h3>



            <p className="text-4xl font-bold mt-2 text-sky-500">

              {bloodPressure}

            </p>



            <p className="text-gray-500 mt-2 text-sm">

              Monitor regularly

            </p>


          </div>







          {/* BABY STATUS */}


          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-lg p-6 border border-white/70 hover:-translate-y-1 transition-all">


            <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-4">


              <FaBaby className="text-3xl text-pink-500"/>


            </div>



            <h3 className="font-bold text-xl text-gray-800">

              Baby Status

            </h3>




            <p className="text-4xl font-bold mt-2 text-pink-500">


              {

              riskData.risk === "High"

              ?

              "Monitoring"

              :

              riskData.risk === "Medium" ||
              riskData.risk === "Moderate"

              ?

              "Checkups"

              :

              "Healthy"

              }


            </p>



            <p className="text-gray-500 mt-2 text-sm">


              {

              riskData.risk === "High"

              ?

              "Needs attention"

              :

              "Progressing normally"

              }


            </p>



          </div>




        </div>









        {/* SYMPTOMS */}



        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 mb-6 border border-white/70">


          <div className="flex items-center gap-3 mb-6">


            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">


              <FaNotesMedical className="text-pink-500 text-2xl"/>


            </div>



            <h2 className="text-2xl font-bold text-gray-800">

              Selected Symptoms

            </h2>



            <span className="ml-auto text-sm text-gray-400 bg-pink-50 px-3 py-1 rounded-full">


              {riskData.symptoms?.length || 0} symptoms


            </span>


          </div>





          {

          riskData.symptoms?.length > 0

          ?

          <div className="flex flex-wrap gap-3">


            {

            riskData.symptoms.map((symptom,index)=>(


              <div

                key={index}

                className="px-5 py-2.5 rounded-full bg-pink-100 text-pink-600 font-semibold border border-pink-200"

              >

                {symptom}

              </div>



            ))}



          </div>


          :


          <p className="text-gray-500 text-center py-4">

            No symptoms selected.

          </p>



          }




        </div>









        {/* ML RECOMMENDATIONS */}



        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl p-8 mb-6 border border-white/70">


          <div className="flex items-center gap-3 mb-6">


            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center">


              <FaRobot className="text-white text-2xl"/>


            </div>



            <h2 className="text-2xl font-bold text-gray-800">

              ML Recommendations

            </h2>


          </div>





          <div className="grid md:grid-cols-2 gap-4">


            {

            suggestions[getRiskKey()]?.map((tip,index)=>(



              <div

                key={index}

                className="bg-gradient-to-r from-pink-50 to-sky-50 border border-pink-100 rounded-2xl p-4 flex gap-4"

              >


                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center">


                  <FaCheckCircle className="text-white"/>


                </div>




                <div>


                  <h4 className="font-semibold">

                    Recommendation {index+1}

                  </h4>



                  <p className="text-gray-600 text-sm">

                    {tip}

                  </p>



                </div>



              </div>




            ))}



          </div>




        </div>









        {/* DOCTOR ADVICE */}



        <div className={`bg-gradient-to-r ${theme.bg} rounded-3xl shadow-xl p-8 mb-6 text-white`}>



          <div className="flex items-center gap-4 mb-6">


            <FaStethoscope className="text-5xl"/>


            <div>


              <h2 className="text-3xl font-bold">

                Doctor's Advice

              </h2>


              <p className="text-white/90">

                ML prediction is only decision support.

              </p>


            </div>


          </div>





          <div className="grid md:grid-cols-3 gap-6">


            <div className="bg-white/20 rounded-2xl p-5">


              <h3 className="font-bold">

                🩺 Consultation

              </h3>


              <p className="text-sm mt-2">

                Schedule regular prenatal checkups.

              </p>


            </div>




            <div className="bg-white/20 rounded-2xl p-5">


              <h3 className="font-bold">

                💧 Hydration

              </h3>


              <p className="text-sm mt-2">

                Maintain hydration and balanced diet.

              </p>


            </div>




            <div className="bg-white/20 rounded-2xl p-5">


              <h3 className="font-bold">

                👶 Baby Care

              </h3>


              <p className="text-sm mt-2">

                Monitor baby movements regularly.

              </p>


            </div>



          </div>



        </div>





        </>

        )}



        <div className="mt-8 text-center text-sm text-gray-400 border-t border-pink-100 pt-6">


          © 2026 GlowCare — Safe Pregnancy, Smart Monitoring 🤰


        </div>



      </div>



    </div>


  );

}




const NavItem = ({label, icon, to, active}) => (

<Link

to={to}

className={`flex items-center gap-3 p-3 rounded-xl transition-all

${

active

?

"bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"

:

"hover:bg-pink-100 text-gray-700 hover:translate-x-2"

}`}

>


{icon}


<span className="text-sm font-medium">

{label}

</span>


</Link>

);



export default Prediction;
