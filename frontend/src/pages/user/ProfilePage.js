import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useOrders } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";

// Profile Page
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useUser();
  const { orders, orderHistory } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zip: user?.zip || "",
  }));

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || "",
      });
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const allOrders = [...orders, ...orderHistory];
  const totalOrders = allOrders.length;
  const totalSpent = allOrders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );
  const memberSince = user
    ? new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  const handleInputChange = (e) => {
    setError("");
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const validateProfile = () => {
    if (!profile.firstName || !profile.lastName) {
      setError("First and last name are required");
      return false;
    }
    if (!profile.email || !/\S+@\S+\.\S+/.test(profile.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!profile.phone) {
      setError("Phone number is required");
      return false;
    }
    if (!profile.address || !profile.city || !profile.state || !profile.zip) {
      setError("Please fill in all address fields");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateProfile()) return;

    updateUser(profile);
    setIsEditing(false);
    setError("");
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <h1 className="text-3xl md:text-4xl font-bold uppercase mb-8">
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Profile Sidebar --- */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-black">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </div>
              <h2 className="text-xl font-bold mb-1">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-400 text-sm mb-6">{profile.email}</p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
                >
                  View Orders
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="w-full bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 mt-4">
              <h3 className="font-bold mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Orders</span>
                  <span className="font-semibold">{totalOrders}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Spent</span>
                  <span className="font-semibold">
                    ${totalSpent.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Member Since</span>
                  <span className="font-semibold">{memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Profile Details --- */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-2xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                {error && (
                  <div className="text-red-500 text-sm mb-4">{error}</div>
                )}
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition font-semibold"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-400">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                      />
                    ) : (
                      <p className="text-lg">{profile.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-400">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                      />
                    ) : (
                      <p className="text-lg">{profile.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-400">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                    />
                  ) : (
                    <p className="text-lg">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-400">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                    />
                  ) : (
                    <p className="text-lg">{profile.phone}</p>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h3 className="text-xl font-bold mb-4">Shipping Address</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-400">
                        Street Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={profile.address}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        />
                      ) : (
                        <p className="text-lg">{profile.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={profile.city}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          />
                        ) : (
                          <p className="text-lg">{profile.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          State
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="state"
                            value={profile.state}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          />
                        ) : (
                          <p className="text-lg">{profile.state}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-400">
                          ZIP
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="zip"
                            value={profile.zip}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          />
                        ) : (
                          <p className="text-lg">{profile.zip}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
