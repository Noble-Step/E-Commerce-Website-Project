import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useOrders } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { useModal, MODAL_TYPES } from "../../context/ModalContext";
import { usePageTitle } from "../../utils/usePageTitle";
import { ALERT_TYPES } from "../../modals/AlertModal";

// Profile Page
const buildProfileState = (user) => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  email: user?.email || "",
  phone: user?.phone || "",
  address: user?.address?.street || "",
  city: user?.address?.city || "",
  state: user?.address?.state || "",
  zip: user?.address?.zip || "",
  country: user?.address?.country || "",
});

const ProfilePage = () => {
  usePageTitle("My Profile");
  const navigate = useNavigate();
  const { user, updateUser, logout } = useUser();
  const { orders, orderHistory } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const { openModal } = useModal();
  const [profile, setProfile] = useState(() => buildProfileState(user));

  useEffect(() => {
    if (user) {
      setProfile(buildProfileState(user));
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
    setValidationErrors([]);
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const validateProfile = () => {
    const missing = [];
    if (!profile.firstName) missing.push("first name");
    if (!profile.lastName) missing.push("last name");
    if (!profile.email) missing.push("email address");
    if (!profile.phone) missing.push("phone number");
    if (!profile.address) missing.push("street address");
    if (!profile.city) missing.push("city");
    if (!profile.state) missing.push("state");
    if (!profile.zip) missing.push("ZIP code");
    
    if (missing.length > 0) {
      setError(`Please fill in the following required fields: ${missing.join(", ")}`);
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(profile.email)) {
      setError("Please enter a valid email address (e.g., yourname@example.com)");
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    setValidationErrors([]);
    if (!validateProfile()) return;
    try {
      await updateUser({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        address: {
          street: profile.address.trim(),
          city: profile.city.trim(),
          state: profile.state.trim(),
          zip: profile.zip.trim(),
          country: (profile.country || "USA").trim(),
        },
      });
      setIsEditing(false);
      setError("");
      setValidationErrors([]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Unable to save profile";
      setError(errorMessage);
      setValidationErrors(err.response?.data?.errors || []);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <h1 className="text-3xl md:text-4xl font-bold uppercase mb-8">
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-black">
                {(
                  (profile.firstName?.[0] || "") + (profile.lastName?.[0] || "") ||
                  "N"
                ).toUpperCase()}
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
                    openModal(MODAL_TYPES.ALERT_MODAL, {
                      ...ALERT_TYPES.LOGOUT_CONFIRM,
                      onConfirm: () => {
                        logout();
                        navigate("/");
                      },
                    });
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

          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-2xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                {error && (
                  <div className="text-red-500 text-sm mb-4" role="alert" aria-live="polite">
                    <p>{error}</p>
                    {validationErrors.length > 0 && (
                      <ul className="list-disc list-inside mt-2 space-y-1 text-red-400">
                        {validationErrors.map((validationError) => (
                          <li key={`${validationError.field}-${validationError.message}`}>
                            {validationError.message}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
                    <label htmlFor="profile-firstname" className="block text-sm mb-2 text-gray-400">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        id="profile-firstname"
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        aria-required="true"
                      />
                    ) : (
                      <p className="text-lg">{profile.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="profile-lastname" className="block text-sm mb-2 text-gray-400">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        id="profile-lastname"
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        aria-required="true"
                      />
                    ) : (
                      <p className="text-lg">{profile.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-email" className="block text-sm mb-2 text-gray-400">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      id="profile-email"
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                      aria-required="true"
                    />
                  ) : (
                    <p className="text-lg">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="profile-phone" className="block text-sm mb-2 text-gray-400">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      id="profile-phone"
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                      aria-required="true"
                    />
                  ) : (
                    <p className="text-lg">{profile.phone}</p>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h3 className="text-xl font-bold mb-4">Shipping Address</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="profile-address" className="block text-sm mb-2 text-gray-400">
                        Street Address
                      </label>
                      {isEditing ? (
                        <input
                          id="profile-address"
                          type="text"
                          name="address"
                          value={profile.address}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                          aria-required="true"
                        />
                      ) : (
                        <p className="text-lg">{profile.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="profile-city" className="block text-sm mb-2 text-gray-400">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            id="profile-city"
                            type="text"
                            name="city"
                            value={profile.city}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                            aria-required="true"
                          />
                        ) : (
                          <p className="text-lg">{profile.city}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="profile-state" className="block text-sm mb-2 text-gray-400">
                          State
                        </label>
                        {isEditing ? (
                          <input
                            id="profile-state"
                            type="text"
                            name="state"
                            value={profile.state}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                            aria-required="true"
                          />
                        ) : (
                          <p className="text-lg">{profile.state}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="profile-zip" className="block text-sm mb-2 text-gray-400">
                          ZIP
                        </label>
                        {isEditing ? (
                          <input
                            id="profile-zip"
                            type="text"
                            name="zip"
                            value={profile.zip}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                            aria-required="true"
                          />
                        ) : (
                          <p className="text-lg">{profile.zip}</p>
                        )}
                      </div>
                  <div>
                    <label htmlFor="profile-country" className="block text-sm mb-2 text-gray-400">
                      Country
                    </label>
                    {isEditing ? (
                      <input
                        id="profile-country"
                        type="text"
                        name="country"
                        value={profile.country}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                      />
                    ) : (
                      <p className="text-lg">{profile.country || "—"}</p>
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
