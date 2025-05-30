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
import { ChevronDown } from "lucide-react";
import { useAppContext } from "../context/AppContext";

import LivingRoomImage from "../assets/blue-armchair-against-blue-wall-living-room-interior-elegant-interior-design-with-copy-space-ai-generative_123827-23715.jpg";
import DiningRoomImage from "../assets/armchair-green-living-room-with-copy-space_43614-910.jpg";
import BedroomImage from "../assets/photo-1644057501622-dfa7dd26dbfb.avif";
import KitchenImage from "../assets/photo-1713707131805-f0d7d7432598.avif";
import OfficeImage from "../assets/armchair-green-living-room-with-copy-space_43614-910.jpg";
import logo from "../assets/Cream_and_Brown_Minimalist_Furniture_Logo-removebg-preview (1).png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { cartItemCount, setCartItemCount } = useAppContext();
  const { search, setSearch, favCount, setFavCount } = useAppContext();
  const [userDetail, setUserDetail] = useState([]);
  console.log(favCount);

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
      image: DiningRoomImage,
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
      // icon: <FaKitchenSet className="inline mr-2" />
    },
    {
      name: "study & office",
      subcategories: [],
      image: OfficeImage,
      description: "Productive workspaces for home or office",
      icon: <FaLaptop className="inline mr-2" />,
    },
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimeout = useRef(null);
  const navigate = useNavigate();
  const categoryRefs = useRef([]);
  const navbarRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try{
      const userId = localStorage.getItem("userId");
      const res = await axios.get(
        `http://localhost:8080/api/user/getUser/${userId}`
      );
      setUserDetail(res.data.userAccountDto);
    }catch(error){

    }
    };

    fetchUser();
  },[]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedCategories = await Promise.all(
          categories.map(async (category) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/productType/getByName/${category.name}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              return {
                ...category,
                subcategories: response.data.productTypeDtoList.map(
                  (productType) => productType.productTypeName
                ),
              };
            } catch (error) {
              console.error(`Error fetching data for ${category.name}:`, error);
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

  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/cartItem/get/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCartCount(response.data.cartItemDtoList.length);
        setCartItemCount(response.data.cartItemDtoList.length);

        const res = await axios.get(
          `http://localhost:8080/api/favaurite/get/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavCount(res.data.favauriteDtoList.length);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchCartItems();
  }, [cartItemCount]);

  const handleProductType = (productType) => {
    navigate("/productListMainPage", { state: { productType } });
    setHoveredCategory(null);
  };

  const handleMainPage = (categoryName) => {
    setHoveredCategory(null);
    navigate("/productListMainPage", { state: { categoryName } });
  };

  const handleFavaurite = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in ");
      return;
    }
    navigate("/favaurite");
  };

  const handleUser = () => {
    if (!isAuthenticated) {
      toast.error("Please Sign In");
      return;
    }
    navigate("/user");
  };

  const handleCart = () => {
    if (!isAuthenticated) {
      toast.error("Please Sign In");
      return;
    }
    navigate("/checkout");
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleClick=()=>[
    navigate("/user")
  ]

  return (
    <div className="flex flex-col relative" ref={navbarRef}>
      {/* Top Bar - Hidden when scrolled */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div
        className={`fixed  top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "transform -translate-y-full" : "translate-y-0"
        } ${isHomePage ? "backdrop-blur-sm" : "bg-white"}`}
      >
        <div
          className={`w-full flex justify-between items-center  px-5 md:h-20 h-20 ${
            isHomePage ? "" : ""
          }`}
        >
          <div className="flex items-center gap-1 cursor-pointer">
            <h1 className={`mt-5`}>
              <img src={logo} alt="" className="w-[180px] " />
            </h1>
          </div>

          <button
            className="md:hidden p-2 mt-5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <HiX
                className={`h-6 w-6 ${
                  isHomePage ? "text-white" : "text-gray-800"
                }`}
              />
            ) : (
              <HiMenu
                className={`h-6 w-6 ${
                  isHomePage ? "text-white" : "text-gray-800"
                }`}
              />
            )}
          </button>
          <div className="flex items-center gap-5 ">
          
            {isAuthenticated && (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2  border-yellow-300 shadow-md">
              <img
                src={
                  userDetail.imageData && userDetail 
                    ? `data:${userDetail.imageType};base64,${userDetail.imageData}`
                    :  "https://randomuser.me/api/portraits/men/75.jpg"// Fallback image
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
                className={`hidden md:block border rounded-full ${
                  isHomePage
                    ? "text-white hover:bg-white hover:text-black "
                    : "text-white bg-black hover:bg-gray-100 border-gray-300"
                } px-6 py-2.5 text-sm font-medium transition-all hover:shadow-lg`}
              >
                Sign out
              </button>
            ) : (
              <Link to="/login">
                <button
                  className={`hidden md:block ${isHomePage ? "border border-white  text-white font-semibold rounded-full px-9 py-2.5   text-sm  transition-all hover:shadow-lg":"text-white bg-black px-9 hover:text-red-600 border-gray-300 rounded-full "} px-6 py-2.5 text-sm font-medium transition-all hover:shadow-lg`}
                >
                  Sign in
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Category Bar - Always sticky */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "top-0" : "md:top-20 top-16"
        } ${
          isHomePage && !isScrolled ? "" : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="relative">
          <nav
            className={`p-4 ${
              isHomePage && !isScrolled
                ? ""
                : "bg-white border-b border-gray-200"
            }`}
          >
            <div className="container mx-auto  flex flex-col md:flex-row md:justify-center md:gap-10 items-center">
              <div className="flex space-x-6 pl-20  relative w-full">
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
                        isHomePage && !isScrolled
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                      onClick={() => handleMainPage(category.name)}
                    >
                      <div className="flex items-center">
                        {category.icon}
                        {category.name}
                        <span>
                          <ChevronDown
                            className={`w-[15px] transition-transform ${
                              hoveredCategory === index ? "rotate-180" : ""
                            } ${
                              isHomePage && !isScrolled
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          />
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative w-[400px] md:w-1/3 my-2 md:my-0">
                <input
                  type="text"
                  placeholder="Search for item..."
                  className={`w-full p-3 pl-4 pr-10 border rounded-lg ${
                    isHomePage && !isScrolled
                      ? "border-white bg-white bg-opacity-20 text-white placeholder-white"
                      : "border-gray-300 text-gray-800 placeholder-gray-500"
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
                <div
                  className="relative cursor-pointer"
                  onClick={handleFavaurite}
                >
                  <FaHeart
                    className={`text-xl ${
                      isHomePage && !isScrolled
                        ? "text-white hover:text-green-500"
                        : "text-gray-800 hover:text-green-500"
                    } transition-colors`}
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
                  } transition-colors`}
                  onClick={handleUser}
                />
                <div className="relative cursor-pointer" onClick={handleCart}>
                  <FaShoppingCart
                    className={`text-xl ${
                      isHomePage && !isScrolled
                        ? "text-white hover:text-green-500"
                        : "text-gray-800 hover:text-green-500"
                    } transition-colors`}
                  />
                  <div className="absolute -top-1 -right-2 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-xs text-white">
                    {cartCount}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Mega Dropdown Menu */}
          {hoveredCategory !== null && (
            <div
              className={`absolute top-full left-0 w-full shadow-lg transition-all duration-300 ease-in-out ${
                hoveredCategory !== null
                  ? "opacity-100 visible"
                  : "opacity-0 invisible"
              }`}
              onMouseEnter={() => {
                clearTimeout(closeTimeout.current);
                setHoveredCategory(hoveredCategory);
              }}
              onMouseLeave={() => {
                closeTimeout.current = setTimeout(
                  () => setHoveredCategory(null),
                  300
                );
              }}
            >
              {/* Triangle connector */}
              <div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"
                style={{
                  left: `${
                    (categoryRefs.current[hoveredCategory]?.offsetLeft || 0) +
                    (categoryRefs.current[hoveredCategory]?.offsetWidth || 0) /
                      2
                  }px`,
                }}
              ></div>

              {/* Container with rounded corners */}
              <div className="relative h-[700px] overflow-hidden rounded-b-lg ">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${categories[hoveredCategory].image})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>

                {/* Content */}
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
                      {categories[hoveredCategory].subcategories.map(
                        (sub, i) => (
                          <div
                            key={i}
                            className="group"
                            onClick={() => handleProductType(sub)}
                          >
                            <div className="px-4 py-3 bg-white bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300 cursor-pointer">
                              <h3 className="text-white font-bold uppercase group-hover:text-orange-400 transition-colors duration-300">
                                {sub}
                              </h3>
                              <p className="text-gray-300 text-sm mt-1">
                                Shop the best {sub} collection
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="w-1/3 flex items-center justify-center">
                    <button
                      onClick={() =>
                        handleMainPage(categories[hoveredCategory].name)
                      }
                      className="bg-white text-gray-800 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

      {/* Spacer to prevent content from being hidden under the fixed navbar */}
      <div className={`h-${isScrolled ? "16" : "36"} invisible`}></div>
    </div>
  );
};

export default Navbar;
