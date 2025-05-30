import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "../assets/scandinavian-vintage-wood-cabinet-with-chair-by-dark-blue-wall_53876-98164.jpg";
// import cake from "my-project/src/assets"
import axios from "axios"

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    // confirmPassword: "",
    // agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/authentication/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      console.log(data);
      alert(data.message || "Registration successful!");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="">
       <div className="flex h-screen w-screen items-center justify-center pt-36">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-3/4 max-w-4xl">
        <div className="w-1/2 hidden md:block bg-no-repeat bg-left">
          <img
            src={image}
            alt="Register"
            className="w-full h-full object-cover object-left "
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 ">
            Register
          </h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Password"
                />
              </div>
              <div>
                <label className="block text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Email"
              />
            </div>

            {/* <div className="flex items-center">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mr-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <label className="text-gray-700">
                I agree to the terms and conditions
              </label>
            </div> */}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-800 via-orange-500 to-red-900 text-white p-2 rounded  focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline"
            >
              <Link to="/login"> Sign In</Link>
            </button>
          </p>
        </div>
      </div>
    </div>
    </div>

  );
};

export default Register;
