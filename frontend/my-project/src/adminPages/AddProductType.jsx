import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Upload, 
  Image as ImageIcon,
  DollarSign,
  Percent,
  Package,
  Ruler,
  Shield,
  Type,
  AlignLeft,
  ChevronDown,
  Plus,
  Check,
  X
} from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom";
const AddProduct = () => {
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    discount: "",
    productQuantity: "",
    width: "",
    height: "",
    depth: "",
    warrantyInf: "",
    productType: "",
    category: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get("http://localhost:8080/api/catagorie/get");
        setCategories(catRes.data.catagorieDtoList);

        const prodTypeRes = await axios.get("http://localhost:8080/api/productType/get");
        setProductTypes(prodTypeRes.data.productTypeDtoList);
      } catch (err) {
        console.error("Error fetching dropdown options", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getProductType = async () => {
      if (product.category) {
        try {
          const res = await axios.get(`http://localhost:8080/api/productType/getByName/${product.category}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setProductTypes(res.data.productTypeDtoList);
        } catch (err) {
          console.error(err);
        }
      }
    };
    getProductType();
  }, [product.category]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, image: file });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setProduct({ ...product, image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    formData.append("imagefile", product.image);

    try {
      const response = await axios.post("http://localhost:8080/api/product/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
        toast.success("Product Added Successfully", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              onClose: () => navigate('/admin/displayProducts')
            });
    } catch (error) {
      console.error("Error adding product:", error);
       toast.error("Failed to Add Product", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
      
    }
  };

  return (
    <div className=" max-w-7xl mx-auto px-4 py-8">
                  <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center">
          <Plus className="h-6 w-6 text-blue-600 mr-2" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Add New Product</h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the product details below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Type className="h-4 w-4 mr-2 text-gray-500" />
                  Product Name 
                </label>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <AlignLeft className="h-4 w-4 mr-2 text-gray-500" />
                  Description *
                </label>
                <textarea
                  name="productDescription"
                  value={product.productDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  Category 
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.catagorieId} value={cat.catagorieType}>
                        {cat.catagorieType}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  Product Type 
                </label>
                <div className="relative">
                  <select
                    name="productType"
                    value={product.productType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    required
                  >
                    <option value="">Select Product Type</option>
                    {productTypes.map((type) => (
                      <option key={type.productTypeId} value={type.productTypeName}>
                        {type.productTypeName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  Price 
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input
                    type="number"
                    name="productPrice"
                    value={product.productPrice}
                    onChange={handleChange}
                    className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">LKR</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="discount"
                    value={product.discount}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  Quantity *
                </label>
                <input
                  type="number"
                  name="productQuantity"
                  value={product.productQuantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Ruler className="h-4 w-4 mr-2 text-gray-500" />
                  Dimensions
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Width</label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="width"
                        value={product.width}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 text-xs">cm</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Height</label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="height"
                        value={product.height}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 text-xs">cm</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Depth</label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="depth"
                        value={product.depth}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 text-xs">cm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Shield className="h-4 w-4 mr-2 text-gray-500" />
                  Warranty Info
                </label>
                <input
                  type="text"
                  name="warrantyInf"
                  value={product.warrantyInf}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
              Product Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </label>
              {imagePreview && (
                <div className="relative group">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200" 
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;