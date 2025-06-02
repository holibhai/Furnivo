import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 12;

const RatingStars = ({ rating, reviewCount }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center mt-1 ">
      
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative w-4 h-4">
            <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
            <Star className="absolute top-0 left-0 w-4 h-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 fill-gray-300 text-gray-300" />
        ))}
      </div>
      {reviewCount > 0 && (
        <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
      )}
    </div>
  );
};

const ProductBadges = ({ product }) => {
  return (
    <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
      {product.discount > 0 && (
        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          {product.discount}% OFF
        </span>
      )}
      {product.isNew && (
        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
          NEW
        </span>
      )}
      {product.isBestSeller && (
        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
          BESTSELLER
        </span>
      )}
    </div>
  );
};

const QuickActions = ({ product, onFavorite, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    onFavorite(product.id);
  };

  return (
    <div className="absolute top-2 right-2 flex flex-col space-y-2 z-10">
      <button 
        className={`bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all ${isFavorite ? 'text-red-500' : 'text-gray-700'}`}
        onClick={handleFavoriteClick}
      >
        <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
      <button 
        className="bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all text-gray-700"
        onClick={() => onAddToCart(product.id)}
      >
        <ShoppingCart className="w-4 h-4" />
      </button>
    </div>
  );
};

const GridProduct = ({ categoryName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const productType = location.state?.productType;

  const { search, offer ,favCount,setFavCount,cartItemCount,setCartItemCount} = useAppContext();
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { maxValue, setMaxValue } = useAppContext();
  const [sortOption, setSortOption] = useState("featured");

  console.log(maxValue);

  // Filter products whenever search term, product data, or filters change
  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...productData];

      // Apply search filter
      if (search) {
        const lowerCaseSearch = search.toLowerCase();
        filtered = filtered.filter(product => 
          product.productName.toLowerCase().includes(lowerCaseSearch) ||
          (product.categoryName && product.categoryName.toLowerCase().includes(lowerCaseSearch)) ||
          (product.description && product.description.toLowerCase().includes(lowerCaseSearch))
        );
      }

      // Apply price filter
      if (maxValue) {
        const price = parseFloat(maxValue);
        filtered = filtered.filter(product => parseFloat(product.productPrice) <= price);
      }

      // Apply discount offer filter
      if (offer) {
        const offerNum = parseFloat(offer);
        filtered = filtered.filter(product => {
          const discount = parseFloat(product.discount);
          return (
            (offerNum === 10 && discount < 10) ||
            (offerNum === 20 && discount >= 10 && discount < 20) ||
            (offerNum === 30 && discount >= 20 && discount < 30) ||
            (offerNum === 50 && discount >= 30 && discount < 50) ||
            (offerNum === 90 && discount >= 50)
          );
        });
      }

      // Apply sorting
      switch(sortOption) {
        case "price-low":
          filtered.sort((a, b) => a.productPrice - b.productPrice);
          break;
        case "price-high":
          filtered.sort((a, b) => b.productPrice - a.productPrice);
          break;
        case "rating":
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default: // "featured"
          filtered.sort((a, b) => {
            // Featured sorting logic - you can customize this
            if (a.isBestSeller && !b.isBestSeller) return -1;
            if (!a.isBestSeller && b.isBestSeller) return 1;
            if (a.isNew && !b.isNew) return -1;
            if (!a.isNew && b.isNew) return 1;
            return (b.rating || 0) - (a.rating || 0);
          });
      }

      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    };

    filterProducts();
  }, [search, productData, offer, maxValue, sortOption]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let allProducts = [];
        let endpoint = "http://localhost:8080/api/product/findAllProducts";

        if (categoryName) {
          endpoint = `http://localhost:8080/api/product/findProductsByCat/${categoryName}`;
        } else if (productType) {
          endpoint = `http://localhost:8080/api/product/findProductsByProductType/${productType}`;
        }

        const response = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Add mock ratings and other UI properties for demonstration
        allProducts = (response.data.productDtoList || []).map(product => ({
          ...product,
          rating: Math.min(5, (Math.random() * 4 + 1).toFixed(1)), // Random rating between 1-5
          reviewCount: Math.floor(Math.random() * 100), // Random review count
          isNew: Math.random() > 0.7, // 30% chance of being new
          isBestSeller: Math.random() > 0.8, // 20% chance of being bestseller
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString() // Random date in last 30 days
        }));
        
        setProductData(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, productType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPaginationNumbers = () => {
    const range = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (currentPage <= 3) {
        range.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        range.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        range.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return range;
  };

  const handleCart = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `http://localhost:8080/api/cartItem/add?productId=${id}&quantity=1&userId=${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItemCount(cartItemCount=>cartItemCount+1);
      toast.success("Added to Cart")
      navigate("/checkout");
      // alert(response.data.message);
    } catch (err) {
      const token=localStorage.getItem('token')

      if(!token){
         toast.error("Please Sign in ")
      }else{
      console.error("Error:", err);
      alert("Failed to add to cart");
      }
    }
  };
  
  const handleFavorite = async (productId) => {
    const userId = localStorage.getItem("userId");          
    try {
      const response = await axios.post(
        `http://localhost:8080/api/favaurite/add/${userId}`,
        { productId },                                         
        {
          headers: {    
            "Content-Type": "application/json",  
            Authorization: `Bearer ${localStorage.getItem("token")}`,    
          },
        }
      );       
      if(response.data.statusCode===200){
         toast.warning("Already In Favurite List")
      }                                                
      
      if (response.data.statusCode === 201) {
        // Feedback is handled in the QuickActions component
        setFavCount(favCount=>favCount+1); 
        toast.success("Added to Favaurite")

      }       
    } catch (err) {
      const token=localStorage.getItem('token');
      if(!token){
         toast.error('Please log in');
      }
      console.error(err);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
          <div key={index} className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
            <Skeleton height={200} />
            <div className="p-4">
              <Skeleton count={2} />
              <Skeleton width={100} />
              <div className="flex justify-between mt-3">
                <Skeleton width={80} />
                <Skeleton circle width={32} height={32} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
            <ToastContainer position="top-right" autoClose={3000} />
             <div className="container mx-auto  py-3 text-sm text-gray-600">
                          <Link to="/" className="hover:text-blue-600">Home</Link>
                          <span className="mx-2">/</span>
                          <Link to="/products" className="hover:text-blue-600">Products</Link>
                           
                          <span className="text-gray-800 font-medium">{"checkout"}</span>
                        </div>
      
      {/* Filters and Sorting Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="text-sm text-gray-500">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {search ? "No products match your search" : "No products available"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {search ? "Try adjusting your search or filter to find what you're looking for." : "Check back later for new arrivals."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {paginatedProducts.map((product) => {
              const discountedPrice = (
                product.productPrice -
                (product.productPrice * product.discount) / 100
              ).toFixed(2);

              return (
                <div
                  key={product.id}
                  className="group w-full h-full border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <ProductBadges product={product} />
                  <QuickActions 
                    product={product} 
                    onFavorite={handleFavorite} 
                    onAddToCart={handleCart} 
                  />

                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden bg-gray-100 aspect-square">
                      <img
                        src={`data:${product.imageType};base64,${product.imageData}`}
                        alt={product.productName}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          hoveredProduct === product.id ? "opacity-90 scale-105" : "opacity-100"
                        }`}
                        loading="lazy"
                      />
                      {hoveredProduct === product.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 transition-opacity duration-300">
                          <div className="bg-white p-2 rounded-full opacity-100 transform scale-110 transition-transform duration-300 shadow-md">
                            <Plus className="w-5 h-5 text-gray-800" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2 mb-1" style={{ minHeight: '40px' }}>
                        {product.productName}
                      </h3>
                    </Link>
                    
                    <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                    
                    <div className="flex gap-3 items-baseline mt-2">
                      {product.discount > 0 && (
                        <p className="text-gray-400 line-through text-sm">
                          ${product.productPrice.toFixed(2)}
                        </p>
                      )}
                      <p className={`text-lg font-semibold ${
                        product.discount > 0 ? "text-red-600" : "text-gray-900"
                      }`}>
                        $
                        {product.discount > 0
                          ? discountedPrice
                          : product.productPrice.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                      <button 
                        className="text-sm font-medium px-3 py-1 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                        onClick={() => handleCart(product.id)}
                      >
                        <ShoppingCart className="inline w-[15px]"/>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <span className="px-2">Previous</span>
                </button>

                <div className="flex items-center space-x-1 mx-2">
                  {getPaginationNumbers().map((num, index) => (
                    <button
                      key={index}
                      onClick={() => typeof num === "number" && setCurrentPage(num)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === num
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      } ${num === "..." ? "cursor-default" : ""}`}
                      disabled={num === "..."}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <span className="px-2">Next</span>
                </button>
                
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GridProduct;