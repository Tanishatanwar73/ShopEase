import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function UserDetails() {
  const { id } = useParams();

  // Temporary user data.
  // Later this will come from MongoDB.
  const user = {
    _id: id,
    name: "Tanisha",
    email: "tanisha@example.com",
    role: "user",
    isVerified: true,
    createdAt: "August 29, 2026",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Users
        </Link>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md p-8">

          <div className="flex items-center gap-5 mb-8">

            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0)}
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                {user.name}
              </h1>

              <p className="text-gray-500">
                User ID: {user._id}
              </p>
            </div>

          </div>

          {/* Information */}
          <div className="space-y-6">

            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="text-lg font-medium mt-1">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="text-lg font-medium mt-1">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>

              <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">
                {user.role}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email Verification
              </p>

              {user.isVerified ? (
                <span className="inline-block mt-1 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Verified
                </span>
              ) : (
                <span className="inline-block mt-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  Pending
                </span>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Registered On
              </p>

              <p className="text-lg font-medium mt-1">
                {user.createdAt}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UserDetails;