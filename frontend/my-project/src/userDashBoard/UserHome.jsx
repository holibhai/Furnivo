import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  ShoppingBag,
  Star,
  Truck,
  CheckCircle,
  DollarSign,
  Calendar,
  Package,
  Edit,
  Eye,
  Camera,
  X,
  EyeOff,
} from "lucide-react";

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [showProfileModal, setShowProfileModal] = useState(false); 

  const [previewImage, setPreviewImage] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  console.log("saddiiddi")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const userResponse = await axios.get(
          `http://localhost:8080/api/user/getUser/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Initialize profileData with fetched user details
        setProfileData({
          firstName: userResponse.data.userAccountDto?.firstName || "",
          lastName: userResponse.data.userAccountDto?.lastName || "",
          username: userResponse.data.userAccountDto?.username || "", 
          username: "",
          image: null, 
        });
        if (userResponse.data.userAccountDto?.imageUrl) {
          setPreviewImage(userResponse.data.userAccountDto.imageUrl);
        }

        const ordersResponse = await axios.get(
          `http://localhost:8080/api/order/getAllOrders/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(ordersResponse.data.orderDtoList || []);

        const reviewsResponse = await axios.get(
          `http://localhost:8080/api/review/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(reviewsResponse.data || []);

        setLoading(false); 
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false); 
      }
    };

    fetchData();
  }, []); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileData({ ...profileData, image: file }); 
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result); 
    if (file) reader.readAsDataURL(file); 
  };

  const removeImage = () => {
    setPreviewImage(""); 
    setProfileData({ ...profileData, image: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(profileData)], { type: "application/json" })
    );
    
    if (profileData.image) {
      formData.append("imageFile", profileData.image);
    }

    try {
      setIsUploading(true); 
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:8080/api/user/updateUser/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile updated successfully", response.data);

      const userResponse = await axios.get(
        `http://localhost:8080/api/user/getUser/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(userResponse.data.userAccountDto);
      setProfileData({
        firstName: userResponse.data.userAccountDto?.firstName || "",
        lastName: userResponse.data.userAccountDto?.lastName || "",
        username: userResponse.data.userAccountDto?.username || "",
        username: "",
        image: null, 
      });
      if (userResponse.data.userAccountDto?.imageUrl) {
        setPreviewImage(userResponse.data.userAccountDto.imageUrl);
      } else {
        setPreviewImage(""); 
      }

      setShowProfileModal(false);
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg
            key={i}
            className="text-amber-400 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className="text-amber-400 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            <defs>
              <linearGradient id="half-star-gradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width="50%"
              height="100%"
              fill="url(#half-star-gradient)"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="text-amber-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"
            />
          </svg>
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">
      Welcome Back, <span className="text-red-600">{user?.firstName}</span>!
    </h1>
    <p className="mt-2 text-lg text-gray-600">
      Here's what's happening with your account
    </p>
  </div>

  <div className="flex flex-col items-center">
    <p className="text-sm font-medium text-gray-500 mb-1">Profile</p>
    <div className="w-20 h-20 rounded-full overflow-hidden border-2  border-yellow-300 shadow-md">
     {user ? (
  <img
    src={`data:${user.imageType};base64,${user.imageData}`}
    alt="User Profile"
    className="w-full h-full object-cover"
  />
) : (
  <img
    src="https://randomuser.me/api/portraits/men/75.jpg"
    alt="Default User"
    className="w-full h-full object-cover"
  />
)}

    </div>
  </div>
</div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
              <Star size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reviews Given</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reviews.length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 mr-4">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Account Status
              </p>
              <p className="text-2xl font-semibold text-gray-900">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                  activeTab === "orders"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } transition-colors duration-200`}
              >
                <ShoppingBag className="mr-2" />
                My Orders
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                  activeTab === "reviews"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } transition-colors duration-200`}
              >
                <Star className="mr-2" />
                My Reviews
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                  activeTab === "profile"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } transition-colors duration-200`}
              >
                <User className="mr-2" />
                Profile Info
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <ShoppingBag className="mr-2 text-indigo-600" />
                  Recent Orders
                </h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No orders yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by placing your first order.
                    </p>
                    <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Shop Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200">
                          <div className="flex items-center mb-2 sm:mb-0">
                            <Calendar className="text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">
                              Ordered on{" "}
                              {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="flex items-center">
                              <DollarSign className="text-gray-500 mr-1" />
                              <span className="text-sm font-medium text-gray-700">
                                Total: Rs.{order.netTotal.toFixed(2)}
                              </span>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                              <span className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm font-medium mr-3">
                                #{order.orderId}
                              </span>
                              {order.orderItems.length}{" "}
                              {order.orderItems.length === 1 ? "Item" : "Items"}
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                <User className="mr-2" />
                                Billing Information
                              </h4>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-800">
                                  {order.billing.firstName}{" "}
                                  {order.billing.lastName}
                                </p>
                                <p className="text-sm text-gray-800">
                                  {order.billing.username}
                                </p>
                                <p className="text-sm text-gray-800">
                                  {order.billing.mobileNumber}
                                </p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                {order.billing.delivery.deliveryType ===
                                "PickUp" ? (
                                  <Truck className="mr-2" />
                                ) : (
                                  <Package className="mr-2" />
                                )}
                                {order.billing.delivery.deliveryType ===
                                "PickUp"
                                  ? "Pickup Information"
                                  : "Delivery Information"}
                              </h4>
                              <div className="space-y-1">
                                {order.billing.delivery.deliveryType ===
                                "PickUp" ? (
                                  <>
                                    <p className="text-sm text-gray-800">
                                      Location:{" "}
                                      {order.billing.delivery.location}
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      Pickup Date:{" "}
                                      {order.billing.delivery.deliveryDate}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm text-gray-800">
                                      {order.billing.delivery.streetAddress1},{" "}
                                      {order.billing.delivery.city}
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      Delivery Date:{" "}
                                      {order.billing.delivery.deliveryDate}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                              <ShoppingBag className="mr-2" />
                              Order Items
                            </h4>
                            <div className="space-y-3">
                              {order.orderItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-center border-b border-gray-100 pb-3"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">
                                      Product ID: {item.productId}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Quantity: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium text-gray-800">
                                    Rs.{item.subTotal.toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Star className="mr-2 text-amber-500" />
                  Your Reviews
                </h2>
                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Star className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No reviews yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Share your thoughts on products you've purchased.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">
                              Product #{review.productId}
                            </h3>
                            <div className="flex items-center mt-2">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(
                                  review.createdDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 ${
                              review.status === "post"
                                ? "bg-emerald-100 text-emerald-800"
                                : review.status === "not post"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {review.status === "post"
                              ? "Published"
                              : review.status === "not post"
                              ? "Pending Approval"
                              : "Pending"}
                          </span>
                        </div>
                        {review.comment && (
                          <div className="bg-gray-50 p-3 rounded-lg mt-3">
                            <p className="text-sm text-gray-700 italic">
                              "{review.comment}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && user && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="mr-2 text-indigo-600" />
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <User className="mr-2 text-indigo-600" />
                      Personal Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          First Name
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.firstName}
                        </p>
                      </div>
                     
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Last Name
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Username
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {user.username}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Account Type
                        </p>
                        <p className="mt-1 text-sm text-gray-900 capitalize">
                          {user.role.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="mr-2 text-emerald-600" />
                      Account Security
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Username
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          •••••••••••
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Last Login
                        </p>
                        <p className="mt-1 text-sm text-gray-900">Recently</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Account Status
                        </p>
                        <p className="mt-1 text-sm font-medium text-emerald-600 flex items-center">
                          <CheckCircle className="mr-1" /> Active
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-3">
                      <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center"
                        onClick={handleProfileClick} // Use the new handler
                      >
                        <Edit className="mr-2" /> Update Profile
                      </button>
                      <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Change Username
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Update Profile
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={
                        previewImage ||
                        "https://placehold.co/128x128/E0E0E0/333333?text=Profile"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/128x128/E0E0E0/333333?text=Profile";
                      }}
                    />
                  </div>
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {previewImage && (
                    <button
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Click the camera icon to change your profile picture
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username Address
                  </label>
                  <input
                    type="username"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={profileData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-10"
                      placeholder="Leave blank to keep current password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank to keep current password
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;
