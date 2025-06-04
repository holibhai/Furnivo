import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, ShoppingCart, Star, Pencil, Trash2, ChevronLeft, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import { Breadcrumbs, Chip, Tabs, Tab, Divider, Tooltip, Badge } from "@mui/material";

const AdminProductDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [productId]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:8080/api/product/delete/${productId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Product deleted successfully");
        navigate("/admin/displayProducts");
      } catch (err) {
        console.error("Error deleting product", err);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleUpdate = (productId) => {
    navigate("/admin/productUpdate", { state: { productId } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-50 border-l-4 border-yellow-500  max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Product not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const discountedPrice = product.productPrice - (product.productPrice * product.discount) / 100;

  return (
    <div className="bg-white rounded-lg">
      {/* Header with Breadcrumbs */}
      {/* <div className="mb-6">
        <Breadcrumbs aria-label="breadcrumb" className="text-sm">
          <button 
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Products
          </button>
          <span className="text-gray-500">Product Details</span>
          <span className="font-medium">{product.productName}</span>
        </Breadcrumbs>
      </div> */}

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 pr-20" >
        <div className="md:flex">
          {/* Product Image Section */}
          <div className="md:w-1/2  flex flex-col items-center">
            <div className="relative w-full max-w-md h-96 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
              {product.imageData ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-pulse rounded-full bg-gray-200 h-12 w-12"></div>
                    </div>
                  )}
                  <img
                    src={`data:${product.imageType};base64,${product.imageData}`}
                    alt={product.productName}
                    className={`object-contain   rounded-lg transition-opacity w-full duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="mt-2">No Image Available</span>
                </div>
              )}
            </div>
            
            {/* Image Gallery Placeholder */}
            <div className="flex space-x-2 mt-4 w-full max-w-md overflow-x-auto py-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex-shrink-0 w-16 h-16 rounded-md bg-gray-200 border border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"></div>
              ))}
              <div className="flex-shrink-0 w-16 h-16 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400">
                <PlusIcon className="w-5 h-5" />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 w-full max-w-md flex flex-col space-y-3">
              <div className="flex justify-between space-x-3">
                <button 
                  onClick={() => handleUpdate(product.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors shadow-sm"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Product</span>
                </button>
                
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Product</span>
                </button>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg transition-colors shadow-sm">
                <MoreVertical className="w-4 h-4" />
                <span>More Actions</span>
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {product.productName}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-4 h-4 text-gray-300" />
                    <span className="ml-1 text-sm text-gray-600">4.0 (24 reviews)</span>
                  </div>
                  
                  {product.discount > 0 && (
                    <Chip 
                      label={`${product.discount}% OFF`} 
                      color="error" 
                      size="small" 
                      className="text-xs"
                    />
                  )}
                </div>
              </div>
              
              <Tooltip title="Product ID">
                <Badge 
                  badgeContent={`ID: ${product.id}`} 
                  color="primary" 
                  className="text-xs font-mono"
                />
              </Tooltip>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3">
                {product.discount > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-gray-800">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.productPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      Save ${(product.productPrice - discountedPrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-800">
                    ${product.productPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="mt-3 flex items-center">
                <Chip 
                  label={product.productQuantity > 0 ? 'In Stock' : 'Out of Stock'} 
                  color={product.productQuantity > 0 ? 'success' : 'error'} 
                  size="small" 
                  variant="outlined"
                />
                <span className="ml-3 text-sm text-gray-600">
                  {product.productQuantity > 0 ? (
                    <>
                      <span className="font-medium">{product.productQuantity}</span> items available
                    </>
                  ) : (
                    "Restocking soon"
                  )}
                </span>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mb-6">
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Details" />
                <Tab label="Specifications" />
                <Tab label="Reviews" />
                <Tab label="Activity" />
              </Tabs>
              <Divider />
            </div>
            
            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === 0 && (
                <>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">Description</h2>
                  <p className="text-gray-600 mb-6">
                    {product.description || "No description available for this product."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-2">Dimensions</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex justify-between">
                          <span className="text-gray-500">Width:</span>
                          <span>{product.width || 'N/A'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Height:</span>
                          <span>{product.height || 'N/A'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Depth:</span>
                          <span>{product.depth || 'N/A'}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-2">Category</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {product.category || 'N/A'} Item
                      </p>
                      
                      <h3 className="text-md font-medium text-gray-700 mb-2">Product Type</h3>
                      <p className="text-sm text-gray-600">
                        {product.productType || 'N/A'}
                      </p>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 1 && (
                <div className="text-gray-600">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Technical Specifications</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-500 font-medium">Material</td>
                        <td className="py-2">Wood, Metal</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-500 font-medium">Color</td>
                        <td className="py-2">Dark Blue</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-500 font-medium">Weight</td>
                        <td className="py-2">45 kg</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-500 font-medium">Assembly Required</td>
                        <td className="py-2">Yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 2 && (
                <div className="text-gray-600">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 text-center">
                      <div className="text-4xl font-bold">4.0</div>
                      <div className="flex justify-center">
                        {[1, 2, 3, 4].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="text-sm text-gray-500">24 reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center mb-1">
                          <div className="w-10 text-sm font-medium">{rating} star</div>
                          <div className="flex-1 mx-2 h-2.5 bg-gray-200 rounded-full">
                            <div 
                              className="h-2.5 bg-yellow-400 rounded-full" 
                              style={{ width: `${rating * 20}%` }}
                            ></div>
                          </div>
                          <div className="w-10 text-right text-sm text-gray-500">
                            {rating === 4 ? '12' : rating === 5 ? '8' : '2'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View all reviews
                  </button>
                </div>
              )}
              
              {activeTab === 3 && (
                <div className="text-gray-600">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Product Activity</h3>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Product updated</p>
                        <p className="text-xs text-gray-500">2 days ago by Admin User</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Price adjusted</p>
                        <p className="text-xs text-gray-500">1 week ago by System</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Warranty Information</h2>
              <p className="text-sm text-gray-600">
                All locally manufactured solid wood products will have a warranty of 5 years against poor quality of timber and manufacturing defects. All locally manufactured PVC and fabric sofa sets will have a warranty for 5 years on the timber frame. All furniture manufactured in melamine, plywood, veneer, MDF or any other material will have a warranty of 1 year against manufacturing defects other than solid wood.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Plus icon component
const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
);

export default AdminProductDetail;