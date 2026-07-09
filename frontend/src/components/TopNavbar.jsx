import { Bell, Search, UserCircle } from "lucide-react";

function TopNavbar() {
  return (
    <div className="bg-white shadow-sm px-8 py-5 flex items-center justify-between sticky top-0 z-20">

      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
           Maternal Care Dashboard
        </h1>

        <p className="text-gray-500">
          Pregnancy Risk Prediction & Monitoring System
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 bg-transparent outline-none"
          />
        </div>

        {/* Notification */}
        <button className="relative bg-pink-100 p-3 rounded-full hover:bg-pink-200">
          <Bell size={20} className="text-pink-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Admin */}
        <div className="flex items-center gap-3">
          <UserCircle size={42} className="text-pink-500" />

          <div>
            <h4 className="font-semibold">Admin</h4>
            <p className="text-sm text-gray-500">
              Pregnancy Care System
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default TopNavbar;