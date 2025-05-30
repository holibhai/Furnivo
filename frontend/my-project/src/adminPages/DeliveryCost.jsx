import React, { useState, useEffect } from 'react';
import {
  Truck, Plus, Edit2, Trash2, Search,
  ChevronDown, ChevronUp, Loader2, Check, X
} from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeliveryCost = () => {
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', city: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'city', direction: 'ascending' });

  const token = localStorage.getItem('token'); // or use sessionStorage or context if needed
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/deliveryCharge/get',
          config
        );
        setDeliveryCharges(response.data.deliveryChargeDtoList);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch delivery charges');
        setLoading(false);
      }
    };
    fetchDeliveryCharges();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.city || !formData.price) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/deliveryCharge/update/${formData.id}`,
          {
            city: formData.city,
            price: parseFloat(formData.price),
          },
          config
        );
        toast.success('Delivery charge updated successfully');
      } else {
        await axios.post(
          'http://localhost:8080/api/deliveryCharge/add',
          {
            city: formData.city,
            price: parseFloat(formData.price),
          },
          config
        );
        toast.success('Delivery charge added successfully');
      }

      const response = await axios.get(
        'http://localhost:8080/api/deliveryCharge/get',
        config
      );
      setDeliveryCharges(response.data.deliveryChargeDtoList);
      setFormData({ id: '', city: '', price: '' });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (charge) => {
    setFormData({
      id: charge.id,
      city: charge.city,
      price: charge.price.toString(),
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
      try {
        await axios.delete(
          `http://localhost:8080/api/deliveryCharge/delete/${id}`,
          config
        );
        toast.success('Delivery charge deleted successfully');

        const response = await axios.get(
          'http://localhost:8080/api/deliveryCharge/get',
          config
        );
        setDeliveryCharges(response.data.deliveryChargeDtoList);
      } catch (error) {
        toast.error('Failed to delete delivery charge');
      }
    
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredCharges = [...deliveryCharges]
    .filter(charge =>
      charge.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.price.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });

  return (
    <div className="p-6  min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Truck className="mr-2" /> Delivery Cost Management
          </h1>
        </div>

        {/* Form */}
        <div className="rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {isEditing ? 'Edit Delivery Charge' : 'Add New Delivery Charge'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter delivery price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                {isEditing ? (
                  <>
                    <Check className="mr-1" size={18} /> Update
                  </>
                ) : (
                  <>
                    <Plus className="mr-1" size={18} /> Add
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ id: '', city: '', price: '' });
                    setIsEditing(false);
                  }}
                  className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md flex items-center"
                >
                  <X className="mr-1" size={18} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className=" rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Delivery Charges</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by city or price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      onClick={() => requestSort('city')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center">
                        City
                        {sortConfig.key === 'city' &&
                          (sortConfig.direction === 'ascending'
                            ? <ChevronUp className="ml-1" size={16} />
                            : <ChevronDown className="ml-1" size={16} />)}
                      </div>
                    </th>
                    <th
                      onClick={() => requestSort('price')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center">
                        Price (LKR)
                        {sortConfig.key === 'price' &&
                          (sortConfig.direction === 'ascending'
                            ? <ChevronUp className="ml-1" size={16} />
                            : <ChevronDown className="ml-1" size={16} />)}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className=" divide-y divide-gray-200">
                  {sortedAndFilteredCharges.length > 0 ? (
                    sortedAndFilteredCharges.map((charge) => (
                      <tr key={charge.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{charge.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          LKR {parseFloat(charge.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(charge)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(charge.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No delivery charges found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCost;
