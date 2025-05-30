import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  X,
  Star,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
import EmptyState from "./EmptyState";
import { useAppContext } from "../context/AppContext";
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Favorites = () => {
  const [favProducts, setFavProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const { favCount, setFavCount } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:8080/api/favaurite/get/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.statusCode === 200) {
          const favList = response.data.favauriteDtoList;

          const productPromises = favList.map(async (fav) => {
            const productResponse = await axios.get(
              `http://localhost:8080/api/product/${fav.productId}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return {
              product: productResponse.data,
              favouriteId: fav.id,
            };
          });

          const resolved = await Promise.all(productPromises);
          setFavProducts(resolved);
        }
      } catch (error) {
        console.error("Error fetching favourite products:", error);
        toast.error("Failed to load favorite products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeFromFavorites = async (favouriteIdToRemove) => {
    if (isRemoving) return;
    setIsRemoving(true);

    try {
      await axios.delete(
        `http://localhost:8080/api/favaurite/delete/${favouriteIdToRemove}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFavProducts((prev) =>
        prev.filter((item) => item.favouriteId !== favouriteIdToRemove)
      );

      setFavCount((prev) => prev - 1);
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Failed to remove from favorites");
    } finally {
      setIsRemoving(false);
    }
  };

  const ProductCard = ({ product, favouriteId }) => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 group">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={`data:${product.imageType};base64,${product.imageData}`}
            alt={product.productName}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <button
          onClick={() => removeFromFavorites(favouriteId)}
          disabled={isRemoving}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Remove from favorites"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {product.productName}
              </h3>
            </Link>
            <p className="text-gray-500 text-sm mt-1">{product.category}</p>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">(24)</span>
            </div>
          </div>
          <div className="text-right">
            {product.discount > 0 ? (
              <>
                <p className="font-semibold text-gray-900">
                  $
                  {(
                    product.productPrice -
                    (product.productPrice * product.discount) / 100
                  ).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  ${product.productPrice.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="font-semibold text-gray-900">
                ${product.productPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/product/${product.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center group"
          >
            View details
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const Breadcrumbs = () => (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
              Favorites
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );

  const FilterBar = () => (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-2">
        <button className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200">
          All Items
        </button>
        <button className="px-3 py-1 text-sm text-gray-600 rounded-full hover:bg-gray-100">
          On Sale
        </button>
        <button className="px-3 py-1 text-sm text-gray-600 rounded-full hover:bg-gray-100">
          In Stock
        </button>
      </div>
      <div className="text-sm text-gray-500">
        Showing {favProducts.length} of {favProducts.length} items
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-36">
            <ToastContainer position="top-right" autoClose={3000} />
      
      <Breadcrumbs />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
        <p className="text-gray-500 mt-2">
          {favProducts.length} {favProducts.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {favProducts.length > 0 && <FilterBar />}

      {favProducts.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-12 h-12 text-gray-400" />}
          title="Your wishlist is empty"
          description="Looks like you haven't added any items to your favorites yet. Start exploring and save your favorite products!"
          actionText="Browse Products"
          actionLink="/productListMainPage"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favProducts.map(({ product, favouriteId }) => (
            <ProductCard
              key={product.id}
              product={product}
              favouriteId={favouriteId}
            />
          ))}
        </div>
      )}

      {favProducts.length > 0 && (
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Need inspiration?
          </h3>
          <p className="text-gray-600 mb-4">
            Based on your favorites, we think you might like these similar items.
          </p>
          <Link
            to="/recommendations"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View recommendations <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
