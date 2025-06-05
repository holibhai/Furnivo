import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

const GridOffer = () => {
  const furnitureItems = [
    {
      id: 1,
      title: "Luxury Sofa Collection",
      subtitle: "Premium comfort",
      description: "Handcrafted with finest materials",
      price: "From $899",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      category: "Living Room"
    },
    {
      id: 2,
      title: "Modern Lighting",
      subtitle: "Illuminate your space",
      description: "Contemporary designs",
      price: "From $199",
      image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
      category: "Lighting"
    },
    {
      id: 3,
      title: "Dining Collection",
      subtitle: "Elegant meals",
      description: "Perfect for gatherings",
      price: "From $699",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
      category: "Dining"
    },
    {
      id: 4,
      title: "Bedroom Essentials",
      subtitle: "Restful nights",
      description: "Luxury bedding sets",
      price: "From $399",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      category: "Bedroom"
    },
    {
      id: 5,
      title: "Office Solutions",
      subtitle: "Productive workspace",
      description: "Ergonomic designs",
      price: "From $499",
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
      category: "Office"
    }
  ];

  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-500 rounded-full text-sm font-medium tracking-wider mb-4">
            NEW COLLECTION
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Curated <span className="text-red-500">Home</span> Essentials
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium selection of furniture designed to elevate every space in your home
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 relative rounded-2xl overflow-hidden h-[800px] group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
            <img
              src={furnitureItems[0].image}
              alt={furnitureItems[0].title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
              <span className="text-sm font-medium text-white/80 mb-2 block">{furnitureItems[0].category}</span>
              <h3 className="text-3xl font-bold text-white mb-3">{furnitureItems[0].title}</h3>
              <p className="text-lg text-white/90 mb-4">{furnitureItems[0].subtitle}</p>
              <p className="text-white/70 mb-6 max-w-md">{furnitureItems[0].description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{furnitureItems[0].price}</span>
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group-hover:rotate-45">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-[800px]">
            {furnitureItems.slice(1, 5).map((item) => (
              <div key={item.id} className="relative rounded-2xl overflow-hidden h-full group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                  <span className="text-xs font-medium text-white/80 mb-1 block">{item.category}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/90 mb-3">{item.subtitle}</p>
                  <p className="text-xs text-white/70 mb-4 max-w-xs">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{item.price}</span>
                    <button className="flex items-center text-white text-sm font-medium hover:text-red-300 transition-colors duration-300">
                      View collection
                      <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 border border-gray-300 rounded-full text-base font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-300">
            View all collections
            <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default GridOffer;