import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CatagoryUpdate = () => {
  const navigate = useNavigate();
  const location=useLocation();
  const id=location.state?.id;
  const [formData, setFormData] = useState({
    catagorieId: '',
    catagorieType: '',
    catagorieDescription: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch existing category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/catagorie/get/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        });

        if (response.data) {
          setFormData({
            catagorieId: response.data.catagorieDto.id,
            catagorieType: response.data.catagorieDto.catagorieType,
            catagorieDescription: response.data.catagorieDto.catagorieDescription,
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load category data');
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.catagorieId || !formData.catagorieType || !formData.catagorieDescription) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/catagorie/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        setSuccess('Category updated successfully!');
        setError('');
        setTimeout(() => navigate('/admin/catagory'), 1500);
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
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Update Product Category</h2>

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
            placeholder="deb001"
            readOnly // ID should not be editable
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
            placeholder="bedroom"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <textarea
            name="catagorieDescription"
            value={formData.catagorieDescription}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded bg-gray-100"
            placeholder="Bedroom made items"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-800 transition"
        >
          Update Category
        </button>
      </form>
    </div>
  );
};

export default CatagoryUpdate;
