import {
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";

function AppointmentTable({ appointments }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Today's Appointments
        </h2>

        <span className="text-gray-500">
          Total : {appointments.length}
        </span>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-sky-100 text-gray-700">

              <th className="p-3 text-left">
                Patient
              </th>

              <th>Date</th>

              <th>Time</th>

              <th>Reason</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {appointments.length > 0 ? (

              appointments.map((appointment, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">

                    <div>

                      <h3 className="font-semibold">
                        {appointment.patientName}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {appointment.email}
                      </p>

                    </div>

                  </td>

                  <td>
                    {appointment.date}
                  </td>

                  <td>
                    {appointment.time}
                  </td>

                  <td>
                    {appointment.reason}
                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm

                      ${
                        appointment.status === "Completed"
                          ? "bg-green-500"

                          : appointment.status === "Cancelled"
                          ? "bg-red-500"

                          : "bg-orange-500"
                      }`}
                    >

                      {appointment.status}

                    </span>

                  </td>

                  <td>

                    <div className="flex justify-center gap-3">

                      <button className="text-blue-600">

                        <Eye size={18} />

                      </button>

                      <button className="text-green-600">

                        <CheckCircle size={18} />

                      </button>

                      <button className="text-red-600">

                        <XCircle size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >

                  No Appointments Found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AppointmentTable;