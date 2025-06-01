import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Loader2, Check, X, Eye, EyeOff } from "lucide-react";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import furnitureImage1 from "../assets/photo-1644057501622-dfa7dd26dbfb.avif";
import furnitureImage2 from "../assets/photo-1713707131805-f0d7d7432598.avif";
import furnitureImage3 from "../assets/photo-1611892440504-42a792e24d32.avif";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Furniture images for the carousel
  const furnitureImages = [
    furnitureImage1,
    furnitureImage2,
    furnitureImage3,
  ];

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % furnitureImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [furnitureImages.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
      newErrors.username = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/authentication/register", 
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log(response.data);
      setSuccess(true);
      toast.success("Register Successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("already exists")) {
          errorMessage = "This email is already registered. Please login instead.";
        } else {
          errorMessage = error.response.data.message;
        }
      }
      
      setErrors({ ...errors, form: errorMessage });
      toast.error('Register not successfully');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className=" flex items-center justify-center">
                                    <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col lg:flex-row bg-white shadow-2xl  overflow-hidden w-full max-w-[1800px]">
        {/* Image Carousel Side - 2/3 width */}
        <div className="hidden lg:block lg:w-2/3 relative h-[700px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
          <div className="h-full w-full flex">
            {furnitureImages.map((img, index) => (
              <div 
                key={index} 
                className={`min-w-full h-full transition-opacity duration-1000 ease-in-out absolute inset-0 ${
                  currentImage === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img}
                  alt={`Furniture ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
            {furnitureImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentImage === index ? 'bg-white w-6' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="absolute bottom-20 left-0 right-0 z-20 text-center px-8">
            <h2 className="text-4xl font-bold text-white mb-3">Welcome to Our Furniture Store</h2>
            <p className="text-white/90 text-lg">Create an account to explore our premium collection</p>
          </div>
        </div>

        {/* Form Side - 1/3 width */}
        <div className="w-full lg:w-1/3 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us to start your furniture shopping journey</p>
          </div>

          {/* {errors.form && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
              <X className="flex-shrink-0 h-5 w-5 mt-0.5 mr-2" />
              <div>{errors.form}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg flex items-start">
              <Check className="flex-shrink-0 h-5 w-5 mt-0.5 mr-2" />
              <div>
                <p className="font-medium">Registration successful!</p>
                <p className="text-sm">Redirecting you to login page...</p>
              </div>
            </div>
          )} */}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name 
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} focus:ring-2 focus:outline-none transition`}
                  placeholder="Mohanathas"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name 
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} focus:ring-2 focus:outline-none transition`}
                  placeholder="Holins"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address 
              </label>
              <input
                type="email"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} focus:ring-2 focus:outline-none transition`}
                placeholder="your@email.com"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password 
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} focus:ring-2 focus:outline-none transition pr-12`}
                    placeholder="••••••••"
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password 
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'} focus:ring-2 focus:outline-none transition pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;