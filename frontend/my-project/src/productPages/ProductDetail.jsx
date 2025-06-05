import React, { useEffect, useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ad from "../assets/Black Brown Modern Big Sale Furniture Email Header.png"

// Sample user avatars
const userAvatars = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/90.jpg",
];

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const { cartItemCount, setCartItemCount } = useAppContext();
  const [sliderKey, setSliderKey] = useState(0); // Key to force slider re-render

  // Custom arrow components with proper styling
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all duration-300 focus:outline-none"
      aria-label="Next"
    >
      <ChevronRight className="text-gray-700 w-5 h-5" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all duration-300 focus:outline-none"
      aria-label="Previous"
    >
      <ChevronLeft className="text-gray-700 w-5 h-5" />
    </button>
  );

  // Slider settings for reviews
  const reviewSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Slider settings for related products
  const productSliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    adaptiveHeight: true,
    swipeToSlide: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );
        setProduct(response.data);

        if (response.data.category) {
          const res = await axios.get(
            `http://localhost:8080/api/product/findProductsByCat/${response.data.category}`,
            {
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const filteredRelated = res.data.productDtoList.filter(
            (p) => p.id !== response.data.id
          );
          setRelatedProducts(filteredRelated);
          // Force slider re-render when related products load
          setSliderKey(prev => prev + 1); 
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const response = await axios.get(
          `http://localhost:8080/api/review/product/${id}`
        );
        const postedReviews = response.data.filter(
          review => review.status === 'post' || review.status === null
        );
        setReviews(postedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [id]);

  const updateCart = async () => {
    // const toastId = toast.loading("Adding to cart...");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product/checkQuantity/${id}/${quantity}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItemCount(cartItemCount => cartItemCount + 1);

      if (response.data.statusCode === 200) {
        toast.success("Added to cart")
        navigate("/checkout");
      }
     
    } catch (err) {
      const token=localStorage.getItem('token');
      if(!token){
         toast.error('Please Sign In ')
      }else{
      console.error("Error:", err);
     
      toast.error('Failed to update cart.please try again')
    }
  }

    try {
      const userId = localStorage.getItem("userId");
      await axios.post(
        `http://localhost:8080/api/cartItem/add?productId=${id}&quantity=${quantity}&userId=${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Added to cart");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const addToCart = async (productId) => {
    const toastId = toast.loading("Adding to cart...");
    const token=localStorage.getItem('token')
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `http://localhost:8080/api/cartItem/add?productId=${productId}&quantity=1&userId=${userId}`,
        {},   
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.update(toastId, {
        render: "Added to cart!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Error:", err);
      toast.update(toastId, {
        render: "Failed to add to cart",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 stroke-yellow-500' : 'stroke-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate average rating and rating distribution
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
 ) : 0;

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    ratingDistribution[review.rating - 1]++;
  });

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the return policy for this product?",
      answer: "We offer a 30-day return policy for unused products in their original packaging. Custom-made items may not be eligible for returns."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days. Express delivery options are available at checkout for an additional fee."
    },
    {
      question: "Is assembly required for this product?",
      answer: "Some assembly may be required. Detailed instructions and all necessary tools are included with your purchase."
    },
    {
      question: "What materials is this product made from?",
      answer: "This product is crafted from high-quality solid wood with a durable finish. The exact materials are listed in the product specifications."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship internationally. Shipping costs and delivery times vary by destination and will be calculated at checkout."
    }
  ];

  return (
    <div className="md:mt-52 mt-28">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-3 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.productName || "Product"}</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <div className="md:sticky top-24 self-start">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 md:h-[700px]">
              <img
                src={`data:${product.imageType};base64,${product.imageData}`}
                alt={product.productName}
                className="md:w-full md:h-auto object-cover transition-opacity duration-300 h-[300px] w-full"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x600?text=Product+Image";
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.productName}
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-yellow-400 stroke-yellow-500' : 'fill-gray-200 stroke-gray-300'}`}
                  />
                ))}
                <span className="text-gray-700 ml-2">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
              <span className="text-gray-500 text-sm">
                SKU: {product.id || 'N/A'}
              </span>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center flex-wrap gap-4">
                {product.discount > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      Rs.{(product.productPrice - (product.productPrice * product.discount) / 100).toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      Rs.{product.productPrice}
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                      Save {product.discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    Rs.{product.productPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-700 mr-2">Availability:</span>
                {product.productQuantity > 0 ? (
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    In Stock ({product.productQuantity} available)
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
              <p className="text-gray-600 text-sm">
                {product.productQuantity > 5 ? 
                  "Usually ships within 24 hours" : 
                  "Limited stock available"
                }
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">Quantity:</label>
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-l-lg transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-16 text-center border-t border-b border-gray-300 py-2 text-gray-700 focus:outline-none"
                />
                <button
                  onClick={increaseQuantity}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-r-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={updateCart}
                className="flex-1 bg-red-600 hover:bg-red-800 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Add to Wishlist
              </button>
            </div>

            {/* Product Highlights */}
            <div className="border-t border-b border-gray-200 py-6 mb-8">
              <h3 className="font-medium text-gray-900 mb-4">Product Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Premium quality materials</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">1-year manufacturer warranty</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Free shipping on all orders</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Easy 30-day returns</span>
                </li>
              </ul>
            </div>

            {/* Product Specifications */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category</span>
                    <span className="text-gray-900 font-medium">{product.category || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Product Type</span>
                    <span className="text-gray-900 font-medium">{product.productType || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Dimensions</span>
                    <span className="text-gray-900 font-medium">
                      {product.width && product.height && product.depth ? 
                        `${product.width} x ${product.height} x ${product.depth}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Weight</span>
                    <span className="text-gray-900 font-medium">{product.weight || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-3">Share this product</h3>
              <div className="flex gap-2">
                {['Facebook', 'Twitter', 'Pinterest', 'Email'].map((social) => (
                  <button 
                    key={social}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="my-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
          <div className="prose max-w-none text-gray-600">
            {product.description || "No detailed description available for this product."}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-gray-600">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3 mb-6">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center">
                    <div className="w-10 text-sm font-medium text-gray-700">
                      {stars} Star
                    </div>
                    <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-yellow-400 rounded-full" 
                        style={{
                          width: `${(ratingDistribution[stars-1] / reviews.length) * 100 || 0}%`
                        }}
                      ></div>
                    </div>
                    <div className="w-8 text-right text-sm text-gray-600">
                      {ratingDistribution[stars-1]}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                onClick={() => toast.info("Review feature coming soon!")}
              >
                Write a Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              {isLoadingReviews ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="relative">
                  <Slider key={`review-slider-${sliderKey}`} {...reviewSliderSettings}>
                    {reviews.map((review, index) => (
                      <div key={review.id} className="px-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 h-full">
                          <div className="flex items-start mb-4">
                            <img 
                              src={userAvatars[index % userAvatars.length]} 
                              alt="User" 
                              className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">User #{review.userId}</h4>
                              <div className="flex items-center mt-1">
                                {renderStars(review.rating)}
                                <span className="text-gray-500 text-sm ml-3">
                                  {formatDate(review.createdDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4">
                            {review.comment || 'No comment provided'}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <button className="flex items-center mr-4 hover:text-blue-600">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Helpful ({Math.floor(Math.random() * 10)})
                            </button>
                            <button className="flex items-center hover:text-blue-600">
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              Not Helpful ({Math.floor(Math.random() * 5)})
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-6">Be the first to review this product!</p>
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors inline-flex items-center"
                    onClick={() => toast.info("Review feature coming soon!")}
                  >
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="my-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
              <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium">
                View All Products
              </Link>
            </div>
            
            <div className="relative">
              <Slider key={`product-slider-${sliderKey}`} {...productSliderSettings}>
                {relatedProducts.map((product) => (
                  <div key={product.id} className="px-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100">
                      <Link to={`/product/${product.id}`} className="block relative pt-[100%]">
                        <img
                          src={`data:${product.imageType};base64,${product.imageData}`}
                          alt={product.productName}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/600x600?text=Product+Image";
                          }}
                        />
                        {product.discount > 0 && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {product.discount}% OFF
                          </span>
                        )}
                      </Link>

                      <div className="p-4 flex-grow">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 line-clamp-2">
                            {product.productName}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between mb-3">
                          <div>
                            {product.discount > 0 ? (
                              <>
                                <span className="text-gray-900 font-bold">
                                  Rs.{(product.productPrice - (product.productPrice * product.discount) / 100).toFixed(2)}
                                </span>
                                <span className="text-gray-400 line-through text-sm ml-2">
                                  Rs.{product.productPrice}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-900 font-bold">
                                Rs.{product.productPrice}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center">
                            <Star className="fill-yellow-400 stroke-yellow-500 w-4 h-4" />
                            <span className="text-gray-600 text-sm ml-1">4.0</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          className="w-full bg-black hover:bg-red-800 text-white py-2 rounded-lg transition-colors text-sm font-medium flex justify-center items-center"
                          onClick={() => addToCart(product.id)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 pt-2 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Warranty Information */}
        <div className="my-12 bg-blue-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
              <ShieldCheck className="w-16 h-16 text-blue-600" />
            </div>
            <div className="md:w-3/4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Warranty Information</h2>
              <p className="text-gray-700 mb-4">
                All locally manufactured solid wood products will have a warranty of 5 years against poor quality of timber and manufacturing defects. All locally manufactured PVC and fabric sofa sets will have a warranty for 5 years on the timber frame.
              </p>
              <p className="text-gray-700">
                All furniture manufactured in melamine, plywood, veneer, MDF or any other material will have a warranty of 1 year against manufacturing defects other than solid wood.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;