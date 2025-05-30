import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductCatagorie = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    catagorieId: '',
    catagorieType: '',
    catagorieDescription: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.catagorieId || !formData.catagorieType || !formData.catagorieDescription) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/catagorie/add',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // If you use token
          },
        }
      );

      if (response.data.statusCode === 200) {
        setSuccess('Category added successfully!');
        setError('');
        setFormData({
          catagorieId: '',
          catagorieType: '',
          catagorieDescription: '',
        });
        navigate("/admin/catagory")
      } else {
        setError('Something went wrong. Please try again.');
        setSuccess('');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
      setSuccess('');
    }
  };

  return (
    <div className=" border  p-6  rounded-lg">
      <div className=''>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add New Product Category</h2>

{success && <div className="text-green-600 mb-4">{success}</div>}
{error && <div className="text-red-600 mb-4">{error}</div>}

<form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
  <div>
    <label className="block text-gray-600 mb-1">Category ID</label>
    <input
      type="text"
      name="catagorieId"
      value={formData.catagorieId}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-2 rounded bg-gray-100"
      placeholder="e.g., deb001"
    />
  </div>

  <div>
    <label className="block text-gray-600 mb-1">Category Type</label>
    <input
      type="text"
      name="catagorieType"
      value={formData.catagorieType}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-2 rounded bg-gray-100"
      placeholder="e.g., bedroom"
    />
  </div>

  <div>
    <label className="block text-gray-600 mb-1">Description</label>
    <textarea
      name="catagorieDescription"
      value={formData.catagorieDescription}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-2 rounded bg-gray-100"
      placeholder="e.g., Bedroom made items"
      rows={3}
    />
  </div>

  <button
    type="submit"
    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-800 transition"
  >
    Add Category
  </button>
</form>
      </div>
     
    </div>
  );
};

export default AddProductCatagorie;
