import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHeartbeat,
  FaFileMedical,
  FaNotesMedical,
  FaLightbulb,
  FaUser,
  FaCalendarAlt,
  FaWeight,
  FaHeart,
  FaTint,
  FaThermometerHalf,
  FaClipboardList,
  FaShieldAlt,
  FaBaby,
  FaChartLine,
  FaBell,
  FaUserMd,
  FaRuler,
} from "react-icons/fa";

import bg from "../../assets/images/bg.png";
import { refreshAccessToken } from "../../services/authService";


const symptomsList = [
  "Headache",
  "Nausea",
  "Vomiting",
  "Swelling",
  "Blurred Vision",
  "Bleeding",
  "Abdominal Pain",
  "Chest Pain",
  "Dizziness",
  "Fever",
  "Fatigue",
  "Back Pain",
  "Reduced Baby Movement",
];


function Symptoms() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);


  const [user, setUser] = useState(null);


  const [form, setForm] = useState({

    age: "",
    week: "",
    weight: "",
    prePregnancyWeight: "",
    height: "",

    babyCount: "1",

    bpSystolic: "",
    bpDiastolic: "",

    heartRate: "",

    sugar: "",

    temperature: "",


    babyWeight: "",
    babyHeartRate: "",
    cervicalLength: "",

    // Required model features. Keep them blank until the patient answers;
    // never silently substitute "0" for clinical history.
    previousComplications: "",
    preexistingDiabetes: "",
    gestationalDiabetes: "",
    mentalHealth: "",


    symptoms: [],

  });



  useEffect(() => {

    const currentUser =
      JSON.parse(localStorage.getItem("currentUser")) || {};

    setUser(currentUser);

  }, []);




  const updateField = (field, value) => {

    setForm((prev)=>({

      ...prev,

      [field]:value

    }));

  };





  const toggleSymptom = (symptom)=>{


    if(form.symptoms.includes(symptom)){


      updateField(
        "symptoms",
        form.symptoms.filter(
          (item)=>item!==symptom
        )
      );


    }
    else{


      updateField(
        "symptoms",
        [
          ...form.symptoms,
          symptom
        ]
      );


    }

  };






  const sendDoctorNotification = (symptoms)=>{


    if(!user) return;


    const notifications =
      JSON.parse(
        localStorage.getItem("doctorNotifications")
      ) || [];



    notifications.push({

      patient:user.name,

      email:user.email,

      symptoms:symptoms,

      message:
      "New symptoms reported by patient",

      time:
      new Date().toLocaleString()

    });



    localStorage.setItem(
      "doctorNotifications",
      JSON.stringify(notifications)
    );


  };







  // BACKEND ML PREDICTION API

  const analyzeRisk = async()=>{


    try{


      setIsLoading(true);


    const requiredFields = [
      ["Age", form.age], ["Pregnancy week", form.week], ["Weight", form.weight],
      ["Height", form.height], ["Systolic BP", form.bpSystolic],
      ["Diastolic BP", form.bpDiastolic], ["Heart rate", form.heartRate],
      ["Blood sugar", form.sugar], ["Temperature", form.temperature],
      ["Baby count", form.babyCount], ["Baby weight", form.babyWeight],
      ["Baby heart rate", form.babyHeartRate], ["Cervical length", form.cervicalLength],
      ["Previous complications", form.previousComplications],
      ["Pre-existing diabetes", form.preexistingDiabetes],
      ["Gestational diabetes", form.gestationalDiabetes], ["Mental health support", form.mentalHealth],
    ];
    const missing = requiredFields.find(([, value]) => value === "" || value === null || value === undefined);
    if (missing) throw new Error(`Please complete: ${missing[0]}.`);

    const heightInMeters = Number(form.height) / 100;

const bmi =
  heightInMeters > 0
    ? Number(
        (
          Number(form.weight) /
          (heightInMeters * heightInMeters)
        ).toFixed(1)
      )
    : NaN;
      if (!Number.isFinite(bmi)) throw new Error("Enter a valid height and weight to calculate BMI.");
      const payload = {

  age: Number(form.age),

  systolic_bp: Number(form.bpSystolic),
  diastolic_bp: Number(form.bpDiastolic),

  blood_sugar: Number(form.sugar),
  body_temp: Number(form.temperature),

  bmi,

  heart_rate: Number(form.heartRate),


  previous_complications: Number(form.previousComplications),
  preexisting_diabetes: Number(form.preexistingDiabetes),
  gestational_diabetes: Number(form.gestationalDiabetes),
  mental_health: Number(form.mentalHealth),


  pregnancy_week: Number(form.week),

  baby_count: Number(form.babyCount),

  baby_weight: Number(form.babyWeight),

  baby_heart_rate: Number(form.babyHeartRate),

  cervical_length: Number(form.cervicalLength),



  // Symptoms converted to ML format

  headache:
    form.symptoms.includes("Headache") ? 1 : 0,

  nausea:
    form.symptoms.includes("Nausea") ? 1 : 0,

  vomiting:
    form.symptoms.includes("Vomiting") ? 1 : 0,

  swelling:
    form.symptoms.includes("Swelling") ? 1 : 0,

  blurred_vision:
    form.symptoms.includes("Blurred Vision") ? 1 : 0,

  bleeding:
    form.symptoms.includes("Bleeding") ? 1 : 0,

  abdominal_pain:
    form.symptoms.includes("Abdominal Pain") ? 1 : 0,

  reduced_baby_movement:
    form.symptoms.includes("Reduced Baby Movement") ? 1 : 0,
  symptoms: form.symptoms

};



      console.log(
        "Sending Data:",
        payload
      );




      const predictionRequest = (token) => fetch(
        "http://127.0.0.1:8000/api/prediction/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      let response = await predictionRequest(localStorage.getItem("token"));

      // Access tokens may expire while the form is open.  Refresh once and
      // retry the same prediction instead of showing an avoidable error.
      if (response.status === 401) {
        const refreshedToken = await refreshAccessToken();
        if (refreshedToken) {
          response = await predictionRequest(refreshedToken);
        }
      }




      const result =
      await response.json();

      if (!response.ok || typeof result.risk_score !== "number") {
        const detail = Array.isArray(result.detail)
          ? result.detail.map(item => item.msg).join(", ")
          : result.detail || "Prediction could not be completed. Please check all required values.";
        throw new Error(detail);
      }

    console.log(
  "422 DETAIL:",
  JSON.stringify(result.detail, null, 2)
);


      console.log(
        "Prediction Result:",
        result
      );





      localStorage.setItem(

        "predictionResult",

        JSON.stringify(result)

      );



localStorage.setItem(
  "patientVitals",
  JSON.stringify({
    ...payload,
    week: form.week,
    weight: form.weight,
    height: form.height,
    babyCount: form.babyCount,
    babyWeight: form.babyWeight,
    babyHeartRate: form.babyHeartRate,
    cervicalLength: form.cervicalLength,
    symptoms: form.symptoms
  })
);





      sendDoctorNotification(
        form.symptoms
      );





      navigate("/prediction");




    }

    catch(error){


      console.error(
        "Prediction Error:",
        error
      );
      alert(error.message || "Prediction could not be completed. Please try again.");


    }

    finally{


      setIsLoading(false);


    }



  };
  return (

    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex"

      style={{
        backgroundImage:`url(${bg})`
      }}

    >


      {/* Glass Overlay */}

      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>



      {/* Floating Background */}

      <div className="
      absolute top-0 left-0 
      w-96 h-96 rounded-full 
      bg-pink-300 blur-[140px] 
      opacity-20 animate-pulse
      "></div>



      <div className="
      absolute bottom-0 right-0 
      w-[500px] h-[500px] 
      rounded-full bg-sky-300 
      blur-[150px] opacity-20 
      animate-pulse
      "></div>



      <div className="fixed left-0 top-0 z-40 w-64 bg-white/80 backdrop-blur-2xl border-r border-pink-100/50 p-5 h-screen flex flex-col">
        <Link to="/dashboard" className="block">
          <h1 className="text-2xl font-bold text-pink-500">GlowCare</h1>
          <p className="text-sm text-gray-500">Maternal Health System</p>
        </Link>

        <div className="mt-8 space-y-2 flex-1 overflow-y-auto">
          <NavItem label="Dashboard" icon={<FaHeartbeat />} to="/dashboard"  />
          <NavItem label="Reports" icon={<FaFileMedical />} to="/reports" />
          <NavItem label="Prescriptions" icon={<FaFileMedical />} to="/prescriptions" />
          <NavItem label="Pregnancy Toolkit" icon={<FaBaby />} to="/toolkit" />
          <NavItem label="Symptoms" icon={<FaNotesMedical />} to="/symptoms" active />
          <NavItem label="Suggestions" icon={<FaLightbulb />} to="/suggestions" />
          <NavItem label="Prediction" icon={<FaChartLine />} to="/prediction" />
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


      <div className="
      relative z-10 ml-64 
      flex-1 px-6 py-6
      ">



        <div className="
        mb-6 bg-white/30 
        backdrop-blur-sm
        rounded-2xl p-4
        ">


          <h2 className="
          text-2xl font-extrabold 
          text-gray-800 flex gap-2 items-center
          ">

            <FaClipboardList
              className="text-pink-500"
            />

            Symptoms Assessment

          </h2>



          <p className="
          text-gray-500 text-sm mt-1
          ">

            Fill today's health details for ML risk analysis

          </p>


        </div>






        {/* QUICK STATS */}


        <div className="
        grid grid-cols-2 sm:grid-cols-4 
        gap-4 mb-6
        ">


          <QuickStat
            icon={<FaUser/>}
            label="Age"
            value={form.age || "—"}
            color="pink"
          />


          <QuickStat
            icon={<FaCalendarAlt/>}
            label="Week"
            value={form.week || "—"}
            color="sky"
          />


          <QuickStat
            icon={<FaWeight/>}
            label="Weight"
            value={
              form.weight
              ? `${form.weight} kg`
              :"—"
            }
            color="purple"
          />


          <QuickStat
            icon={<FaHeart/>}
            label="Heart Rate"
            value={
              form.heartRate
              ? `${form.heartRate} bpm`
              :"—"
            }
            color="red"
          />



        </div>







        {/* HEALTH VITALS */}



        <div className="
        bg-white/80 backdrop-blur-2xl
        rounded-3xl p-6
        shadow-lg mb-6
        ">



          <h3 className="
          text-xl font-bold 
          mb-4 flex gap-2 items-center
          ">


            <FaUserMd
              className="text-pink-500"
            />

            Health Vitals


          </h3>





          <div className="
          grid grid-cols-1 sm:grid-cols-2 
          lg:grid-cols-4 gap-4
          ">


            <InputField
              label="Age (years)"
              value={form.age}
              icon={<FaUser/>}
              onChange={(e)=>
                updateField(
                  "age",
                  e.target.value
                )
              }
              placeholder="28"
            />



            <InputField
              label="Pregnancy Week"
              value={form.week}
              icon={<FaCalendarAlt/>}
              onChange={(e)=>
                updateField(
                  "week",
                  e.target.value
                )
              }
              placeholder="24"
            />



            <InputField
              label="Weight (kg)"
              value={form.weight}
              icon={<FaWeight/>}
              onChange={(e)=>
                updateField(
                  "weight",
                  e.target.value
                )
              }
              placeholder="68"
            />
          <InputField
  label="Height (cm)"
  value={form.height}
  icon={<FaRuler />}
  onChange={(e) =>
    updateField(
      "height",
      e.target.value
    )
  }
  placeholder="165"
/>


            <InputField
              label="Pre Pregnancy Weight"
              value={form.prePregnancyWeight}
              icon={<FaWeight/>}
              onChange={(e)=>
                updateField(
                  "prePregnancyWeight",
                  e.target.value
                )
              }
              placeholder="55"
            />



            <InputField
              label="Heart Rate"
              value={form.heartRate}
              icon={<FaHeart/>}
              onChange={(e)=>
                updateField(
                  "heartRate",
                  e.target.value
                )
              }
              placeholder="78"
            />



            <InputField
              label="Systolic BP"
              value={form.bpSystolic}
              icon={<FaTint/>}
              onChange={(e)=>
                updateField(
                  "bpSystolic",
                  e.target.value
                )
              }
              placeholder="120"
            />



            <InputField
              label="Diastolic BP"
              value={form.bpDiastolic}
              icon={<FaTint/>}
              onChange={(e)=>
                updateField(
                  "bpDiastolic",
                  e.target.value
                )
              }
              placeholder="80"
            />



            <InputField
              label="Blood Sugar"
              value={form.sugar}
              icon={<FaTint/>}
              onChange={(e)=>
                updateField(
                  "sugar",
                  e.target.value
                )
              }
              placeholder="120"
            />



            <InputField
              label="Temperature"
              value={form.temperature}
              icon={<FaThermometerHalf/>}
              onChange={(e)=>
                updateField(
                  "temperature",
                  e.target.value
                )
              }
              placeholder="36.5"
            />
            <InputField
              label="Number of Babies"
              value={form.babyCount}
              icon={<FaBaby/>}
              onChange={(e)=>
                updateField(
                  "babyCount",
                  e.target.value
                )
              }
              placeholder="1"
            />


            <InputField
              label="Baby Weight (grams)"
              value={form.babyWeight}
              icon={<FaWeight/>}
              onChange={(e)=>
                updateField(
                  "babyWeight",
                  e.target.value
                )
              }
              placeholder="2500"
            />


            <InputField
              label="Baby Heart Rate"
              value={form.babyHeartRate}
              icon={<FaHeartbeat/>}
              onChange={(e)=>
                updateField(
                  "babyHeartRate",
                  e.target.value
                )
              }
              placeholder="140"
            />


            <InputField
              label="Cervical Length (mm)"
              value={form.cervicalLength}
              icon={<FaRuler/>}
              onChange={(e)=>
                updateField(
                  "cervicalLength",
                  e.target.value
                )
              }
              placeholder="35"
            />



          </div>

        </div>






        {/* SYMPTOMS */}

        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-2 flex gap-2 items-center"><FaClipboardList className="text-pink-500" />Health history</h3>
          <p className="text-sm text-gray-500 mb-4">These answers are required by the prediction model. Select Yes only when applicable.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <YesNoField label="Previous pregnancy complications" value={form.previousComplications} onChange={(value) => updateField("previousComplications", value)} />
            <YesNoField label="Pre-existing diabetes" value={form.preexistingDiabetes} onChange={(value) => updateField("preexistingDiabetes", value)} />
            <YesNoField label="Gestational diabetes" value={form.gestationalDiabetes} onChange={(value) => updateField("gestationalDiabetes", value)} />
            <YesNoField label="Receiving mental-health support" value={form.mentalHealth} onChange={(value) => updateField("mentalHealth", value)} />
          </div>
        </div>

        <div className="
        bg-white/80 backdrop-blur-2xl
        rounded-3xl p-6 shadow-lg
        mb-6
        ">


          <div className="
          flex justify-between items-center mb-4
          ">


            <h3 className="
            text-xl font-bold 
            flex items-center gap-2
            ">


              <FaClipboardList
                className="text-pink-500"
              />

              Select Symptoms


            </h3>



            <span className="
            text-sm text-gray-400
            ">

              {form.symptoms.length} selected

            </span>



          </div>





          <div className="
          grid grid-cols-2 sm:grid-cols-3 
          lg:grid-cols-4 gap-3
          ">


            {symptomsList.map((symptom)=>(


              <SymptomCard

                key={symptom}

                symptom={symptom}

                selected={
                  form.symptoms.includes(symptom)
                }

                onClick={()=>
                  toggleSymptom(symptom)
                }

              />


            ))}



          </div>



        </div>








        {/* BUTTONS */}


        <div className="
        flex flex-wrap gap-4
        ">



          <button

            onClick={analyzeRisk}

            disabled={
              isLoading ||
              form.symptoms.length===0
            }


            className="
            flex-1 min-w-[220px]
            bg-gradient-to-r 
            from-pink-500 to-sky-400
            text-white
            px-8 py-4
            rounded-2xl
            text-lg font-semibold
            hover:scale-105
            transition-all
            disabled:opacity-50
            flex items-center
            justify-center gap-2
            "

          >


            {
              isLoading ?

              (
                <>
                  <span className="animate-spin">
                    ⏳
                  </span>

                  Analyzing...
                </>

              )

              :

              (

                <>

                <FaShieldAlt/>

                Analyze Pregnancy Risk

                </>


              )

            }



          </button>






          <button


            onClick={()=>{


              setForm({

                age:"",
                week:"",
                weight:"",
                prePregnancyWeight:"",
                height:"",

                babyCount:"1",

                bpSystolic:"",
                bpDiastolic:"",

                heartRate:"",

                sugar:"",

                temperature:"",

                babyWeight:"",
                babyHeartRate:"",
                cervicalLength:"",

                previousComplications:"",
                preexistingDiabetes:"",
                gestationalDiabetes:"",
                mentalHealth:"",

                symptoms:[]

              });



            }}



            className="
            bg-gray-200
            text-gray-700
            px-8 py-4
            rounded-2xl
            font-semibold
            hover:bg-gray-300
            "


          >

            Clear All


          </button>



        </div>








        {
          form.symptoms.length===0 &&
          !isLoading &&

          (

            <div className="
            mt-4
            bg-blue-50
            border border-blue-200
            rounded-2xl p-4
            text-center
            ">


              <p className="
              text-blue-600 text-sm
              ">

                💡 Select at least one symptom
                to get risk assessment

              </p>


            </div>


          )

        }






        {/* FOOTER */}


        <div className="
        mt-8 text-center
        text-sm text-gray-400
        border-t border-pink-100
        pt-6
        ">


          © 2026 GlowCare —
          Safe Pregnancy, Smart Monitoring 🤰


        </div>





      </div>


    </div>


  );


}
/* ===== COMPONENTS ===== */


const NavItem = ({
  label,
  icon,
  to,
  active
}) => (

  <Link

    to={to}

    className={`
      flex items-center gap-3
      p-3 rounded-xl
      transition-all duration-300

      ${
        active

        ?

        "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"

        :

        "hover:bg-pink-100 text-gray-700 hover:translate-x-2"

      }

    `}

  >

    {icon}

    <span className="
    text-sm font-medium
    ">

      {label}

    </span>


  </Link>

);







const InputField = ({
  label,
  value,
  onChange,
  icon,
  placeholder
}) => (

  <div className="
  space-y-1.5
  ">


    <label className="
    text-sm font-medium
    text-gray-700
    flex items-center gap-1.5
    ">

      {icon}

      {label}

    </label>




    <input

      type="number"

      value={value}

      onChange={onChange}

      onKeyDown={(event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const fields = Array.from(document.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'));
        const next = fields[fields.indexOf(event.currentTarget) + 1];
        next?.focus();
      }}

      placeholder={placeholder}

      className="
      w-full
      rounded-xl
      border border-pink-100
      bg-white/90
      px-4 py-3
      outline-none
      transition-all
      focus:border-sky-300
      focus:ring-2
      focus:ring-sky-100
      hover:shadow-md
      "

    />


  </div>


);

const YesNoField = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-pink-100 bg-white/90 px-4 py-3 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100">
      <option value="">Select</option>
      <option value="0">No</option>
      <option value="1">Yes</option>
    </select>
  </div>
);









const SymptomCard = ({
  symptom,
  selected,
  onClick
}) => (

  <button

    onClick={onClick}


    className={`
      p-3 rounded-xl
      text-sm font-medium
      transition-all duration-300

      ${
        selected

        ?

        "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg scale-105"

        :

        "bg-white/60 text-gray-700 hover:bg-pink-50 hover:shadow-md border border-pink-100"

      }

    `}


  >

    {symptom}


    {
      selected &&

      <span className="
      ml-1
      ">
        ✓
      </span>

    }


  </button>


);









const QuickStat = ({
  icon,
  label,
  value,
  color
}) => (

  <div className="
  bg-white/80
  backdrop-blur-2xl
  rounded-2xl
  p-4
  shadow-md
  border border-white/70
  hover:shadow-xl
  transition-all
  hover:-translate-y-1
  ">


    <div className="
    flex items-center gap-2
    ">


      <span className={`
      text-2xl text-${color}-500
      `}>

        {icon}

      </span>


      <p className="
      text-xs text-gray-500
      ">

        {label}

      </p>


    </div>




    <p className="
    text-xl font-bold
    text-gray-800 mt-1
    ">

      {value}

    </p>



  </div>


);






export default Symptoms;
