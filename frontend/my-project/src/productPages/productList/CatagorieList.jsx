import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialCategories = [
  {
    name: "Living",
    subcategories: [],
    image: "/images/living-room.jpg",
  },
  {
    name: "Dining",
    subcategories: [],
    image: "/images/dining-room.jpg",
  },
  {
    name: "Bedroom",
    subcategories: [],
    image: "/images/bedroom.jpg",
  },
  {
    name: "Kitchen",
    subcategories: [],
    image: "/images/kitchen.jpg",
  },
  {
    name: "Study & Office",
    subcategories: [],
    image: "/images/study-office.jpg",
  },
];

const CategorySidebar = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [openCategory, setOpenCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/productType/get",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const updatedCategories = initialCategories.map((category) => {
          const matchedSubcategories = response.data.productTypeDtoList
            .filter(
              (productType) =>
                productType.catagorie.toLowerCase() === category.name.toLowerCase()
            )
            .map((productType) => ({
              name: productType.productTypeName,
              id: productType.productTypeId,
            }));

          return {
            ...category,
            subcategories: matchedSubcategories,
          };
        });

        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error fetching product types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubcategoryClick = (productType) => {
    navigate("/productListMainPage", { state: { productType } });
  };

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="space-y-2 ml-4">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded w-5/6"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {categories.map((category, index) => (
          <li key={index} className="hover:bg-gray-50 transition-colors">
            <button
              onClick={() => toggleCategory(index)}
              className={`w-full flex justify-between items-center p-4 text-left ${
                openCategory === index ? "text-blue-600" : "text-gray-700"
              } font-medium`}
            >
              <span className="capitalize">{category.name}</span>
              {openCategory === index ? (
                <FaChevronDown className="text-gray-500 text-sm" />
              ) : (
                <FaChevronRight className="text-gray-500 text-sm" />
              )}
            </button>
            {openCategory === index && (
              <ul className="pb-2 pl-6 pr-4 space-y-1">
                {category.subcategories.length > 0 ? (
                  category.subcategories.map((subcategory, subIndex) => (
                    <li key={subIndex}>
                      <button
                        onClick={() => handleSubcategoryClick(subcategory.name)}
                        className="w-full text-left p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors capitalize"
                      >
                        {subcategory.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-sm text-gray-400">No subcategories</li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;