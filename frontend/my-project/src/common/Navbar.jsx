import React, { useEffect, useState, useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaChair,
  FaUtensils,
  FaBed,
  FaLaptop,
} from "react-icons/fa";
import axios from "axios";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";

import LivingRoomImage from "../assets/blue-armchair-against-blue-wall-living-room-interior-elegant-interior-design-with-copy-space-ai-generative_123827-23715.jpg";
import DiningRoomImage from "../assets/armchair-green-living-room-with-copy-space_43614-910.jpg";
import BedroomImage from "../assets/photo-1644057501622-dfa7dd26dbfb.avif";
import KitchenImage from "../assets/photo-1713707131805-f0d7d7432598.avif";
import OfficeImage from "../assets/armchair-green-living-room-with-copy-space_43614-910.jpg";
import logo from "../assets/Cream_and_Brown_Minimalist_Furniture_Logo-removebg-preview (1).png";
import dine from "../assets/photo-1610809026329-2b7b713a986c.avif";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { cartItemCount, setCartItemCount } = useAppContext();
  const { search, setSearch, favCount, setFavCount } = useAppContext();
  const [userDetail, setUserDetail] = useState([]);
  const [openBar, setOpenBar] = useState(false);
  const [mobileOpenCategory, setMobileOpenCategory] = useState(null);

  const [categories, setCategories] = useState([
    {
      name: "living",
      subcategories: [],
      image: LivingRoomImage,
      description: "Modern living room furniture for your comfort",
      icon: <FaChair className="inline mr-2" />,
    },
    {
      name: "dining",
      subcategories: [],
      image: dine,
      description: "Elegant dining sets for memorable meals",
      icon: <FaUtensils className="inline mr-2" />,
    },
    {
      name: "bedroom",
      subcategories: [],
      image: BedroomImage,
      description: "Luxurious bedroom collections for peaceful nights",
      icon: <FaBed className="inline mr-2" />,
    },
    {
      name: "kitchen",
      subcategories: [],
      image: KitchenImage,
      description: "Functional and stylish kitchen solutions",
    },
    {
      name: "study & office",
      subcategories: [],
      image: OfficeImage,
      description: "Productive workspaces for home or office",
      icon: <FaLaptop className="inline mr-2" />,
    },
  ]);

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimeout = useRef(null);
  const navigate = useNavigate();
  const categoryRefs = useRef([]);
  const navbarRef = useRef(null);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(
          `http://localhost:8080/api/user/getUser/${userId}`
        );
        setUserDetail(res.data.userAccountDto);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (isAuthenticated) fetchUser();
  }, [isAuthenticated]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedCategories = await Promise.all(
          categories.map(async (category) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/productType/getByName/${category.name}`
              );
              return {
                ...category,
                subcategories: response.data.productTypeDtoList.map(
                  (productType) => productType.productTypeName
                ),
              };
            } catch (error) {
              console.error(`Error fetching ${category.name}:`, error);
              return category;
            }
          })
        );
        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch cart and favorite counts
  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      
      try {
        // Fetch cart items
        const cartResponse = await axios.get(
          `http://localhost:8080/api/cartItem/get/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCartCount(cartResponse.data.cartItemDtoList.length);
        setCartItemCount(cartResponse.data.cartItemDtoList.length);

        // Fetch favorites
        const favResponse = await axios.get(
          `http://localhost:8080/api/favaurite/get/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavCount(favResponse.data.favauriteDtoList.length);
      } catch (err) {
        console.error("Error fetching cart/favorites:", err);
      }
    };

    if (isAuthenticated) fetchCartItems();
  }, [cartItemCount, isAuthenticated]);

  const handleProductType = (productType) => {
    navigate("/productListMainPage", { state: { productType } });
    setHoveredCategory(null);
    setOpenBar(false);
    setMobileOpenCategory(null);
  };

  const handleMainPage = (categoryName) => {
    navigate("/productListMainPage", { state: { categoryName } });
    setHoveredCategory(null);
    setOpenBar(false);
    setMobileOpenCategory(null);
  };

  const handleFavaurite = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to view favorites");
      return;
    }
    navigate("/favaurite");
    setOpenBar(false);
  };

  const handleUser = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to access your account");
      return;
    }
    navigate("/user");
    setOpenBar(false);
  };

  const handleCart = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to view your cart");
      return;
    }
    navigate("/checkout");
    setOpenBar(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/");
    setOpenBar(false);
  };

  const toggleMobileCategory = (index) => {
    setMobileOpenCategory(mobileOpenCategory === index ? null : index);
  };

  return (
    <div className="flex flex-col relative" ref={navbarRef}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "transform -translate-y-full" : "translate-y-0"
        } ${isHomePage ? "backdrop-blur-sm" : "bg-white"}`}
      >
        <div className={`w-full flex justify-between items-center px-5 h-20`}>
          <div className="flex items-center gap-1 cursor-pointer">
            <img src={logo} alt="Furniture Logo" className="w-[180px]" />
          </div>

          <button
            className="md:hidden p-2 ml-auto"
            onClick={() => setOpenBar(!openBar)}
            aria-label="Toggle menu"
          >
            {openBar ? (
              <HiX className={`h-6 w-6 ${isHomePage ? "text-white" : "text-gray-800"}`} />
            ) : (
              <HiMenu className={`h-6 w-6 ${isHomePage ? "text-white" : "text-gray-800"}`} />
            )}
          </button>

          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated && (
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-300 shadow-md">
                <img
                  src={
                    userDetail.imageData
                      ? `data:${userDetail.imageType};base64,${userDetail.imageData}`
                      : "https://randomuser.me/api/portraits/men/75.jpg"
                  }
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className={`border rounded-full ${
                  isHomePage
                    ? "text-white hover:bg-white hover:text-black"
                    : "text-white bg-black hover:bg-gray-100"
                } px-6 py-2.5 text-sm font-medium transition-all hover:shadow-lg`}
              >
                Sign out
              </button>
            ) : (
              <Link to="/login">
                <button
                  className={`${
                    isHomePage
                      ? "border border-white text-white hover:bg-white hover:text-black"
                      : "bg-black text-white hover:bg-gray-800"
                  } rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:shadow-lg`}
                >
                  Sign in
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Category Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 hidden md:block ${
          isScrolled ? "top-0" : "top-20"
        } ${isHomePage && !isScrolled ? "" : "bg-white border-b border-gray-200"}`}
      >
        <div className="relative">
          <nav className={`p-4 ${isHomePage && !isScrolled ? "" : "bg-white"}`}>
            <div className="container mx-auto flex flex-col md:flex-row md:justify-center md:gap-10 items-center">
              <div className="flex space-x-6 pl-20 relative w-full">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="relative group"
                    ref={(el) => (categoryRefs.current[index] = el)}
                    onMouseEnter={() => {
                      clearTimeout(closeTimeout.current);
                      setHoveredCategory(index);
                    }}
                    onMouseLeave={() => {
                      closeTimeout.current = setTimeout(
                        () => setHoveredCategory(null),
                        100
                      );
                    }}
                  >
                    <button
                      className={`px-4 py-2 uppercase text-sm font-medium rounded-lg hover:text-orange-400 transition-colors ${
                        isHomePage && !isScrolled ? "text-white" : "text-gray-800"
                      }`}
                      onClick={() => handleMainPage(category.name)}
                    >
                      <div className="flex items-center">
                        {category.icon}
                        {category.name}
                        <ChevronDown
                          className={`w-[15px] transition-transform ${
                            hoveredCategory === index ? "rotate-180" : ""
                          } ${isHomePage && !isScrolled ? "text-white" : "text-gray-800"}`}
                        />
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative w-[400px] md:w-1/3 my-2 md:my-0">
                <input
                  type="text"
                  placeholder="Search for items..."
                  className={`w-full p-3 pl-4 pr-10 border rounded-lg ${
                    isHomePage && !isScrolled
                      ? "border-white bg-white bg-opacity-20 text-white placeholder-white"
                      : "border-gray-300 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-orange-400`}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                    isHomePage && !isScrolled ? "text-white" : "text-gray-800"
                  }`}
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="relative cursor-pointer" onClick={handleFavaurite}>
                  <FaHeart
                    className={`text-xl ${
                      isHomePage && !isScrolled
                        ? "text-white hover:text-green-500"
                        : "text-gray-800 hover:text-green-500"
                    }`}
                  />
                  <div className="absolute -top-1 -right-2 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-xs text-white">
                    {favCount || 0}
                  </div>
                </div>
                <FaUser
                  className={`text-xl cursor-pointer ${
                    isHomePage && !isScrolled
                      ? "text-white hover:text-blue-500"
                      : "text-gray-800 hover:text-blue-500"
                  }`}
                  onClick={handleUser}
                />
                <div className="relative cursor-pointer" onClick={handleCart}>
                  <FaShoppingCart
                    className={`text-xl ${
                      isHomePage && !isScrolled
                        ? "text-white hover:text-green-500"
                        : "text-gray-800 hover:text-green-500"
                    }`}
                  />
                  <div className="absolute -top-1 -right-2 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-xs text-white">
                    {cartCount}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Mega Dropdown */}
          {hoveredCategory !== null && (
            <div
              className={`absolute top-full left-0 w-full shadow-lg transition-all duration-300 ${
                hoveredCategory !== null ? "opacity-100" : "opacity-0"
              }`}
              onMouseEnter={() => clearTimeout(closeTimeout.current)}
              onMouseLeave={() => {
                closeTimeout.current = setTimeout(
                  () => setHoveredCategory(null),
                  300
                );
              }}
            >
              <div className="relative h-[700px] overflow-hidden rounded-b-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${categories[hoveredCategory].image})`,
                  }}
                ></div>

                <div className="container mx-auto relative z-10 h-full flex">
                  <div className="w-2/3 py-12 px-8">
                    <h2 className="text-3xl font-bold text-white mb-2 capitalize">
                      {categories[hoveredCategory].icon}
                      {categories[hoveredCategory].name}
                    </h2>
                    <p className="text-white text-lg mb-8 max-w-lg">
                      {categories[hoveredCategory].description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {categories[hoveredCategory].subcategories.map((sub, i) => (
                        <div
                          key={i}
                          className="group"
                          onClick={() => handleProductType(sub)}
                        >
                          <div className="px-4 py-3 bg-white bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all cursor-pointer">
                            <h3 className="text-white font-bold uppercase group-hover:text-orange-400">
                              {sub}
                            </h3>
                            <p className="text-gray-300 text-sm mt-1">
                              Shop the best {sub} collection
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/3 flex items-center justify-center">
                    <button
                      onClick={() => handleMainPage(categories[hoveredCategory].name)}
                      className="bg-white text-gray-800 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      View All {categories[hoveredCategory].name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 bg-white text-gray-800 transition-transform duration-300 z-50 shadow-lg overflow-y-auto ${
          openBar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <img src={logo} alt="Logo" className="w-[150px]" />
            <button onClick={() => setOpenBar(false)} aria-label="Close menu">
              <HiX className="h-6 w-6 text-gray-800" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Mobile User Actions */}
          <div className="flex justify-around mb-6 border-b pb-4">
            <div className="flex flex-col items-center">
              <div className="relative cursor-pointer" onClick={handleFavaurite}>
                <FaHeart className="text-xl text-gray-800" />
                <div className="absolute -top-1 -right-2 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-xs text-white">
                  {favCount || 0}
                </div>
              </div>
              <span className="text-xs mt-1">Wishlist</span>
            </div>
            <div className="flex flex-col items-center">
              <FaUser
                className="text-xl cursor-pointer text-gray-800"
                onClick={handleUser}
              />
              <span className="text-xs mt-1">Account</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative cursor-pointer" onClick={handleCart}>
                <FaShoppingCart className="text-xl text-gray-800" />
                <div className="absolute -top-1 -right-2 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-xs text-white">
                  {cartCount}
                </div>
              </div>
              <span className="text-xs mt-1">Cart</span>
            </div>
          </div>

          {/* Mobile Categories */}
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Categories</h3>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="border-b border-gray-100">
                  <button
                    className="w-full flex justify-between items-center py-3 px-2 hover:bg-gray-50 rounded"
                    onClick={() => toggleMobileCategory(index)}
                  >
                    <div className="flex items-center">
                      {category.icon}
                      <span className="ml-2 capitalize">{category.name}</span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        mobileOpenCategory === index ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Mobile Subcategories */}
                  {mobileOpenCategory === index && (
                    <div className="pl-6 py-2 space-y-2">
                      <button
                        className="w-full text-left py-2 px-2 hover:bg-gray-50 rounded font-medium"
                        onClick={() => handleMainPage(category.name)}
                      >
                        View All {category.name}
                      </button>
                      {category.subcategories.map((sub, i) => (
                        <button
                          key={i}
                          className="w-full text-left py-2 px-2 hover:bg-gray-50 rounded capitalize"
                          onClick={() => handleProductType(sub)}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Auth Button */}
          <div className="mt-6">
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="w-full bg-black text-white py-2.5 rounded-md font-medium"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/login">
                <button className="w-full bg-black text-white py-2.5 rounded-md font-medium">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {openBar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpenBar(false)}
        ></div>
      )}

      {/* Spacer */}
      <div className={`h-${isScrolled ? "16" : "36"} invisible`}></div>
    </div>
  );
};

export default Navbar;