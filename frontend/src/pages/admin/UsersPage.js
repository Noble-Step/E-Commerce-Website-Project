import React, { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { useUser } from "../../context/UserContext";
import { Trash2, Shield, ShieldOff, PencilLine, X, RefreshCcw } from "lucide-react";
import AlertModal, { ALERT_TYPES } from "../../modals/AlertModal";

const UsersPage = () => {
  const {
    user: currentUser,
    registeredUsers,
    updateRegisteredUser,
    toggleAdminForUser,
    deleteRegisteredUser,
    registryHydrated,
    seedRegisteredUsers,
  } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);
  const users = registeredUsers || [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });

  const handleInputChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = updateRegisteredUser(editingUser.id, formData);
    if (ok) {
      setAlertConfig({
        ...ALERT_TYPES.SUCCESS,
        message: "User updated successfully",
      });
      setShowModal(false);
      resetForm();
    } else {
      setAlertConfig({
        type: "error",
        title: "Update blocked",
        message: "You cannot edit your own admin profile.",
      });
    }
    setShowAlert(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,
    });
    setShowModal(true);
  };

  const handleDelete = (user) => {
    if (user.id === currentUser.id) {
      setAlertConfig({
        type: "error",
        title: "Cannot Delete",
        message: "You cannot delete your own account",
      });
      setShowAlert(true);
      return;
    }
    setAlertConfig({
      ...ALERT_TYPES.DELETE_CONFIRM,
      message:
        "Are you sure you want to delete this user? This action cannot be undone.",
      onConfirm: () => {
        const ok = deleteRegisteredUser(user.id);
        setAlertConfig(
          ok
            ? { ...ALERT_TYPES.SUCCESS, message: "User deleted successfully" }
            : {
                type: "error",
                title: "Cannot Delete",
                message: "Unable to delete this user.",
              }
        );
        setShowAlert(true);
      },
    });
    setShowAlert(true);
  };

  const toggleAdmin = (user) => {
    const ok = toggleAdminForUser(user.id);
    if (ok) {
      setAlertConfig({
        ...ALERT_TYPES.SUCCESS,
        message: `User ${user.name} is ${!user.isAdmin ? "now" : "no longer"} an admin`,
      });
    } else {
      setAlertConfig({
        type: "error",
        title: "Cannot Modify",
        message: "You cannot modify your own admin status",
      });
    }
    setShowAlert(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      isAdmin: false,
    });
    setEditingUser(null);
  };

  const renderTable = () => {
    if (!registryHydrated) {
      return (
        <div className="bg-gray-900 rounded-xl lg:rounded-2xl p-6 lg:p-10 text-center text-gray-400">
          Loading registered users...
        </div>
      );
    }

    if (!users.length) {
      return (
        <div className="bg-gray-900 rounded-xl lg:rounded-2xl p-6 lg:p-10 text-center text-gray-400">
          <p className="text-lg lg:text-xl text-white font-semibold mb-2">No users available</p>
          <p className="text-sm mb-6">Seed sample accounts to explore admin actions.</p>
          <button
            onClick={seedRegisteredUsers}
            className="inline-flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-500 transition text-sm lg:text-base"
          >
            <RefreshCcw size={18} />
            Seed sample users
          </button>
        </div>
      );
    }

    return (
      <div className="bg-gray-900 rounded-xl lg:rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm">User</th>
                <th className="text-left py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm">Email</th>
                <th className="text-left py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm">Role</th>
                <th className="text-left py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm hidden md:table-cell">Joined</th>
                <th className="text-right py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800">
                  <td className="py-3 lg:py-4 px-4 lg:px-6">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-sm lg:text-base">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white text-sm lg:text-base truncate">{user.name}</p>
                        {user.id === currentUser.id && (
                          <span className="text-xs text-yellow-400">(You)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 lg:py-4 px-4 lg:px-6 text-gray-300 text-xs lg:text-sm truncate max-w-[150px] lg:max-w-none">{user.email}</td>
                  <td className="py-3 lg:py-4 px-4 lg:px-6">
                    <span
                      className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin
                          ? "bg-purple-400/10 text-purple-400"
                          : "bg-blue-400/10 text-blue-400"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="py-3 lg:py-4 px-4 lg:px-6 text-gray-300 text-xs lg:text-sm hidden md:table-cell">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 lg:py-4 px-4 lg:px-6 text-right">
                    <div className="flex items-center justify-end gap-1 lg:gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        disabled={user.id === currentUser.id}
                        className={`p-1.5 lg:p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition ${
                          user.id === currentUser.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <PencilLine size={16} className="lg:w-[18px] lg:h-[18px]" />
                      </button>
                      <button
                        onClick={() => toggleAdmin(user)}
                        disabled={user.id === currentUser.id}
                        className={`p-1.5 lg:p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition ${
                          user.id === currentUser.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {user.isAdmin ? <ShieldOff size={16} className="lg:w-[18px] lg:h-[18px]" /> : <Shield size={16} className="lg:w-[18px] lg:h-[18px]" />}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={user.id === currentUser.id}
                        className={`p-1.5 lg:p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition ${
                          user.id === currentUser.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Trash2 size={16} className="lg:w-[18px] lg:h-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl lg:text-2xl font-bold text-white">Users</h1>
        </div>

        {/* Users Table */}
        {renderTable()}
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl lg:rounded-2xl p-4 lg:p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-white">Edit User</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs lg:text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-white focus:border-yellow-400 focus:outline-none text-sm lg:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs lg:text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-white focus:border-yellow-400 focus:outline-none text-sm lg:text-base"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isAdmin"
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-800 text-yellow-400 focus:ring-yellow-400"
                />
                <label htmlFor="isAdmin" className="text-xs lg:text-sm text-gray-400">
                  Admin privileges
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition text-sm lg:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition text-sm lg:text-base font-medium"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertConfig && (
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          {...alertConfig}
        />
      )}
    </AdminLayout>
  );
};

export default UsersPage;