import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { useUser } from '../../context/UserContext';
import { Trash2, Shield, ShieldOff, PencilLine, X } from 'lucide-react';
import AlertModal, { ALERT_TYPES } from '../../modals/AlertModal';

const UsersPage = () => {
  const { user: currentUser, registeredUsers, updateRegisteredUser, toggleAdminForUser, deleteRegisteredUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);
  const users = registeredUsers || [];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false
  });

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRegisteredUser(editingUser.id, formData);

    setAlertConfig({ ...ALERT_TYPES.SUCCESS, message: 'User updated successfully' });
    setShowAlert(true);
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false
    });
    setShowModal(true);
  };

  const handleDelete = (user) => {
    if (user.id === currentUser.id) {
      setAlertConfig({
        type: 'error',
        title: 'Cannot Delete',
        message: 'You cannot delete your own account'
      });
      setShowAlert(true);
      return;
    }
    setAlertConfig({
      ...ALERT_TYPES.DELETE_CONFIRM,
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      onConfirm: () => {
        deleteRegisteredUser(user.id);
        setAlertConfig({ ...ALERT_TYPES.SUCCESS, message: 'User deleted successfully' });
        setShowAlert(true);
      }
    });
    setShowAlert(true);
  };

  const toggleAdmin = (user) => {
    if (user.id === currentUser.id) {
      setAlertConfig({
        type: 'error',
        title: 'Cannot Modify',
        message: 'You cannot modify your own admin status'
      });
      setShowAlert(true);
      return;
    }
    const ok = toggleAdminForUser(user.id);
    if (ok) {
      setAlertConfig({ 
        ...ALERT_TYPES.SUCCESS, 
        message: `User ${user.name} is ${!user.isAdmin ? 'now' : 'no longer'} an admin`
      });
    } else {
      setAlertConfig({ type: 'error', title: 'Error', message: 'Could not toggle admin status' });
    }
    setShowAlert(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      isAdmin: false
    });
    setEditingUser(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Users</h1>
        </div>

  {/* --- Users Table --- */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">User</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Role</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Joined</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                          <span className="text-black font-bold">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          {user.id === currentUser.id && (
                            <span className="text-xs text-yellow-400">(You)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin
                            ? 'bg-purple-400/10 text-purple-400'
                            : 'bg-blue-400/10 text-blue-400'
                        }`}
                      >
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={user.id === currentUser.id}
                          className={`p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition ${
                            user.id === currentUser.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <PencilLine size={18} />
                        </button>
                        <button
                          onClick={() => toggleAdmin(user)}
                          disabled={user.id === currentUser.id}
                          className={`p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition ${
                            user.id === currentUser.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {user.isAdmin ? (
                            <ShieldOff size={18} />
                          ) : (
                            <Shield size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={user.id === currentUser.id}
                          className={`p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition ${
                            user.id === currentUser.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

  {/* --- Edit User Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Edit User</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-yellow-400 focus:outline-none"
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
                <label htmlFor="isAdmin" className="text-sm text-gray-400">
                  Admin privileges
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

  {/* --- Alert Modal --- */}
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