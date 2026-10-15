import { useContext, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

function EditProfile() {
  const { user, setUser } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,

      name: formData.name,

      phone: formData.phone,

      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    };

    setUser(updatedUser);

    alert("Profile updated successfully!");

    navigate("/profile");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Profile
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="mb-8">

            <h1 className="text-3xl font-bold">
              Edit Profile
            </h1>

            <p className="text-gray-500 mt-2">
              Update your personal information.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Name */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Email */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
              />

              <p className="text-xs text-gray-500 mt-2">
                Email cannot be changed here.
              </p>

            </div>

            {/* Phone */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>

              <div className="relative">

                <Phone
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Address */}
            <div>

              <h2 className="text-xl font-semibold mb-4">
                Address
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <MapPin
                  size={20}
                  className="text-blue-600"
                />

                <span className="text-gray-600">
                  Delivery Address
                </span>
              </div>

              <div className="space-y-4">

                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street / House No."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="PIN Code"
                    maxLength="6"
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Save Changes
              </button>

              <Link
                to="/profile"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditProfile;