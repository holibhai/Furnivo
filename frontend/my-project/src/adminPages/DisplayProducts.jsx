import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Eye,
  Grid,
  List,
  DollarSign,
  Percent,
  Package,
  Sofa,
  Bed,
  ChefHat,
  NotebookPen,
  Utensils
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DisplayProducts = () => {
  const [products, setProducts] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [categoryCounts, setCategoryCounts] = useState({
    living: 0,
    dining: 0,
    kitchen: 0,
    bedroom: 0,
    "office & study": 0
  });
  const navigate = useNavigate();
  
  const categories = ["living", "dining", "kitchen", "bedroom", "office & study"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/product/getAll`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const productList = response.data.productDtoList || [];
        setProducts(productList);
        setFilteredProducts(productList);
        
        // Calculate category counts
        const counts = {
          living: 0,
          dining: 0,
          kitchen: 0,
          bedroom: 0,
          "office & study": 0
        };
        
        productList.forEach(product => {
          const category = product.category.toLowerCase();
          if (counts.hasOwnProperty(category)) {
            counts[category]++;
          }
        });
        
        setCategoryCounts(counts);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Category" || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        product.productName.toLowerCase().includes(searchText.toLowerCase());

      return matchesCategory && matchesSearch;
    });
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchText, products]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setIsLoading(true);
      await axios.delete(
        `http://localhost:8080/api/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(products.filter(p => p.id !== productId));
      setFilteredProducts(filteredProducts.filter(p => p.id !== productId));
      
      // Update category counts
      const deletedProduct = products.find(p => p.id === productId);
      if (deletedProduct) {
        const category = deletedProduct.category.toLowerCase();
        setCategoryCounts(prev => ({
          ...prev,
          [category]: prev[category] - 1
        }));
      }
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = (productId) => {
    navigate("/admin/productUpdate", { state: { productId } });
  };

  const handleViewProduct = (productId) => {
    navigate("/admin/displayProduct", { state: { productId } });
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "living":
        return <Sofa size={24} />;
      case "dining":
        return <Utensils size={24} />;
      case "bedroom":
        return <Bed size={24} />;
      case "kitchen":
        return <ChefHat size={24} />;
      case "office & study":
        return <NotebookPen size={24} />;
      default:
        return <Package size={24} />;
    }
  };

  const getCategoryGradient = (category) => {
    switch (category.toLowerCase()) {
      case "living":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      case "dining":
        return "bg-gradient-to-r from-green-400 to-green-600";
      case "bedroom":
        return "bg-gradient-to-r from-purple-400 to-purple-600";
      case "kitchen":
        return "bg-gradient-to-r from-red-400 to-red-600";
      case "office & study":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Product List
          </h1>
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white"}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-white"}`}
              >
                <List size={18} />
              </button>
            </div>
            
            <Link
              to="/admin/addproductType"
              className="flex items-center gap-1 bg-blue-600 px-4 py-2 rounded-lg text-white text-sm hover:bg-blue-700"
            >
              <Plus className="w-[16px]" />
              <span>Create New</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div 
              key={category}
              className={`${getCategoryGradient(category)} rounded-xl shadow-md p-4 text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">{category.toUpperCase()}</p>
                  <p className="text-2xl font-bold">{categoryCounts[category] || 0}</p>
                </div>
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  {getCategoryIcon(category)}
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button 
                  onClick={() => handleCategorySelect(category)}
                  className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded-full"
                >
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 w-full md:w-1/2">
            <Search className="text-gray-500 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="outline-none w-full text-sm text-gray-700"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center border-2 rounded-lg p-1 gap-1 text-sm text-gray-600 hover:text-gray-800 transition"
            >
              <span>{selectedCategory}</span>
              {isCategoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isCategoryOpen && (
              <div className="absolute top-8 left-0 bg-white border border-gray-300 rounded-lg shadow-md w-40 py-2 z-10">
                <div
                  onClick={() => handleCategorySelect("Category")}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  All Categories
                </div>
                {categories.map((category) => (
                  <div
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer capitalize"
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-lg flex items-start">
            <div className="text-red-800 font-semibold">{error}</div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

         

        {viewMode === "grid" ? (
          <div className="flex flex-wrap justify-start gap-7">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex flex-col"
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    <img
                      src={`data:${product.imageType};base64,${product.imageData}`}
                      alt={product.productName}
                      className="w-[150px] h-[150px] object-cover"
                    />
                    <div className="flex flex-col gap-1 py-3">
                      <h1 className="text-left text-sm font-medium">{product.productName}</h1>
                      <div className="flex justify-between items-center">
                        <h1 className="text-sm font-semibold flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {product.productPrice}
                        </h1>
                        <h1 className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          {product.discount}% off
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => handleUpdateProduct(product.id)}
                      className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded-lg text-xs hover:bg-gray-100"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded-lg text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              !isLoading && (
                <div className="w-full text-center py-8 text-gray-500">
                  No products found
                </div>
              )
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price(Rs)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                src={`data:${product.imageType};base64,${product.imageData}`}
                                alt={product.productName}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{product.productName}</div>
                              <div className="text-xs text-gray-500">{product.productType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            {/* <DollarSign className="h-3 w-3 mr-1" /> */}
                            {product.productPrice}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {product.productQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <Percent className="h-3 w-3 mr-1" />
                            {product.discount}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewProduct(product.id)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateProduct(product.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    !isLoading && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No products found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayProducts;