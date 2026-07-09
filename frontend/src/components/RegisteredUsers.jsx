function RegisteredUsers() {
  const users = [
    {
      id: "P001",
      name: "Priya Sharma",
      age: 26,
      trimester: "2nd",
      risk: "Low",
      doctor: "Dr. Meera",
    },
    {
      id: "P002",
      name: "Ananya Reddy",
      age: 30,
      trimester: "3rd",
      risk: "High",
      doctor: "Dr. Kavitha",
    },
    {
      id: "P003",
      name: "Sneha Patel",
      age: 24,
      trimester: "1st",
      risk: "Medium",
      doctor: "Dr. Asha",
    },
    {
      id: "P004",
      name: "Kavya Nair",
      age: 28,
      trimester: "2nd",
      risk: "Low",
      doctor: "Dr. Lakshmi",
    },
    {
      id: "P005",
      name: "Meera Patil",
      age: 32,
      trimester: "3rd",
      risk: "High",
      doctor: "Dr. Swathi",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">
        Registered Pregnant Women
      </h2>

      <table className="w-full">

        <thead>
          <tr className="border-b">
            <th className="text-left py-3">ID</th>
            <th className="text-left py-3">Name</th>
            <th className="text-left py-3">Age</th>
            <th className="text-left py-3">Trimester</th>
            <th className="text-left py-3">Risk</th>
            <th className="text-left py-3">Doctor</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-pink-50">

              <td className="py-3">{user.id}</td>

              <td>{user.name}</td>

              <td>{user.age}</td>

              <td>{user.trimester}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm
                  ${
                    user.risk === "Low"
                      ? "bg-green-500"
                      : user.risk === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {user.risk}
                </span>
              </td>

              <td>{user.doctor}</td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default RegisteredUsers;