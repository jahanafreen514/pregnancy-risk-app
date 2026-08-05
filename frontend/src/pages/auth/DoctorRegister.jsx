import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHeartbeat,
  FaUserMd,
  FaBriefcaseMedical,
  FaIdCard,
  FaStethoscope,
  FaHospital,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaShieldAlt,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCloudUploadAlt,
} from "react-icons/fa";

import bg from "../../assets/images/bg.png";
import CountryCodeSelector from "../../components/CountryCodeSelector";

const DoctorRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    hospital: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [licenseImage, setLicenseImage] = useState(null);
  const [hospitalIdImage, setHospitalIdImage] = useState(null);

  const hospitals = [
    "Apollo Hospitals",
    "Fortis Healthcare",
    "Max Healthcare",
    "Medanta - The Medicity",
    "AIIMS",
    "Sir Ganga Ram Hospital",
    "Kokilaben Dhirubhai Ambani Hospital",
    "Narayana Health",
    "Manipal Hospitals",
    "Columbia Asia Hospital",
    "KIMS Hospital",
    "Yashoda Hospitals",
    "Gleneagles Global Hospitals",
    "Artemis Hospital",
    "BLK Super Speciality Hospital",
    "Cloudnine Hospital",
    "Fernandez Hospital",
    "Motherhood Hospital",
    "Sahyadri Hospitals",
    "Apollo Cradle",
    "Others",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) {
      setError("");
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === "license") {
      setLicenseImage(file);
    }
    if (type === "hospital") {
      setHospitalIdImage(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (formData.password.length < 8) {
    setError("Password must be at least 8 characters");
    return;
  }

  if (!licenseImage || !hospitalIdImage) {
    setError("Please upload license and hospital ID proof");
    return;
  }


  try {

    // ==========================
    // STEP 1: CREATE DOCTOR USER
    // ==========================

    const registerResponse = await fetch(
      "http://127.0.0.1:8000/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          name: formData.fullName,

          email: formData.email,

          password: formData.password,

          role: "doctor",

          countryCode: formData.countryCode,

          phone: formData.phone,

        }),
      }
    );


    const registerData = await registerResponse.json();


    if (!registerResponse.ok) {

      throw new Error(
        registerData.detail ||
        "Doctor registration failed"
      );

    }



    const token = registerData.access_token;



    localStorage.setItem(
      "token",
      token
    );



    // ==========================
    // STEP 2: UPDATE DOCTOR PROFILE
    // ==========================


    const profileResponse = await fetch(

    "http://127.0.0.1:8000/api/doctors/me/profile",

      {

        method:"PUT",

        headers:{

          "Content-Type":"application/json",

          Authorization:
          `Bearer ${token}`

        },


        body:JSON.stringify({

          specialization:
          formData.specialization,


          license_number:
          formData.licenseNumber,


          hospital:
          formData.hospital

        })

      }

    );



    if(!profileResponse.ok){

      throw new Error(
        "Profile update failed"
      );

    }




    // ==========================
    // STEP 3: UPLOAD DOCUMENTS
    // ==========================


    const formDataUpload = new FormData();


    formDataUpload.append(
      "license_image",
      licenseImage
    );


    formDataUpload.append(
      "hospital_id_image",
      hospitalIdImage
    );



    const uploadResponse = await fetch(

      "http://127.0.0.1:8000/api/doctors/me/verification",

      {

        method:"POST",

        headers:{

          Authorization:
          `Bearer ${token}`

        },

        body:formDataUpload

      }

    );



    const uploadData =
    await uploadResponse.json();



    if(!uploadResponse.ok){

      throw new Error(
        uploadData.detail ||
        "Document upload failed"
      );

    }




    setSuccess(true);



    setTimeout(()=>{

      navigate("/doctor-login");

    },1500);



  }

  catch(error){

    console.log(error);

    setError(
      error.message
    );

  }

};
  return (
    <div
      className="relative min-h-screen overflow-y-auto bg-cover bg-center flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-pink-300 blur-[140px] opacity-20"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-300 blur-[150px] opacity-20"></div>

      <div className="relative z-10 w-full max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* LEFT PANEL - 5 columns with full height */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="flex flex-col h-full space-y-5">
              {/* Header */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center shadow-xl">
                  <FaHeartbeat className="text-white text-3xl animate-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text text-transparent">
                    Doctor Portal
                  </h1>
                  <p className="text-sm text-gray-500">GlowCare Management</p>
                </div>
              </div>

              {/* Doctor Access Card - flex-1 to take remaining height */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-pink-100/50 shadow-lg flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4 flex-shrink-0">
                  <FaStethoscope className="text-pink-500" />
                  Doctor Access
                </h3>
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaUsers className="text-pink-500 text-sm" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Patient Management</span>
                      <p className="text-xs text-gray-500 mt-0.5">View and manage all patient records</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaCalendarAlt className="text-sky-500 text-sm" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Appointment Management</span>
                      <p className="text-xs text-gray-500 mt-0.5">Schedule and manage patient appointments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaChartLine className="text-purple-500 text-sm" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Health Monitoring</span>
                      <p className="text-xs text-gray-500 mt-0.5">Track patient health and pregnancy progress</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaHospital className="text-green-500 text-sm" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Medical Reports</span>
                      <p className="text-xs text-gray-500 mt-0.5">View AI-powered pregnancy risk reports</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Badges */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400 bg-white/50 backdrop-blur-sm rounded-2xl py-3 px-6 border border-pink-100/50 flex-shrink-0">
                <span className="flex items-center gap-1.5">
                  <FaShieldAlt className="text-pink-400" />
                  Doctor Only
                </span>
                <span className="w-px h-5 bg-gray-200"></span>
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-green-400" />
                  Secure Access
                </span>
                <span className="w-px h-5 bg-gray-200"></span>
                <span className="flex items-center gap-1.5">
                  <FaUserMd className="text-purple-400" />
                  Medical Professional
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT REGISTER CARD - 7 columns */}
          <div className="lg:col-span-7 flex">
            <div className="relative w-full max-w-2xl">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-300 via-purple-200 to-sky-300 blur-2xl opacity-60"></div>

              <div className="relative bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white p-7 h-full">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-sky-400 flex items-center justify-center shadow-lg">
                    <FaUserMd className="text-white text-2xl" />
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
                  Doctor Registration
                </h2>

                <p className="text-center text-gray-500 text-sm mb-4">
                  Create your professional account
                </p>

                {error && (
                  <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-3 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
                    Registration successful! Redirecting...
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Full Name *
                      </label>
                      <div className="relative mt-1">
                        <FaUser className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Dr. John Doe"
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white pl-9 py-2.5 text-sm outline-none focus:ring-4 focus:ring-pink-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Email *
                      </label>
                      <div className="relative mt-1">
                        <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="doctor@email.com"
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white pl-9 py-2.5 text-sm outline-none focus:ring-4 focus:ring-sky-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Phone *
                      </label>
                      <div className="flex gap-2 mt-1">
                        <div className="w-24">
                          <CountryCodeSelector
                            value={formData.countryCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                countryCode: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="relative flex-1">
                          <FaPhone className="absolute left-3 top-3 text-gray-400 text-sm" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            required
                            className="w-full rounded-xl border border-pink-100 bg-white pl-9 py-2.5 text-sm outline-none focus:ring-4 focus:ring-pink-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Hospital *
                      </label>
                      <div className="relative mt-1">
                        <FaHospital className="absolute left-3 top-3 text-gray-400 text-sm" />
                        <select
                          name="hospital"
                          value={formData.hospital}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-pink-100 bg-white pl-9 py-2.5 text-sm outline-none focus:ring-4 focus:ring-sky-100"
                        >
                          <option value="">Select Hospital</option>
                          {hospitals.map((hospital, index) => (
                            <option key={index} value={hospital}>
                              {hospital}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Medical License Number *
                    </label>
                    <div className="relative mt-1">
                      <FaIdCard className="absolute left-3 top-3 text-gray-400 text-sm" />
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        placeholder="License number"
                        required
                        className="w-full rounded-xl border border-pink-100 bg-white pl-9 py-2.5 text-sm outline-none focus:ring-4 focus:ring-pink-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Specialization *
                      </label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 rounded-xl border border-pink-100 bg-white py-2.5 px-3 text-sm outline-none focus:ring-4 focus:ring-sky-100"
                      >
                        <option value="">Select Specialization</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Obstetrician">Obstetrician</option>
                        <option value="Maternal-Fetal Medicine">
                          Maternal-Fetal Medicine
                        </option>
                        <option value="Family Medicine">Family Medicine</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Experience *
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Years"
                        required
                        className="w-full mt-1 rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  {/* UPLOAD BOXES */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Medical License Proof *
                      </label>
                      <label className="mt-1 h-24 border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/40 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-100/50 transition">
                        <FaCloudUploadAlt className="text-pink-500 text-2xl" />
                        <span className="text-xs text-gray-500 mt-1">
                          Upload License
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          required
                          hidden
                          onChange={(e) => handleFileChange(e, "license")}
                        />
                      </label>
                      {licenseImage && (
                        <p className="text-[11px] text-green-600 mt-1 truncate">
                          ✓ {licenseImage.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Hospital ID Proof *
                      </label>
                      <label className="mt-1 h-24 border-2 border-dashed border-sky-200 rounded-2xl bg-sky-50/40 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-100/50 transition">
                        <FaCloudUploadAlt className="text-sky-500 text-2xl" />
                        <span className="text-xs text-gray-500 mt-1">
                          Upload Hospital ID
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          required
                          hidden
                          onChange={(e) => handleFileChange(e, "hospital")}
                        />
                      </label>
                      {hospitalIdImage && (
                        <p className="text-[11px] text-green-600 mt-1 truncate">
                          ✓ {hospitalIdImage.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Password *
                      </label>
                      <div className="relative mt-1">
                        <FaLock className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Password"
                          className="w-full rounded-xl border border-pink-100 bg-white pl-9 pr-9 py-2.5 text-sm outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Confirm Password *
                      </label>
                      <div className="relative mt-1">
                        <FaLock className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Confirm"
                          className="w-full rounded-xl border border-pink-100 bg-white pl-9 pr-9 py-2.5 text-sm outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-3 text-gray-400"
                        >
                          {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-400 to-sky-400 text-white font-bold shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2"
                  >
                    Create Doctor Account
                    <FaArrowRight />
                  </button>
                </form>

                <div className="text-center mt-4 text-sm text-gray-600">
                  Already have account?
                  <Link to="/doctor-login" className="ml-1 font-bold text-pink-500">
                    Login
                  </Link>
                </div>

                <div className="mt-3 text-center text-xs text-gray-400 flex justify-center gap-1 items-center">
                  <FaShieldAlt className="text-pink-400" />
                  Authorized medical professionals only
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;