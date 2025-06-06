import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const PriceRange = ({ onPriceChange }) => {
  const navigate = useNavigate();
  const [minLimit, setMinLimit] = useState(0);
  const [maxLimit, setMaxLimit] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);

  const { minValue, setMinValue, maxValue, setMaxValue } = useAppContext();

  useEffect(() => {
    const findMinMaxProductPrice = async () => {
      try {
        setIsLoading(true);
        const [minResponse, maxResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/product/minProduct`, {
            headers: {
              "Content-Type": "application/json",
            },
          }),
          axios.get(`http://localhost:8080/api/product/maxProduct`, {
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        const minPrice = minResponse.data.productPrice;
        const maxPrice = maxResponse.data.productPrice;

        setMinLimit(minPrice);
        setMaxLimit(maxPrice);
        setMinValue(minPrice);
        setMaxValue(maxPrice);

        if (onPriceChange) {
          onPriceChange(minPrice, maxPrice);
        }
      } catch (err) {
        console.error("Error fetching price range:", err);
      } finally {
        setIsLoading(false);
      }
    };

    findMinMaxProductPrice();
  }, []);

  const handleMinChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin <= maxValue - 100) {
      setMinValue(newMin);
      if (onPriceChange) {
        onPriceChange(newMin, maxValue);
      }
    }
  };

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax >= minValue + 100) {
      setMaxValue(newMax);
      if (onPriceChange) {
        onPriceChange(minValue, newMax);
      }
    }
  };

  if (isLoading)
    return (
      <div className="w-full max-w-lg mx-auto my-5 p-4">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-lg mx-auto my-5 p-6 py-12 bg-white rounded-lg shadow-sm border border-gray-100">

      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2"></div>

        <div
          className="absolute top-1/2 h-2 bg-blue-100 rounded-full transform -translate-y-1/2"
          style={{
            left: `${((minValue - minLimit) / (maxLimit - minLimit)) * 100}%`,
            width: `${((maxValue - minValue) / (maxLimit - minLimit)) * 100}%`,
          }}
        ></div>

        <div
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
          style={{
            left: `${((minValue - minLimit) / (maxLimit - minLimit)) * 100}%`,
            zIndex: 5,
          }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-200 text-xs px-2 py-1 rounded">
            ${typeof minValue === "number" ? minValue.toLocaleString() : "0"}
          </div>
        </div>

        <div
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
          style={{
            left: `${((maxValue - minLimit) / (maxLimit - minLimit)) * 100}%`,
            zIndex: 5,
          }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-200 text-xs px-2 py-1 rounded">
            ${typeof maxValue === "number" ? maxValue.toLocaleString() : "0"}
          </div>
        </div>

        <input
          type="range"
          min={minLimit}
          max={maxLimit - 100}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-4 opacity-0 cursor-pointer"
          style={{ zIndex: 3 }}
        />
        <input
          type="range"
          min={minLimit + 100}
          max={maxLimit}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full h-4 opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex  items-center mt-6">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-600 mr-2">Min:</span>
          <span className="text-base font-semibold text-gray-800">
            Rs.{typeof minValue === "number" ? minValue.toLocaleString() : "0"}
          </span>
        </div>
        <div className="w-4 h-px bg-gray-300 mx-2"></div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-600 mr-2">Max:</span>
          <span className="text-base font-semibold text-gray-800">
            Rs.{typeof maxValue === "number" ? maxValue.toLocaleString() : "0"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
