import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  User, 
  Shield 
} from 'react-feather';

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form state for adding new admin
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'ADMIN'
  });

  // Function to generate random profile pictures based on name
  const getProfilePicture = (firstName, lastName) => {
    const name = `${firstName}+${lastName}`;
    return `https://ui-avatars.com/api/?name=${name}&background=random&size=128&rounded=true&color=fff`;
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/user/getUsers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Filter only ADMIN users
        const adminUsers = response.data.userAccountDtoList.filter(
          user => user.role === 'ADMIN'
        );
        
        setAdmins(adminUsers);
        
        // Set current admin (assuming the first admin is the current one)
        if (adminUsers.length > 0) {
          setCurrentAdmin(adminUsers[0]);
        }
        
      } catch (err) {
        setError('Failed to fetch admin data');
        console.error('Error fetching admins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleAddAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/authentication/register',
        newAdmin,
        {
           headers: {
              "Content-Type": "application/json",
            Authorization: `Bearer ${token}`

            },
        }
      );
      console.log(response.data)
      

      if (response.status === 200) {
        alert("success");
        // Refresh admin list
        const updatedResponse = await axios.get('http://localhost:8080/api/user/getUsers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const adminUsers = updatedResponse.data.userAccountDtoList.filter(
          user => user.role === 'ADMIN'
        );
        
        setAdmins(adminUsers);
        setShowAddModal(false);
        setNewAdmin({
          username: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'ADMIN'
        });
      }
    } catch (err) {
      console.error('Error adding admin:', err);
      alert("failed")
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const userId=localStorage.getItem('userId');
      const response = await axios.delete(
        `http://localhost:8080/api/user/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setAdmins(admins.filter(admin => admin.id !== id));
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
      setError('Failed to delete admin');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const viewAdminDetails = (admin) => {
    setSelectedAdmin(admin);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage system administrators</p>
          </div>
          
          {currentAdmin && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img 
                  src={getProfilePicture(currentAdmin.firstName, currentAdmin.lastName)} 
                  alt="Profile" 
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Logged in as</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {currentAdmin.firstName} {currentAdmin.lastName}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="text-green-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Admins</p>
                <p className="text-2xl font-semibold text-gray-800">{admins.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Admin Users</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              <PlusCircle size={18} />
              <span>Add Admin</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={getProfilePicture(admin.firstName, admin.lastName)} 
                            alt="Profile" 
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.firstName} {admin.lastName}
                            </div>
                            <div className="text-sm text-gray-500">ID: {admin.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewAdminDetails(admin)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No admin users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Admin</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={newAdmin.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={newAdmin.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="username"
                  value={newAdmin.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newAdmin.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAdmin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Details Modal */}
      {showDetailsModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Admin Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <img 
                  src={getProfilePicture(selectedAdmin.firstName, selectedAdmin.lastName)} 
                  alt="Profile" 
                  className="h-24 w-24 rounded-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">First Name</p>
                  <p className="text-base font-semibold text-gray-800">{selectedAdmin.firstName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Name</p>
                  <p className="text-base font-semibold text-gray-800">{selectedAdmin.lastName}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base font-semibold text-gray-800">{selectedAdmin.username}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-base font-semibold text-gray-800">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {selectedAdmin.role}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="text-base font-semibold text-gray-800">{selectedAdmin.id}</p>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;