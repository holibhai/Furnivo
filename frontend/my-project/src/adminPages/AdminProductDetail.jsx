import React, { useEffect } from "react";
import image from "../assets/scandinavian-vintage-wood-cabinet-with-chair-by-dark-blue-wall_53876-98164.jpg";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { Star } from "lucide-react";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";

const AdminProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId;
  console.log(productId);

  const [product, setProduct] = useState([]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${productId}`
        );

        console.log(response.data);
        setProduct(response.data);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };
    fetchProduct();
  }, [product]);

  const handleDelete=async(productId)=>{
    try {
        await axios.delete(`http://localhost:8080/api/product/delete/${productId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        navigate("/admin/displayProducts")
      } catch (err) {
        console.error("Error deleting product", err);
      }
  }

  const handleUpdate=(productId)=>{
      navigate("/admin/productUpdate",{state:{productId}})
  }

  return (
    <div className="">
      <div className="border p-5 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl font-bold text-gray-700 my-2">
                {product.productName}
              </h1>
              {/* <p className="text-gray-500">Rs 225,000.00 - Rs 340,000.00</p> */}
              <div className="flex gap-5 items-center">
                <p className="text-gray-400 line-through text-xs ">              
                  {product.discount > 0 ? (
                    <p>{product.productPrice}</p>
                  ) : (
                    <p></p>
                  )}
                </p>

                {product.discount > 0 ? (
                  <p className="text-red-600">
                    $
                    {product.productPrice -
                      (product.productPrice * product.discount) / 100}
                  </p>
                ) : (
                  <p className="text-gray-700">${product.productPrice}</p>
                )}
                <p className="flex">
                  {[1, 2, 3, 4].map((count) => (
                    <Star className="fill-orange-400 stroke-yellow-500 w-[13px]" />
                  ))}
                  <Star className="w-[18px] fill-gray-400 text-white" />
                  <p className="text-orange-400 font-semibold">4.0</p>
                </p>
                <p className=" bg-red-500 text-white py-1 rounded-lg px-3 text-xs">
                  {product.discount}%
                </p>
              </div>
              <p className="font-medium">
                Availability:{" "}
                <span className="text-pink-500">
                  {product.productQuantity > 0 ? (
                    <span>In Stock</span>
                  ) : (
                    <span>Not Available</span>
                  )}
                </span>
              </p>
              <div className="flex items-start gap-36">
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <h1 className="font-bold text-gray-700 text-base">
                    Dimentions
                  </h1>
                  <h1>Width:{product.width}</h1>
                  <h1>Height:{product.height}</h1>
                  <h1>Depth:{product.depth}</h1>
                </div>
                <div className="mt-3">
                  <h1 className=" font-bold text-gray-700 text-base">
                    Catagory
                  </h1>
                  <p className="text-sm">{product.category} Item</p>
                  <h1 className="mt-5 font-bold text-gray-700 text-base">
                    ProductType
                  </h1>
                  <p className="text-sm">{product.productType}</p>
                </div>
                <div className="mt-3">
                  <h1 className=" font-bold text-gray-700 text-base">
                    Quantity
                  </h1>
                  <p className="text-sm ">{product.productQuantity} Item</p>
                </div>
              </div>

              <div className="mt-4">
                <h1 className="font-bold text-gray-700 text-xl">
                  Warranty Information
                </h1>
                <p className="mt-5  text-sm  ">
                  All locally manufactured solid wood products will have a
                  warranty of 5 years against poor quality of timber and
                  manufacturing defects. All locally manufactured PVC and fabric
                  sofa sets will have a warranty for 5 years on the timbre
                  frame. All furniture manufactured in melamine, plywood,
                  veneer, MDF or any other material will have a warranty of 1
                  year against manufacturing defects other than solid wood.{" "}
                </p>
              </div>

              <p className="text-gray-500 mt-3">
                Bright and elegant, the Aspen wardrobe is a brilliantly crafted
                furniture piece which brightens up any space it is positioned
                {/* in. Its spacious element along with the excellent design makes
                it the ideal choice for your bedroom space. */}
              </p>
            </div>
          </div>
          <div className="w-[400px] h-[400px] mx-28 flex flex-col gap-5">
            <img
              src={`data:${product.imageType};base64,${product.imageData}`}
              alt="Product Image"
              className="w-[400px] h-[400px]"
            />
            <div className="flex justify-between items-center ">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span>
                    <Heart className="text-neutral-600 w-[15px]" />
                  </span>
                  <span className="text-neutral-600 text-xs font-bold">
                    ADD TO FAVAURITE
                  </span>
                </div>
                <span className="text-sm text-neutral-600 font-semibold">
                  Please login to add items to wishlist
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-2 border border-gray-300 px-3 rounded-lg bg-green-600" onClick={()=>handleUpdate(product.id)}>
                <span>
                  <Pencil className="w-[10px] text-white" />
                </span>
                <button className="font-medium text-sm text-white">Edit</button>
              </div>
              <div className="flex gap-2 border border-gray-300 px-3 rounded-lg bg-red-600">
                <span>
                  <Trash2 className="w-[14px] text-white" />
                </span>
                <button className="font-medium text-sm text-white" onClick={()=>handleDelete(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
