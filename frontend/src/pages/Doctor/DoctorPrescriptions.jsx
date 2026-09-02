import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  FaAmbulance,
  FaBell,
  FaCalendarCheck,
  FaCheckCircle,
  FaChartLine,
  FaCog,
  FaEdit,
  FaEnvelope,
  FaFileMedical,
  FaNotesMedical,
  FaPlus,
  FaPrescription,
  FaSearch,
  FaSignOutAlt,
  FaSpinner,
  FaStethoscope,
  FaTimes,
  FaTrash,
  FaUser,
  FaUserMd,
  FaUsers
} from "react-icons/fa";

import bg from "../../assets/images/bg.png";


const EMPTY_FORM = {

  patientId:"",
  patientName:"",
  patientEmail:"",
  medicine:"",
  dosage:"",
  frequency:"",
  timing:"",
  instructions:"",
  status:"active"

};


const DoctorPrescriptions = () => {


  const navigate = useNavigate();


  const location = useLocation();



  const [doctor,setDoctor] =
    useState(null);



  const [
    prescriptions,
    setPrescriptions
  ] = useState([]);



  const [
    searchTerm,
    setSearchTerm
  ] = useState("");



  const [
    statusFilter,
    setStatusFilter
  ] = useState("all");



  const [
    showForm,
    setShowForm
  ] = useState(false);



  const [
    editingPrescription,
    setEditingPrescription
  ] = useState(null);



  const [
    formData,
    setFormData
  ] = useState(EMPTY_FORM);



  const [
    loading,
    setLoading
  ] = useState(true);



  const [
    saving,
    setSaving
  ] = useState(false);



  const API_URL =
    "http://127.0.0.1:8000/api";


const getAuthToken = () => {

  const stored =
    localStorage.getItem("currentUser");


  if(!stored){
    console.log("No currentUser found");
    return "";
  }


  const user =
    JSON.parse(stored);


  console.log(
    "CURRENT USER TOKEN:",
    user
  );


  return localStorage.getItem("token") || localStorage.getItem("access_token") || user.token || user.access_token || "";

};


  useEffect(() => {


    let currentUser = null;


    try {

      currentUser =
        JSON.parse(
          localStorage.getItem(
            "currentUser"
          ) || "null"
        );


    } catch(error){

      console.error(
        "User parse error",
        error
      );

    }



    if(
      !currentUser ||
      currentUser.role !== "doctor"
    ){

      navigate(
        "/doctor-login"
      );

      return;

    }



    setDoctor(
      currentUser
    );


    loadPrescriptions();



  },[
    navigate
  ]);

const loadPrescriptions = async () => {

  try {

    setLoading(true);

    const user = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    const token = getAuthToken();

console.log(
  "Prescription token found:",
  Boolean(token)
);

if (!token) {
  console.error(
    "No authentication token found. Please login again."
  );

  setPrescriptions([]);
  return;
}

    const response = await fetch(
  `${API_URL}/prescriptions/`,
  {
    method: "GET",

    headers: {
      Authorization:
`Bearer ${getAuthToken()}`,
      Accept: "application/json",
    },
  }
);
    const data = await response.json();

    console.log(
      "PRESCRIPTION RESPONSE:",
      response.status,
      data
    );

    if (!response.ok) {

      throw new Error(
        data?.detail ||
        "Failed to fetch prescriptions"
      );

    }

    const list =
      Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.prescriptions)
            ? data.prescriptions
            : [];

    console.log(
      "BACKEND PRESCRIPTION LIST:",
      list
    );

    const formatted = list.map((item) => ({

      _id:
        item._id ||
        item.id ||
        item.prescription_id ||
        "",

      patientId:
        item.patient_id ||
        item.patientId ||
        "",

      patientName:
        item.patient_name ||
        item.patientName ||
        "",

      patientEmail:
        item.patient_email ||
        item.patientEmail ||
        "",

      medicine:
        item.medicine ||
        item.medication ||
        "",

      dosage:
        item.dosage ||
        "",

      frequency:
        item.frequency ||
        "",

      timing:
        item.timing ||
        item.duration ||
        "",

      instructions:
        item.instructions ||
        "",

      status:
        item.status ||
        "active",

      createdAt:
        item.created_at ||
        item.createdAt ||
        ""

    }));

    console.log(
      "FINAL FORMATTED PRESCRIPTIONS:",
      formatted
    );

    setPrescriptions(
      formatted
    );

  }

  catch (error) {

    console.error(
      "Prescription loading error:",
      error
    );

    alert(
      error.message ||
      "Unable to load prescriptions"
    );

    // IMPORTANT:
    // Existing list ni immediately clear cheyyakudadhu

  }

  finally {

    setLoading(false);

  }

};



  useEffect(() => {


    const storedPatient = JSON.parse(localStorage.getItem("selectedPrescriptionPatient") || localStorage.getItem("selectedPatient") || "null");
    const patient = location.state?.patient || storedPatient;



    if(!patient){

      return;

    }



    setFormData({

      ...EMPTY_FORM,

      patientId: patient.id || patient._id || patient.patient_id || patient.patientId || "",


      patientName:
        patient.name ||
        patient.patient ||
        "",



      patientEmail:
        patient.email ||
        patient.patientEmail ||
        "",


    });



    setEditingPrescription(
      null
    );


    setShowForm(
      true
    );

    localStorage.removeItem("selectedPrescriptionPatient");
    localStorage.removeItem("selectedPatient");



    window.history.replaceState(
      {},
      document.title,
      location.pathname
    );



  },[
    location.state,
    location.pathname
  ]);

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <FaSpinner className="text-4xl text-pink-500 animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
  localStorage.removeItem("currentUser");
  navigate("/doctor-login");
};
const openNewPrescription = () => {

  setEditingPrescription(null);

  setFormData({
    patientName:"",
    patientEmail:"",
    medicine:"",
    dosage:"",
    frequency:"",
    timing:"",
    instructions:""
  });

  setShowForm(true);

};
const handleInputChange = (e)=>{

const {
name,
value
}=e.target;


setFormData(prev=>({
...prev,
[name]:value
}));

};
const handleSavePrescription = async(e)=>{

  e.preventDefault();


  try{

    setSaving(true);


    const user =
      JSON.parse(
        localStorage.getItem("currentUser")
      );


    const payload = {

      doctor_id:
        user._id || user.id,


      doctor_name:
        user.name,


      patient_id:
        editingPrescription?.patientId ||
        formData.patientId ||
        null,


      patient_name:
        formData.patientName,


      patient_email:
        formData.patientEmail,


      medicine:
        formData.medicine,


      dosage:
        formData.dosage,


      frequency:
        formData.frequency,


      timing:
        formData.timing,


      instructions:
        formData.instructions,


      status:
        "active"

    };



    console.log(
      "CREATE PRESCRIPTION PAYLOAD:",
      payload
    );


    const url =
      editingPrescription
      ?
      `${API_URL}/prescriptions/${editingPrescription._id}`
      :
      `${API_URL}/prescriptions/`;



    const response =
      await fetch(
        url,
        {

          method:
            editingPrescription
            ?
            "PUT"
            :
            "POST",


          headers:{

            "Content-Type":
              "application/json",


            Authorization: `Bearer ${getAuthToken()}`

          },


          body:
            JSON.stringify(payload)

        }
      );



    const data =
      await response.json();



    console.log(
      "SAVE RESPONSE:",
      response.status,
      data
    );



    if(!response.ok){

      throw new Error(
        data?.detail ||
        "Prescription save failed"
      );

    }



    await loadPrescriptions();


    closeForm();


    alert(
      editingPrescription
      ?
      "Prescription updated"
      :
      "Prescription created"
    );


  }

  catch(error){

    console.error(
      "SAVE ERROR:",
      error
    );


    alert(
      error.message
    );

  }

  finally{

    setSaving(false);

  }

};
const closeForm = () => {

  setShowForm(false);

  setEditingPrescription(null);


  setFormData({

    patientName:"",
    patientEmail:"",
    medicine:"",
    dosage:"",
    frequency:"",
    timing:"",
    instructions:""

  });

};
const openEditPrescription=(item)=>{


setEditingPrescription(item);


setFormData({

patientId:
item.patientId || "",


patientName:
item.patientName || "",


patientEmail:
item.patientEmail || "",


medicine:
item.medicine || "",


dosage:
item.dosage || "",


frequency:
item.frequency || "",


timing:
item.timing || "",


instructions:
item.instructions || ""

});


setShowForm(true);


};
const deletePrescription = async(id)=>{


if(!window.confirm("Delete prescription?"))
return;


const user =
JSON.parse(
localStorage.getItem("currentUser")
);



await fetch(
`${API_URL}/prescriptions/${id}`,
{

method:"DELETE",

headers:{

Authorization: `Bearer ${getAuthToken()}`

}

}

);


loadPrescriptions();


};
const formatDate=(value)=>{


if(!value)
return "N/A";


return new Date(value)
.toLocaleDateString("en-IN");

};
const filteredPrescriptions =
prescriptions.filter(item => {

  const search =
    searchTerm.toLowerCase();


  return (statusFilter === "all" || item.status === statusFilter) && (
    item.patientName
      ?.toLowerCase()
      .includes(search)
    ||
    item.medicine
      ?.toLowerCase()
      .includes(search)
  );

});



const totalPrescriptions =
filteredPrescriptions.length;



const activePrescriptions =
filteredPrescriptions.filter(x=>x.status==="active").length;



const completedPrescriptions = 
filteredPrescriptions.filter(
x=>x.status==="completed"
).length;
  return (
    <div
      className="relative h-screen overflow-hidden bg-cover bg-center flex"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >

      <div className="absolute inset-0 bg-white/75 backdrop-blur-sm"/>

      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20 animate-pulse"/>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20 animate-pulse"/>


      {/* SIDEBAR */}

      <aside className="relative z-10 w-64 bg-white/85 backdrop-blur-2xl border-r border-pink-100 flex-shrink-0 h-full flex flex-col">


        <div className="p-5 border-b border-pink-100">

          <Link to="/doctor-dashboard">

            <h1 className="text-2xl font-bold text-pink-500">
              GlowCare
            </h1>

            <p className="text-xs text-gray-500">
              Doctor Portal
            </p>

          </Link>



          <div className="mt-4 flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-sky-50 rounded-2xl border border-pink-100">


            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg">

              {
                doctor?.name
                ?.charAt(0)
                ?.toUpperCase()
                ||
                "D"
              }

            </div>


            <div>

              <p className="text-sm font-semibold text-gray-800">

                {
                  doctor?.name || "Doctor"
                }

              </p>


              <p className="text-xs text-gray-500">

                {
                  doctor?.specialization ||
                  "Gynecologist"
                }

              </p>

            </div>


          </div>


        </div>



        <nav className="flex-1 overflow-y-auto p-3 space-y-1">


          <NavItem
            label="Dashboard"
            icon={<FaChartLine/>}
            to="/doctor-dashboard"
          />


          <NavItem
            label="Patients"
            icon={<FaUsers/>}
            to="/doctor-patients"
          />


          <NavItem
            label="Appointments"
            icon={<FaCalendarCheck/>}
            to="/doctor-appointments"
          />


          <NavItem
            label="Reports"
            icon={<FaFileMedical/>}
            to="/doctor-reports"
          />


          <NavItem
            label="Prescriptions"
            icon={<FaPrescription/>}
            to="/doctor-prescriptions"
            active
          />


          <NavItem
            label="Notifications"
            icon={<FaBell/>}
            to="/doctor-notifications"
          />


          <NavItem
            label="Profile"
            icon={<FaUserMd/>}
            to="/doctor-profile"
          />

        </nav>



        <div className="p-3 border-t border-pink-100">

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-4 py-2.5 rounded-xl"
          >

            <FaSignOutAlt/>

            Logout

          </button>

        </div>


      </aside>





      {/* MAIN */}


      <main className="relative z-10 flex-1 px-6 py-5 overflow-y-auto">


        <header className="flex justify-between items-center mb-6">


          <div>

            <h2 className="text-2xl font-extrabold text-gray-800 flex gap-2 items-center">

              <FaPrescription className="text-pink-500"/>

              Prescriptions

            </h2>


            <p className="text-sm text-gray-500">

              Manage patient medicines

            </p>


          </div>



          <button

            onClick={openNewPrescription}

            className="bg-gradient-to-r from-pink-500 to-sky-400 text-white px-5 py-3 rounded-xl flex items-center gap-2"

          >

            <FaPlus/>

            New Prescription

          </button>


        </header>





        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">


          <StatCard

            title="Total Prescriptions"

            value={totalPrescriptions}

            icon={<FaPrescription/>}

            color="pink"

          />


          <StatCard

            title="Active"

            value={activePrescriptions}

            icon={<FaCheckCircle/>}

            color="sky"

          />


          <StatCard

            title="Completed"

            value={completedPrescriptions}

            icon={<FaNotesMedical/>}

            color="green"

          />


        </div>





        <section className="bg-white/90 rounded-2xl p-4 shadow-lg mb-6">


          <div className="flex gap-3">


            <input

              value={searchTerm}

              onChange={(e)=>setSearchTerm(e.target.value)}

              placeholder="Search patient or medicine"

              className="flex-1 px-4 py-3 rounded-xl border"

            />


            <select

              value={statusFilter}

              onChange={(e)=>setStatusFilter(e.target.value)}

              className="px-4 rounded-xl border"

            >

              <option value="all">
                All
              </option>


              <option value="active">
                Active
              </option>


              <option value="completed">
                Completed
              </option>


            </select>



            <button

              onClick={loadPrescriptions}

              className="px-5 bg-pink-100 text-pink-600 rounded-xl"

            >

              Refresh

            </button>


          </div>


        </section>
                {/* PRESCRIPTION TABLE */}

        <section className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">


          <div className="p-5 border-b">

            <h3 className="font-bold text-gray-800 flex items-center gap-2">

              <FaStethoscope className="text-pink-500"/>

              Patient Prescription Records

            </h3>


          </div>




          <div className="overflow-x-auto">


            <table className="w-full min-w-[900px]">


              <thead className="bg-pink-50">


                <tr>

                  <TableHead>
                    Patient
                  </TableHead>


                  <TableHead>
                    Medicine
                  </TableHead>


                  <TableHead>
                    Dosage
                  </TableHead>


                  <TableHead>
                    Frequency
                  </TableHead>


                  <TableHead>
                    Timing
                  </TableHead>


                  <TableHead>
                    Date
                  </TableHead>


                  <TableHead>
                    Actions
                  </TableHead>


                </tr>


              </thead>




              <tbody>


              {
                filteredPrescriptions.map((item)=>(


                  <tr
                    key={item._id}
                    className="border-b hover:bg-pink-50/50"
                  >



                    <td className="px-5 py-4">


                      <div className="flex items-center gap-3">


                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-sky-400 text-white flex items-center justify-center font-bold">


                          {
                            item.patientName
                            ?.charAt(0)
                            ?.toUpperCase()
                            ||
                            "P"
                          }


                        </div>



                        <div>


                          <p className="font-semibold">

                            {
                              item.patientName
                            }

                          </p>


                          <p className="text-xs text-gray-500">

                            {
                              item.patientEmail
                            }

                          </p>


                        </div>


                      </div>


                    </td>





                    <td className="px-5 py-4">


                      <p className="font-semibold">

                        {
                          item.medicine
                        }

                      </p>



                      <p className="text-xs text-gray-500">

                        {
                          item.instructions ||
                          "No instructions"
                        }

                      </p>


                    </td>





                    <td className="px-5 py-4">

                      {
                        item.dosage
                      }

                    </td>




                    <td className="px-5 py-4">


                      {
                        item.frequency
                      }


                    </td>




                    <td className="px-5 py-4">


                      {
                        item.timing
                      }


                    </td>




                    <td className="px-5 py-4 text-sm">


                      {
                        formatDate(
                          item.createdAt
                        )
                      }


                    </td>





                    <td className="px-5 py-4">


                      <div className="flex gap-2">



                        <button

                          onClick={()=>openEditPrescription(item)}

                          className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center"

                        >

                          <FaEdit/>

                        </button>





                        <button

                          onClick={()=>deletePrescription(item._id)}

                          className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"

                        >

                          <FaTrash/>

                        </button>



                      </div>


                    </td>



                  </tr>



                ))
              }





              {
                filteredPrescriptions.length===0 &&


                <tr>


                  <td
                    colSpan="7"
                    className="text-center py-16"
                  >


                    <FaPrescription
                      className="mx-auto text-5xl text-pink-200 mb-4"
                    />


                    <p className="text-gray-600 font-semibold">

                      No prescriptions found

                    </p>


                  </td>


                </tr>


              }



              </tbody>


            </table>


          </div>



        </section>







        {/* CREATE / EDIT MODAL */}


        {
          showForm && (


          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-5">


            <div className="bg-white rounded-3xl w-full max-w-3xl">


              <div className="bg-gradient-to-r from-pink-500 to-sky-400 text-white p-6 rounded-t-3xl flex justify-between">


                <h3 className="text-xl font-bold">


                  {
                    editingPrescription
                    ?
                    "Edit Prescription"
                    :
                    "Create Prescription"
                  }


                </h3>



                <button
                  onClick={closeForm}
                >

                  <FaTimes/>

                </button>



              </div>





              <form
                onSubmit={handleSavePrescription}
                className="p-6 space-y-4"
              >



                <div className="grid md:grid-cols-2 gap-4">


                  <InputField

                    label="Patient Name"

                    name="patientName"

                    value={formData.patientName}

                    onChange={handleInputChange}

                    required

                  />



                  <InputField

                    label="Patient Email"

                    name="patientEmail"

                    value={formData.patientEmail}

                    onChange={handleInputChange}

                    required

                  />


                </div>






                <InputField

                  label="Medicine"

                  name="medicine"

                  value={formData.medicine}

                  onChange={handleInputChange}

                  required

                />






                <div className="grid md:grid-cols-2 gap-4">


                  <InputField

                    label="Dosage"

                    name="dosage"

                    value={formData.dosage}

                    onChange={handleInputChange}

                    required

                  />



                  <InputField

                    label="Frequency"

                    name="frequency"

                    value={formData.frequency}

                    onChange={handleInputChange}

                    required

                  />


                </div>





                <InputField

                  label="Timing"

                  name="timing"

                  value={formData.timing}

                  onChange={handleInputChange}

                  required

                />




                <textarea

                  name="instructions"

                  value={formData.instructions}

                  onChange={handleInputChange}

                  placeholder="Instructions"

                  className="w-full border rounded-xl p-3"

                />






                <div className="flex justify-end gap-3">


                  <button

                    type="button"

                    onClick={closeForm}

                    className="px-5 py-3 bg-gray-100 rounded-xl"

                  >

                    Cancel

                  </button>





                  <button

                    disabled={saving}

                    className="px-5 py-3 bg-gradient-to-r from-pink-500 to-sky-400 text-white rounded-xl"

                  >


                    {
                      saving
                      ?
                      "Saving..."
                      :
                      editingPrescription
                      ?
                      "Update"
                      :
                      "Save"
                    }


                  </button>



                </div>





              </form>



            </div>



          </div>


          )
        }

      </main>


    </div>
  );
};
const NavItem = ({
  label,
  icon,
  to,
  active = false,
}) => {

  return (

    <Link

      to={to}

      className={`
      flex items-center gap-3 px-3 py-2.5 rounded-xl 
      text-sm transition-all
      ${
        active
        ?
        "bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-lg"
        :
        "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
      }
      `}

    >

      <span className="text-lg">

        {icon}

      </span>


      <span className="font-medium">

        {label}

      </span>


    </Link>

  );

};







const StatCard = ({
  title,
  value,
  icon,
  color
})=>{


const colors={

pink:
"bg-pink-100 text-pink-600",

sky:
"bg-sky-100 text-sky-600",

green:
"bg-green-100 text-green-600"

};



return (

<div className="bg-white/90 rounded-2xl p-5 shadow-lg">


<div className="flex items-center gap-4">


<div
className={`
w-12 h-12 rounded-2xl flex items-center justify-center text-xl
${colors[color]}
`}
>

{icon}

</div>



<div>


<p className="text-2xl font-bold text-gray-800">

{value}

</p>



<p className="text-sm text-gray-500">

{title}

</p>


</div>


</div>


</div>

);


};









const TableHead = ({
children
})=>{


return (

<th className="px-5 py-4 text-left text-xs font-bold text-gray-500 uppercase">

{children}

</th>

);


};









const InputField = ({
label,
name,
value,
onChange,
type="text",
required=false
})=>{


return (

<div>


<label className="block text-sm font-semibold text-gray-700 mb-2">

{label}

{
required &&
<span className="text-red-500">
*
</span>
}

</label>



<input

type={type}

name={name}

value={value || ""}

onChange={onChange}

required={required}

className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:ring-2 focus:ring-pink-400 outline-none"

/>


</div>


);


};








export default DoctorPrescriptions;
