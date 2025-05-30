import React, { useState, useEffect } from 'react';
import { DollarSign, ChevronLeft, ChevronRight, Star, StarHalf } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';

const HomeProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/product/getAll',
          {
            headers: {
              'Content-Type': 'application/json',
              // Authorization: `Bearer ${localStorage.getItem('token')}`,
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
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">No products available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-base font-semibold text-red-500 uppercase tracking-wider mb-2">
          Trending Products
        </h1>
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Top picks for your home
        </h2>
        <div className="w-20 h-1 bg-red-500 mx-auto"></div>
      </div>

      {/* Product Slider */}
      <div className="relative">
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id} className="px-2">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

// Custom Arrow Components
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} hidden sm:block`}
      style={{ ...style, right: '-25px' }}
      onClick={onClick}
    >
      <div className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition">
        <ChevronRight className="text-gray-800 h-6 w-6" />
      </div>
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} hidden sm:block`}
      style={{ ...style, left: '-25px' }}
      onClick={onClick}
    >
      <div className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition">
        <ChevronLeft className="text-gray-800 h-6 w-6" />
      </div>
    </div>
  );
};

// Star Rating Component
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
        <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const isOnSale = product.discount > 0;
  // Generate a random rating between 3.5 and 5 for demo purposes
  const rating = product.rating || (Math.random() * 1.5 + 3.5).toFixed(1);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden   transition duration-300 h-full mx-2">
      {/* Product Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={`data:${product.imageType};base64,${product.imageData}`}
          alt={product.productName}
          className="w-full h-full object-cover transition duration-500 hover:scale-105"
        />
        
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
        
        {/* Out of Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
            Sold Out
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {product.productName}
        </h3>
        
        {/* Star Rating */}
        <div className="mb-2">
          <StarRating rating={parseFloat(rating)} />
        </div>
        
        {/* Price Section */}
        <div className="flex items-center mb-3">
          {isOnSale ? (
            <>
              <span className="text-red-600 font-bold text-lg mr-2">
                {/* <DollarSign className="inline h-4 w-4" /> */}
                Rs.{(product.productPrice * (1 - product.discount / 100)).toFixed(2)}
              </span>
              <span className="text-gray-500 line-through text-sm">
                {/* <DollarSign className="inline h-3 w-3" /> */}
                Rs.{product.productPrice}
              </span>
            </>
          ) : (
            <span className="text-gray-800 font-bold text-lg">
              {/* <DollarSign className="inline h-4 w-4" /> */}
              Rs.{product.productPrice}
            </span>
          )}
        </div>
        
        {/* Category */}
        <p className="text-sm text-gray-400 font-medium mb-4 uppercase">
          {product.category}
        </p>
        
        {/* Add to Cart Button */}
        
      </div>
    </div>
  );
};

export default HomeProducts;