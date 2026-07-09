import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center">

        <div>
          <p className="text-pink-500 font-semibold">
            Maternal Health Monitoring
          </p>

          <h1 className="text-4xl font-bold text-gray-800 mt-2">
            Pregnancy Toolkit
          </h1>

          <p className="text-gray-500 mt-2">
            Essential tools for pregnancy tracking and care
          </p>
        </div>

        <Link
          to="/dashboard"
          className="bg-pink-100 text-pink-600 px-5 py-3 rounded-xl hover:bg-pink-200 transition"
        >
          Back Dashboard
        </Link>

      </div>
    </div>
  );
}

export default Header;