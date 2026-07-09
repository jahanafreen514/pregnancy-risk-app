import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/TopNavbar";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";

function TotalUsers() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    setUsers(storedUsers);

  }, []);


  const filteredUsers = users.filter((user) =>
    user.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );


  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">

      {/* Fixed Sidebar */}
      <Sidebar />


      {/* Main Content */}
      <main className="ml-72">


        {/* Top Navbar */}
        <TopNavbar />



        <div className="p-8">


          {/* Header */}
          <div className="flex justify-between items-center mb-8">


            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                Total Registered Users
              </h1>

              <p className="text-gray-500 mt-1">
                Manage all registered pregnancy care users
              </p>

            </div>



            <button
              className="
              bg-pink-600 
              hover:bg-pink-700
              text-white 
              px-5 
              py-3 
              rounded-xl 
              flex 
              items-center 
              gap-2
              shadow-lg
              transition
              "
            >

              <UserPlus size={20}/>

              Add Patient

            </button>


          </div>





          {/* Search Box */}
          <div
            className="
            bg-white
            rounded-2xl
            shadow-md
            p-4
            flex
            items-center
            gap-3
            mb-6
            "
          >

            <Search
              className="text-gray-400"
              size={22}
            />


            <input

              type="text"

              placeholder="Search Patient..."

              value={search}

              onChange={(e)=>setSearch(e.target.value)}

              className="
              w-full
              outline-none
              text-gray-700
              "
            />


          </div>






          {/* Users Table */}

          <div
            className="
            bg-white
            rounded-3xl
            shadow-lg
            overflow-hidden
            "
          >


            <table className="w-full">


              <thead
                className="
                bg-pink-600
                text-white
                "
              >

                <tr>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th>
                    Age
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Trimester
                  </th>

                  <th>
                    Risk
                  </th>

                  <th>
                    Actions
                  </th>


                </tr>


              </thead>





              <tbody>


                {
                  filteredUsers.length > 0 ?

                  (

                    filteredUsers.map((user,index)=>(


                      <tr

                        key={index}

                        className="
                        text-center
                        border-b
                        hover:bg-pink-50
                        transition
                        "

                      >


                        <td className="p-4 font-medium">
                          {user.name}
                        </td>


                        <td>
                          {user.age || "-"}
                        </td>


                        <td>
                          {user.phone || "-"}
                        </td>


                        <td>
                          {user.trimester || "-"}
                        </td>




                        <td>


                          <span

                            className={`
                            px-3
                            py-1
                            rounded-full
                            text-white
                            text-sm

                            ${
                              user.risk==="High"
                              ?
                              "bg-red-500"
                              :
                              user.risk==="Medium"
                              ?
                              "bg-yellow-500"
                              :
                              "bg-green-500"
                            }

                            `}

                          >

                            {user.risk || "Low"}

                          </span>


                        </td>





                        <td>


                          <div
                            className="
                            flex
                            justify-center
                            gap-4
                            "
                          >


                            <Eye
                              size={20}
                              className="
                              text-blue-600
                              cursor-pointer
                              hover:scale-110
                              "
                            />


                            <Pencil
                              size={20}
                              className="
                              text-green-600
                              cursor-pointer
                              hover:scale-110
                              "
                            />


                            <Trash2
                              size={20}
                              className="
                              text-red-600
                              cursor-pointer
                              hover:scale-110
                              "
                            />


                          </div>


                        </td>



                      </tr>


                    ))

                  )


                  :


                  (

                    <tr>

                      <td
                        colSpan="6"
                        className="
                        p-8
                        text-center
                        text-gray-500
                        "
                      >

                        No registered users found.

                      </td>

                    </tr>


                  )


                }



              </tbody>


            </table>



          </div>



        </div>


      </main>



    </div>

  );

}


export default TotalUsers;