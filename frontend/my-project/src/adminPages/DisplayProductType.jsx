import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, PackageSearch } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const DisplayProductType = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [allCategories, setAllCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductTypes = async () => {
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

        const data = response.data.productTypeDtoList;
        setProductTypes(data);
        setFilteredTypes(data);

        const categories = [
          "All",
          ...new Set(data.map((item) => item.catagorie)),
        ];
        setAllCategories(categories);
      } catch (error) {
        console.error("Error fetching product types", error);
      }
    };

    fetchProductTypes();
  }, []);

  useEffect(() => {
    let filtered = productTypes;

    if (searchTerm) {
      filtered = filtered.filter((type) =>
        type.productTypeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter((type) => type.catagorie === categoryFilter);
    }

    setFilteredTypes(filtered);
  }, [searchTerm, categoryFilter, productTypes]);

  const handleUpdate = (id) => {
    navigate("/admin/updateProductType", { state: { id } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/producttype/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const updatedTypes = productTypes.filter(
        (type) => type.productTypeId !== id
      );
      setProductTypes(updatedTypes);
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete product type");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="rounded-2xl p-6 border border-gray-300">
        <div className="flex justify-between items-center mb-6 ">
          <div className="flex space-x-6 ">
            <p className="text-3xl font-bold text-gray-800">
              Product Types <PackageSearch className="inline" />
              </p>
              <p className="text-xs font-normal mt-4">
                {filteredTypes.length} product Types Available
              </p>
            
          </div>

          <div className="flex items-center gap-1 bg-blue-600 px-4 py-2 rounded-lg text-white text-sm cursor-pointer hover:bg-blue-700">
            <Plus className="w-[16px]" />
            <span>
              <Link to="/admin/productType">Create New</Link>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by product type name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 text-xs border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 border  border-gray-300 text-xs bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {allCategories.map((cat, idx) => (
              <option key={idx} value={cat} className="">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Catagory</th>
              <th className="p-4">Product Type</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredTypes.length > 0 ? (
              filteredTypes.map((type) => (
                <tr
                  key={type.productTypeId}
                  className="border hover:bg-gray-50"
                >
                  <td className="p-4">{type.catagorie}</td>
                  <td className="p-4">{type.productTypeName}</td>
                  <td className="p-4 flex gap-4">
                    <div className="flex gap-3">
                      <div
                        className="flex gap-2 border border-gray-300 px-3 rounded-lg bg-green-600"
                        onClick={() => handleUpdate(type.id)}
                      >
                        <span>
                          <Pencil className="w-[10px] text-white" />
                        </span>
                        <button className="font-medium text-sm text-white">
                          Edit
                        </button>
                      </div>
                      <div className="flex gap-2 border border-gray-300 px-3 rounded-lg bg-red-500">
                        <span>
                          <Trash2 className="w-[14px] text-white" />
                        </span>
                        <button
                          className="font-medium text-sm text-white"
                          onClick={() => handleDelete(type.productTypeId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-gray-500" colSpan={3}>
                  No product types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayProductType;
