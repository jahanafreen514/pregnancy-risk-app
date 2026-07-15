import { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

function PatientTable({ patients }) {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.name?.toLowerCase().includes(search.toLowerCase())
  );

  const deletePatient = (email) => {
    if (!window.confirm("Delete this patient?")) return;

    const updatedPatients = patients.filter(
      (patient) => patient.email !== email
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedPatients)
    );

    window.location.reload();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Patient Records
        </h2>

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search Patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-pink-300"
          />

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-pink-100 text-gray-700">

              <th className="p-3 text-left">Patient</th>

              <th>Age</th>

              <th>Trimester</th>

              <th>Risk</th>

              <th>BP</th>

              <th>Due Date</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredPatients.length > 0 ? (

              filteredPatients.map((patient, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-pink-50"
                >

                  <td className="p-4">

                    <div>

                      <h3 className="font-semibold">
                        {patient.name}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {patient.email}
                      </p>

                    </div>

                  </td>

                  <td>{patient.age || "-"}</td>

                  <td>{patient.trimester || "-"}</td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm

                      ${
                        patient.risk === "High"
                          ? "bg-red-500"

                          : patient.risk === "Medium"
                          ? "bg-orange-500"

                          : "bg-green-500"
                      }`}
                    >
                      {patient.risk || "-"}
                    </span>

                  </td>

                  <td>{patient.bp || "-"}</td>

                  <td>{patient.dueDate || "-"}</td>

                  <td>

                    <span className="text-green-600 font-semibold">
                      Active
                    </span>

                  </td>

                  <td>

                    <div className="flex gap-3 justify-center">

                      <button className="text-blue-600 hover:text-blue-800">

                        <Eye size={18} />

                      </button>

                      <button className="text-green-600 hover:text-green-800">

                        <Pencil size={18} />

                      </button>

                      <button
                        onClick={() =>
                          deletePatient(patient.email)
                        }
                        className="text-red-600 hover:text-red-800"
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500"
                >

                  No Patients Found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default PatientTable;