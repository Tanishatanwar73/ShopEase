import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";

function Users() {
  const [users, setUsers] = useState([
    {
      _id: "1",
      name: "Tanisha",
      email: "tanisha@example.com",
      role: "user",
      isVerified: true,
    },
    {
      _id: "2",
      name: "Rahul",
      email: "rahul@example.com",
      role: "user",
      isVerified: true,
    },
    {
      _id: "3",
      name: "Priya",
      email: "priya@example.com",
      role: "user",
      isVerified: false,
    },
  ]);

  const handleDelete = (id) => {
    const user = users.find(
      (item) => item._id === id
    );

    const confirmed = window.confirm(
      `Delete user "${user.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter(
        (item) => item._id !== id
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Manage Users
          </h1>

          <p className="text-gray-500 mt-2">
            View and manage registered users.
          </p>

        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-6 py-4">
                    Name
                  </th>

                  <th className="text-left px-6 py-4">
                    Email
                  </th>

                  <th className="text-left px-6 py-4">
                    Role
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>

                  <th className="text-right px-6 py-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {users.map((user) => (

                  <tr
                    key={user._id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-medium">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {user.role}
                    </td>

                    <td className="px-6 py-4">

                      {user.isVerified ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                          Pending
                        </span>
                      )}

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        {/* View */}
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100"
                        >
                          <Eye size={17} />
                          View
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDelete(user._id)
                          }
                          className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 size={17} />
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {users.length === 0 && (
            <div className="text-center py-16">

              <h2 className="text-xl font-semibold">
                No Users Found
              </h2>

              <p className="text-gray-500 mt-2">
                There are no registered users.
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Users;