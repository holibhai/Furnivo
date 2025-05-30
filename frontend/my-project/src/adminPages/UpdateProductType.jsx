import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProductType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  console.log(id);

  const [formData, setFormData] = useState({
    description:'',
    productTypeName: '',
    catagorie: '',
  });

  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch product type by ID
  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/productType/get/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const dto = response.data.productTypeDto;
        setFormData({ 
          description:dto.description,
          productTypeName: dto.productTypeName,
          catagorie: dto.catagorie,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load product type data');
      }
    };

    fetchProductType();
  }, [id]);

  // Fetch available categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/catagorie/get", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCategories(response.data.catagorieDtoList || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !formData.productTypeName || !formData.catagorie) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/productType/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        setSuccess('Product type updated successfully!');
        setError('');
        setTimeout(() => navigate('/admin/displayProductType'), 1500);
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
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Update Product Type</h2>

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
            placeholder="Sofa"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Category</label>
          <select
            name="catagorie"
            value={formData.catagorie}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded bg-gray-100"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.catagorieType}>
                {cat.catagorieType}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-800 transition"
        >
          Update Product Type
        </button>
      </form>
    </div>
  );
};

export default UpdateProductType;
