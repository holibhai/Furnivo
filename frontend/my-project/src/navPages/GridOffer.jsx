import React from 'react';
import { ChevronRight } from 'lucide-react';

const GridOffer = () => {
  const furnitureItems = [
    {
      id: 1,
      title: "Luxury Sofa Collection",
      subtitle: "Premium comfort",
      description: "Handcrafted with finest materials",
      price: "From $899",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      title: "Modern Lighting",
      subtitle: "Illuminate your space",
      description: "Contemporary designs",
      price: "From $199",
      image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80"
    },
    {
      id: 3,
      title: "Dining Collection",
      subtitle: "Elegant meals",
      description: "Perfect for gatherings",
      price: "From $699",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80"
    },
    {
      id: 4,
      title: "Bedroom Essentials",
      subtitle: "Restful nights",
      description: "Luxury bedding sets",
      price: "From $399",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 5,
      title: "Office Solutions",
      subtitle: "Productive workspace",
      description: "Ergonomic designs",
      price: "From $499",
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
    }
  ];

  return (
    <div className="container mx-auto  py-16">
      {/* Header Section */}
      
      <div className="text-center mb-12">
        <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
          NEW COLLECTION
        </h1>
        <h2 className="text-5xl  text-gray-800 mb-4">
          Curated Home Essentials
        </h2>
        <div className="w-20 h-1 bg-red-500 mx-auto mb-8"></div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Full Height Promo (takes 1 column) */}
        <div className="lg:col-span-1 relative rounded-xl overflow-hidden h-[800px]">
          <img
            src={furnitureItems[0].image}
            alt={furnitureItems[0].title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 flex items-end p-8">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">{furnitureItems[0].title}</h3>
              <p className="text-lg mb-2">{furnitureItems[0].subtitle}</p>
              <p className="mb-4 text-gray-200">{furnitureItems[0].description}</p>
              <p className="font-bold text-lg mb-6">{furnitureItems[0].price}</p>
              <button className="border-2  rounded-full py-2 px-6 text-sm font-medium transition duration-300 flex items-center group hover:bg-red-600 hover:text-white">
                Shop Now 
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - 4 items in 2x2 grid (takes 2 columns) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 h-[800px]">
          {furnitureItems.slice(1, 5).map((item) => (
            <div key={item.id} className="relative rounded-xl overflow-hidden h-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6">
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-sm mb-1 text-gray-200">{item.subtitle}</p>
                  <p className="text-xs mb-2 text-gray-300">{item.description}</p>
                  <p className="font-semibold mb-3">{item.price}</p>
                  <button className="border-2 font-medium py-2 px-6 text-sm rounded-full hover:bg-red-600 hover:text-white  transition duration-300 flex items-center group">
                    View 
                    <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default GridOffer;