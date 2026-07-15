import {
  User,
  Mail,
  Phone,
  Building2,
  Stethoscope,
  Award,
} from "lucide-react";

function DoctorProfileCard({
  doctor,
  setDoctor,
  updateProfile,
}) {
  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <div className="flex gap-8">

        {/* Profile */}

        <div className="w-72 text-center">

          <img
            src={
              doctor.photo ||
              "https://ui-avatars.com/api/?name=Doctor"
            }
            alt=""
            className="w-40 h-40 rounded-full mx-auto border-4 border-pink-300"
          />

          <h2 className="text-2xl font-bold mt-4">
            {doctor.name}
          </h2>

          <p className="text-gray-500">
            {doctor.specialization}
          </p>

        </div>

        {/* Form */}

        <div className="flex-1 grid md:grid-cols-2 gap-6">

          <Input
            icon={<User size={18} />}
            label="Doctor Name"
            name="name"
            value={doctor.name}
            onChange={handleChange}
          />

          <Input
            icon={<Mail size={18} />}
            label="Email"
            name="email"
            value={doctor.email}
            onChange={handleChange}
          />

          <Input
            icon={<Phone size={18} />}
            label="Phone"
            name="phone"
            value={doctor.phone}
            onChange={handleChange}
          />

          <Input
            icon={<Building2 size={18} />}
            label="Hospital"
            name="hospital"
            value={doctor.hospital}
            onChange={handleChange}
          />

          <Input
            icon={<Stethoscope size={18} />}
            label="Specialization"
            name="specialization"
            value={doctor.specialization}
            onChange={handleChange}
          />

          <Input
            icon={<Award size={18} />}
            label="Experience"
            name="experience"
            value={doctor.experience}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className="mt-8">

        <button
          onClick={updateProfile}
          className="bg-pink-500 text-white px-8 py-3 rounded-xl hover:bg-pink-600"
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}

function Input({
  icon,
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="block mb-2 font-medium">
        {label}
      </label>

      <div className="flex items-center border rounded-xl px-3">

        {icon}

        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full p-3 outline-none"
        />

      </div>

    </div>
  );
}

export default DoctorProfileCard;