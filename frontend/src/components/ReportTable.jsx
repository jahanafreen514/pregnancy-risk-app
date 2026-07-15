import { Eye, Download, Printer } from "lucide-react";

function ReportTable({ reports }) {
  const downloadReport = (report) => {
    const reportContent = `
Pregnancy Report

Patient Name : ${report.patientName}
Age          : ${report.age}
Risk         : ${report.risk}
Blood Pressure : ${report.bp}
Heart Rate   : ${report.heartRate}
Trimester    : ${report.trimester}
Weight       : ${report.weight}
Doctor       : ${report.doctor}
Date         : ${report.date}
`;

    const blob = new Blob([reportContent], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.patientName}_Report.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const printReport = (report) => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
      <head>
      <title>Pregnancy Report</title>
      </head>
      <body>

      <h2>GlowCare Pregnancy Report</h2>

      <hr>

      <p><b>Patient :</b> ${report.patientName}</p>
      <p><b>Age :</b> ${report.age}</p>
      <p><b>Trimester :</b> ${report.trimester}</p>
      <p><b>Risk :</b> ${report.risk}</p>
      <p><b>Blood Pressure :</b> ${report.bp}</p>
      <p><b>Heart Rate :</b> ${report.heartRate}</p>
      <p><b>Weight :</b> ${report.weight}</p>
      <p><b>Doctor :</b> ${report.doctor}</p>
      <p><b>Date :</b> ${report.date}</p>

      </body>
      </html>
    `);

    printWindow.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Reports
        </h2>

        <span className="text-gray-500">
          Total : {reports.length}
        </span>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-pink-100">

              <th className="p-3 text-left">
                Patient
              </th>

              <th>Risk</th>

              <th>BP</th>

              <th>Doctor</th>

              <th>Date</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {reports.length > 0 ? (

              reports.map((report, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-pink-50"
                >

                  <td className="p-4">

                    <div>

                      <h3 className="font-semibold">
                        {report.patientName}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {report.email}
                      </p>

                    </div>

                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-white

                      ${
                        report.risk === "High"
                          ? "bg-red-500"

                          : report.risk === "Medium"
                          ? "bg-orange-500"

                          : "bg-green-500"
                      }`}
                    >

                      {report.risk}

                    </span>

                  </td>

                  <td>{report.bp}</td>

                  <td>{report.doctor}</td>

                  <td>{report.date}</td>

                  <td>

                    <div className="flex justify-center gap-4">

                      <button className="text-blue-600">

                        <Eye size={18} />

                      </button>

                      <button
                        onClick={() =>
                          downloadReport(report)
                        }
                        className="text-green-600"
                      >

                        <Download size={18} />

                      </button>

                      <button
                        onClick={() =>
                          printReport(report)
                        }
                        className="text-purple-600"
                      >

                        <Printer size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-8 text-gray-500"
                >

                  No Reports Available

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ReportTable;