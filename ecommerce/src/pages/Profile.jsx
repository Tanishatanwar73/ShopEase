import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  LogOut,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              My Profile
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your account information.
            </p>
          </div>

          <Link
            to="/profile/edit"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            <Edit size={18} />
            Edit Profile
          </Link>

        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          {/* Top */}
          <div className="bg-blue-600 p-8 text-white">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold">

                {user.name?.charAt(0).toUpperCase()}

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  {user.name}
                </h2>

                <p className="text-blue-100">
                  {user.email}
                </p>

              </div>

            </div>

          </div>

          {/* Information */}
          <div className="p-8">

            <h2 className="text-xl font-semibold mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div className="flex items-start gap-4">

                <User className="text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <p className="font-medium mt-1">
                    {user.name}
                  </p>
                </div>

              </div>

              {/* Email */}
              <div className="flex items-start gap-4">

                <Mail className="text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-medium mt-1">
                    {user.email}
                  </p>
                </div>

              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">

                <Phone className="text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium mt-1">
                    {user.phone || "Not added"}
                  </p>
                </div>

              </div>

              {/* Address */}
              <div className="flex items-start gap-4">

                <MapPin className="text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Address
                  </p>

                  <p className="font-medium mt-1">
                    {user.address?.city ||
                    "Not added"}
                  </p>
                </div>

              </div>

            </div>

            {/* Account */}
            <div className="border-t mt-8 pt-8">

              <h2 className="text-xl font-semibold mb-5">
                Account
              </h2>

              <div className="flex flex-wrap gap-4">

                <Link
                  to="/profile/edit"
                  className="flex items-center gap-2 bg-gray-100 px-5 py-3 rounded-lg hover:bg-gray-200"
                >
                  <Edit size={18} />
                  Edit Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-lg hover:bg-red-100"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;