import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductType = () => {
  const [formData, setFormData] = useState({
    productTypeName: '',
    description: '',
    catagorie: '',
  });

  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/catagorie/get');
        setCategories(res.data.catagorieDtoList);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Could not load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productTypeName || !formData.description || !formData.catagorie) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/productType/add',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        setSuccess('Product Type added successfully!');
        setError('');
        setFormData({
          productTypeName: '',
          description: '',
          catagorie: '',
        });
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
    <div className="border p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add New Product Type</h2>

      {success && <div className="text-green-600 mb-4">{success}</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
        <div>
          <label className="block text-gray-600 mb-1">Product Type Name</label>
          <input
            type="text"
            name="productTypeName"
            value={formData.productTypeName}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded bg-gray-100"
            placeholder="dining chair"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded bg-gray-100"
            placeholder="Comfortable wooden chair"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Select Category</label>
          <select
            name="catagorie"
            value={formData.catagorie}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded bg-gray-100"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.catagorieId} value={cat.catagorieType}>
                {cat.catagorieType}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-800 transition"
        >
          Add Product Type
        </button>
      </form>
    </div>
  );
};

export default ProductType;
