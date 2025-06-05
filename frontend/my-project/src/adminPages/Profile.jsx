import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Pencil, 
  Save, 
  X, 
  Lock, 
  Mail, 
  User, 
  Image as ImageIcon,
  Settings,
  ChevronRight,
  Shield,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [securityEditMode, setSecurityEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    image: null,
    previewImage: ''
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/user/getUser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.data.statusCode === 200) {
          setUser(response.data.userAccountDto);
          setFormData(prev => ({
            ...prev,
            firstName: response.data.userAccountDto.firstName,
            lastName: response.data.userAccountDto.lastName,
            username: response.data.userAccountDto.username,
            previewImage: `data:${response.data.userAccountDto.imageType};base64,${response.data.userAccountDto.imageData}`
          }));
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          previewImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
      newErrors.username = 'Invalid email format';
    }
    return newErrors;
  };

  const validateSecurityForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateProfileForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const formDataToSend = new FormData();
      
      // Append user data as JSON
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        password:null
      };
    //   formDataToSend.append('user', JSON.stringify(userData));
       formDataToSend.append(
      "user",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );
      if (formData.image) {
        formDataToSend.append('imageFile', formData.image);
      }

      const response = await axios.put(
        `http://localhost:8080/api/user/updateUser/${userId}`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.statusCode === 200) {
        setUser(response.data.userAccountDto);
        setEditMode(false);
        // Update form data with new values
        setFormData(prev => ({
          ...prev,
          firstName: response.data.userAccountDto.firstName,
          lastName: response.data.userAccountDto.lastName,
          username: response.data.userAccountDto.username,
          previewImage: `data:${response.data.userAccountDto.imageType};base64,${response.data.userAccountDto.imageData}`
        }));
      }
    } catch (err) {
      console.error('Update failed:', err);
      if (err.response && err.response.data.message) {
        setErrors({ server: err.response.data.message });
      } else {
        setErrors({ server: 'Failed to update profile' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateSecurityForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      const response = await axios.put(
        `http://localhost:8080/api/user/changePassword/${userId}`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.statusCode === 200) {
        setSecurityEditMode(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setErrors({});
        alert('Password changed successfully');
      }
    } catch (err) {
      console.error('Password change failed:', err);
      if (err.response && err.response.data.message) {
        setErrors({ server: err.response.data.message });
      } else {
        setErrors({ server: 'Failed to change password' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500">Failed to load user profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {user.firstName} {user.lastName}
            </span>
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={ user && user.imageType?`data:${user.imageType};base64,${user.imageData}`:"https://i.pravatar.cc/40"} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 border-4 border-blue-100">
                <img
                  src={formData.previewImage || user && user.imageType? `data:${user.imageType};base64,${user.imageData}`:"https://i.pravatar.cc/40"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {editMode && (
                  <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer">
                    <ImageIcon className="text-white" size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              <h2 className="text-lg font-semibold text-center">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-blue-600">{user.role}</p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <User className="mr-2" size={16} />
                  Profile
                </div>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <Shield className="mr-2" size={16} />
                  Security
                </div>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="mr-2" size={16} />
                Logout
              </button>
            </nav>
          </div>

          {/* Profile Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeTab === 'profile' && 'Profile Information'}
                  {activeTab === 'security' && 'Security Settings'}
                </h2>
                {activeTab === 'profile' ? (
                  <button
                    onClick={() => editMode ? handleProfileSubmit({ preventDefault: () => {} }) : setEditMode(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    disabled={loading}
                  >
                    {editMode ? (
                      <>
                        <Save className="mr-1" size={16} />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </>
                    ) : (
                      <>
                        <Pencil className="mr-1" size={16} />
                        Edit Profile
                      </>
                    )}
                  </button>
                ) : activeTab === 'security' && !securityEditMode ? (
                  <button
                    onClick={() => setSecurityEditMode(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    <Pencil className="mr-1" size={16} />
                    Change Password
                  </button>
                ) : null}
              </div>
            </div>

            <div className="p-6">
              {errors.server && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {errors.server}
                </div>
              )}

              {activeTab === 'profile' ? (
                <form onSubmit={handleProfileSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        {editMode ? (
                          <>
                            <input
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full rounded-md ${errors.firstName ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border`}
                            />
                            {errors.firstName && (
                              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                            )}
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{user.firstName}</p>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        {editMode ? (
                          <>
                            <input
                              type="text"
                              name="lastName"
                              id="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full rounded-md ${errors.lastName ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border`}
                            />
                            {errors.lastName && (
                              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                            )}
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{user.lastName}</p>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        {editMode ? (
                          <>
                            <input
                              type="email"
                              name="username"
                              id="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full rounded-md ${errors.username ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border`}
                            />
                            {errors.username && (
                              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                        )}
                      </div>

                      {editMode && (
                        <div className="sm:col-span-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Profile photo
                          </label>
                          <div className="mt-1 flex items-center">
                            <label className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer">
                              <ImageIcon className="mr-1" size={16} />
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                              />
                            </label>
                            {formData.image && (
                              <span className="ml-2 text-sm text-gray-500">
                                {formData.image.name}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSecuritySubmit}>
                  <div className="space-y-6">
                    {securityEditMode ? (
                      <>
                        <div className="sm:col-span-6">
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <div className="mt-1 relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="currentPassword"
                              id="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className={`block w-full rounded-md ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border`}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                          )}
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <div className="mt-1 relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="newPassword"
                              id="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className={`block w-full rounded-md ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border`}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                          )}
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <div className="mt-1 relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              id="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`block w-full rounded-md ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border`}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                          )}
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSecurityEditMode(false);
                              setErrors({});
                              setFormData(prev => ({
                                ...prev,
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                              }));
                            }}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Password Security</h3>
                        <p className="text-sm text-gray-600">
                          Last changed: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;