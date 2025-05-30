import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { ListVideo } from "lucide-react";

const Catagory = () => {
  const [catagoryList, setCatagoryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/catagorie/get`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCatagoryList(response.data.catagorieDtoList);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchData();
  }, [catagoryList]);

  const handleUpdate = (id) => {
    navigate("/admin/updateCatagory", { state: { id } });
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/catagorie/delete/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCatagoryList((prev) =>
        prev.filter((cat) => cat.catagorieId !== categoryId)
      );
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete category");
    }
  };

  const displayProductTypes = () => {
    navigate("/admin/displayProductType");
  };
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="rounded-2xl p-6 border border-gray-200">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Categories</h1> */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Product Catagory <ListVideo className="inline" />
          </h1>
          <div className="flex items-center gap-1 bg-blue-600 px-4 py-2 rounded-lg text-white text-sm cursor-pointer hover:bg-blue-700">
            <Plus className="w-[16px]" />
            <span>
              <Link to="/admin/addproduct">Create New</Link>
            </span>
          </div>
        </div>

        <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden mt-10">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Description</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {catagoryList.length > 0 ? (
              catagoryList.map((catagory) => (
                <tr
                  key={catagory.catagorieId}
                  className="border  hover:bg-gray-50 "
                >
                  <td className="p-4">{catagory.catagorieType}</td>
                  <td className="p-4">{catagory.catagorieDescription}</td>
                  <td className="p-4 flex gap-4">
                    {/* <button
                      onClick={() => handleUpdate(catagory.id)}
                      className="text-blue-600 hover:text-blue-800 bg-green-300 rounded-full py-2 px-4"
                      
                    > 
                      <Pencil className="w-4 mr-2 h-5 inline" />
                       Edit
                    </button>
                    <button
                      onClick={() => handleDelete(catagory.id)}
                      className="text-red-600 hover:text-red-800 bg-red-300 rounded-full py-2 px-4"
                    >
                      <Trash2 className="w-4  mr-2 h-5 inline" />
                      Delete
                    </button> */}
                    <div className="flex gap-3">
                      <div
                        className="flex gap-2 border border-gray-300 px-3 rounded-lg bg-green-600"
                        onClick={() => handleUpdate(catagory.id)}
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
                          onClick={() => handleDelete(catagory.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                  <td
                    className="text-neutral-500 text-xs cursor-pointer hover:text-orange-500"
                    onClick={displayProductTypes}
                  >
                    {" "}
                    <Eye className="inline w-[15px]" /> view productTypes
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-gray-500" colSpan={4}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div></div>
    </div>
  );
};

export default Catagory;
