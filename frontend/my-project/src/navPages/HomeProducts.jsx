import React, { useState, useEffect } from 'react';
import { DollarSign, ChevronLeft, ChevronRight, Star, StarHalf, ShoppingCart, Heart } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HomeProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/product/getAll',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setProducts(response.data.productDtoList || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div className="mt-8">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-gray-300 hover:bg-red-500 transition-colors duration-300"></div>
    ),
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <SectionHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Available</h3>
          <p className="text-gray-600 mb-6">We couldn't find any products matching your criteria.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader />
        
        <div className="relative mt-12">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="px-2">
                <ProductCard 
                  product={product} 
                  isWishlisted={wishlist.includes(product.id)}
                  onWishlistToggle={toggleWishlist}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

const SectionHeader = () => (
  <div className="text-center max-w-3xl mx-auto">
    <span className="inline-block px-4 py-1 bg-red-50 text-red-500 rounded-full text-sm font-semibold tracking-wider mb-4">
      TRENDING PRODUCTS
    </span>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      Discover Our <span className="text-red-500">Premium</span> Collection
    </h2>
    <div className="w-20 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto rounded-full"></div>
    <p className="mt-6 text-gray-600 text-lg">
      Carefully curated selection of high-quality products for your home
    </p>
  </div>
);

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
    <div className="relative overflow-hidden h-60 bg-gray-200">
      <Skeleton height="100%" />
    </div>
    <div className="p-5 flex-grow">
      <Skeleton count={1} height={24} width="80%" />
      <Skeleton count={1} height={20} width="60%" className="mt-2" />
      <div className="mt-4">
        <Skeleton count={1} height={16} width="40%" />
      </div>
      <div className="mt-4">
        <Skeleton count={1} height={28} width="50%" />
      </div>
    </div>
  </div>
);

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} hidden sm:block`}
      style={{ ...style, right: '-40px' }}
      onClick={onClick}
    >
      <div className="bg-white shadow-lg rounded-full p-3 hover:bg-red-50 transition-all duration-300 group">
        <ChevronRight className="text-gray-800 h-6 w-6 group-hover:text-red-500" />
      </div>
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} hidden sm:block`}
      style={{ ...style, left: '-40px' }}
      onClick={onClick}
    >
      <div className="bg-white shadow-lg rounded-full p-3 hover:bg-red-50 transition-all duration-300 group">
        <ChevronLeft className="text-gray-800 h-6 w-6 group-hover:text-red-500" />
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
};

const ProductCard = ({ product, isWishlisted, onWishlistToggle }) => {
  const isOnSale = product.discount > 0;
  const rating = product.rating || (Math.random() * 1.5 + 3.5).toFixed(1);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden  h-60">
        <img
          src={`data:${product.imageType};base64,${product.imageData}`}
          alt={product.productName}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        
        {isOnSale && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {product.discount}% OFF
          </div>
        )}
        
        {product.stock <= 0 && (
          <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Sold Out
          </div>
        )}
        
        {/* <button 
          onClick={() => onWishlistToggle(product.id)}
          className={`absolute top-4 ${isOnSale ? 'right-16' : 'right-4'} bg-white p-2 rounded-full shadow-md transition-colors duration-300 ${
            isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4  ${isWishlisted ? 'fill-current' : ''}`} />
        </button> */}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-red-500 transition-colors duration-300">
            {product.productName}
          </h3>
          
          <div className="mb-3">
            <StarRating rating={parseFloat(rating)} />
          </div>
          
          <p className="text-xs text-gray-500 font-medium mb-4 uppercase tracking-wider">
            {product.category}
          </p>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div>
              {isOnSale ? (
                <>
                  <span className="text-red-600 font-bold text-xl mr-2">
                    Rs.{(product.productPrice * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    Rs.{product.productPrice}
                  </span>
                </>
              ) : (
                <span className="text-gray-800 font-bold text-xl">
                  Rs.{product.productPrice}
                </span>
              )}
            </div>
            
            <button 
              className={`p-2 rounded-full ${product.stock <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-500 hover:bg-red-100'} transition-colors duration-300`}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;