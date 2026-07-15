import { CalendarDays } from "lucide-react";

function AppointmentCard({ user }) {

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex items-center gap-3 mb-5">

        <CalendarDays
          className="text-pink-600"
          size={35}
        />

        <h2 className="text-xl font-bold">
          Appointment
        </h2>

      </div>

      {user.appointment ? (

        <div>

          <div className="bg-pink-50 rounded-lg p-4">

            <h3 className="font-semibold">
              Next Appointment
            </h3>

            <p className="text-2xl font-bold mt-2">
              {user.appointment}
            </p>

          </div>

          <p className="text-gray-500 mt-4">
            Please visit your doctor on time.
          </p>

        </div>

      ) : (

        <div className="bg-yellow-50 rounded-lg p-4">

          <p>
            No appointment scheduled.
          </p>

        </div>

      )}

    </div>

  );

}

export default AppointmentCard;