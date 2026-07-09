function PregnancyWeekTracker() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Pregnancy Progress
      </h3>

      <p className="text-pink-600 font-semibold text-lg">
        Week 24 of 40
      </p>

      <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
        <div
          className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full"
          style={{ width: "60%" }}
        ></div>
      </div>

      <p className="text-gray-500 mt-3">
        Your baby is approximately the size of an ear of corn 🌽
      </p>

      {/* EXTRA CONTENT */}

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="bg-pink-50 rounded-2xl p-4">
          <p className="text-gray-500 text-sm">
            Baby Weight
          </p>
          <h4 className="font-bold text-pink-500 text-xl">
            600 g
          </h4>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-gray-500 text-sm">
            Baby Length
          </p>
          <h4 className="font-bold text-sky-500 text-xl">
            30 cm
          </h4>
        </div>

      </div>

      <div className="mt-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4">

        <h4 className="font-semibold text-gray-800 mb-2">
          This Week's Development
        </h4>

        <p className="text-sm text-gray-600">
          Baby's hearing is improving and movements are becoming stronger.
        </p>

      </div>

      <div className="mt-5 flex justify-between">

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Kicks Today
          </p>
          <h4 className="text-pink-500 font-bold text-2xl">
            12
          </h4>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Due In
          </p>
          <h4 className="text-purple-500 font-bold text-2xl">
            16 Weeks
          </h4>
        </div>

      </div>

    </div>
  );
}

export default PregnancyWeekTracker;