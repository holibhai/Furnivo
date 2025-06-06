import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users,
  User,
  Trash2,
  Edit,
  Mail,
  Phone,
  Calendar,
  Loader,
  AlertCircle,
  Shield
} from 'react-feather';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  const getProfilePicture = (firstName, lastName) => {
    const name = `${firstName}+${lastName}`;
    return `https://ui-avatars.com/api/?name=${name}&background=random&size=128&rounded=true&color=fff`;
  };

  const handleApiCall = async (apiCall, successMessage, errorMessage) => {
    try {
      setIsProcessing(true);
      const response = await apiCall();
      if (successMessage) {
        toast.success(successMessage);
      }
      return response;
    } catch (err) {
      console.error(errorMessage || 'API Error:', err);
      const errorMsg = err.response?.data?.message || errorMessage || 'Operation failed';
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await handleApiCall(
          () => api.get('/user/getUsers'),
          null,
          'Failed to fetch customer data'
        );

        const customerUsers = response.data.userAccountDtoList.filter(
          user => user.role === 'USER'
        );
        
        setCustomers(customerUsers);
        
      } catch (err) {
        setError('Failed to fetch customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this customer?');
    if (!confirmDelete) return;

    try {
      await handleApiCall(
        () => api.delete(`/user/delete/${id}`),
        'Customer deleted successfully'
      );
      
      setCustomers(customers.filter(customer => customer.id !== id));
    } catch (err) {
    }
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="max-w-md p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-start">
          <AlertCircle className="mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
            <p className="text-gray-600">Manage your customer accounts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-800">{customers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <User className="text-green-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Customers</p>
                <p className="text-2xl font-semibold text-gray-800">{customers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="text-purple-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New This Month</p>
                <p className="text-2xl font-semibold text-gray-800">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Customer List</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={getProfilePicture(customer.firstName, customer.lastName)} 
                            alt="Profile" 
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">ID: {customer.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.username}</div>
                        <div className="text-sm text-gray-500">-</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewCustomerDetails(customer)}
                          disabled={isProcessing}
                          className="text-blue-600 hover:text-blue-900 mr-4 disabled:text-gray-400"
                          title="View Details"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          disabled={isProcessing}
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                          title="Delete Customer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <img 
                  src={getProfilePicture(selectedCustomer.firstName, selectedCustomer.lastName)} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full mb-4"
                />
                <h4 className="text-xl font-semibold text-gray-800">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </h4>
                <span className="text-sm text-gray-500">Customer ID: {selectedCustomer.id}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-md font-medium text-gray-700 mb-3">Contact Information</h5>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-800">{selectedCustomer.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-800">Not available</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-md font-medium text-gray-700 mb-3">Account Information</h5>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Type</p>
                      <p className="text-sm text-gray-800 capitalize">{selectedCustomer.role.toLowerCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Shield className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
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

export default Customers;