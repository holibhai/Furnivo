import React from "react";
import chair1 from "../../assets/grey-comfortable-armchair-isolated-white-background_181624-25295.avif";
import chair2 from "../../assets/elegant-orange-velvet-wingback-armchair-with-black-accents_191095-81473.jpg";
import chair3 from "../../assets/stylish-orange-black-wingback-armchair-modern-furniture-design_632498-57312.jpg"
import chair4 from "../../assets/luxurious-teal-velvet-round-sofa-with-pillows-comfort-style_632498-57345.jpg"
import chair5 from "../../assets/modern-colorful-armchairs-trio-stylish-seating_191095-87776.jpg"

const latestProducts = [
  { id: 1, name: "Armado Chair", image: chair5 },
  { id: 2, name: "Elegant Orange Chair", image: chair2 },
  { id: 3, name: "Modern Gray Chair", image: chair3 }, 
  { id: 4, name: "Luxury Black Chair", image: chair4 }, 
];

const LatestProducts = () => {
  return (
    <div className="px-4 space-y-4">
      {latestProducts.map((product) => (
        <div key={product.id} className="flex items-center gap-4 border-b border-gray-300 pb-2">
          <img src={product.image} alt={product.name} className="w-[80px] h-[80px] object-cover rounded-md" />
          <h1 className="text-sm font-medium">{product.name}</h1>
        </div>
      ))}
    </div>
  );
};

export default LatestProducts;
