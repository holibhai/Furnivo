import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaQuoteLeft,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import {
  MdKingBed,
  MdChair,
  MdKitchen,
  MdDesk,
  MdLiving,
} from "react-icons/md";
import { BiDish } from "react-icons/bi";
import live from "../assets/armchair-green-living-room-with-copy-space_43614-910.jpg";
import bedroom from "../assets/photo-1611892440504-42a792e24d32.avif";
import dining from "../assets/photo-1643999440226-7290747ef45f.avif";
import kitchen from "../assets/photo-1740402065388-e5eede20ebbb.avif";
import kitchen2 from "../assets/photo-1713707131805-f0d7d7432598.avif";
import office from "../assets/photo-1627226325480-f46163bc38c2.avif";
import checked from "../assets/checked_753344.png";
import bussines from "../assets/businessman-making-ok-sign.jpg";
import bussines2 from "../assets/businessman-doing-victory-gesture.jpg";
import bussines3 from "../assets/businessman-sitting-armchair.jpg";
import HomeProducts from "./HomeProducts";
import GridOffer from "./GridOffer";
import homedecor from "../assets/home-decor_7904097.png";
import besideTable from "../assets/bedside-table_1863230.png";
import dressTable from "../assets/dressing-table_11053044.png";
import sofa from "../assets/sofa_1483774.png";

import dine from "../assets/photo-1610809026329-2b7b713a986c.avif";

const Home = () => {
  const slides = [
    {
      id: 1,
      image: live,
      title: "Modern Living Room Furniture",
      description:
        "Discover our premium collection of living room furniture that combines comfort with contemporary design.",
      buttonText: "Shop Living Room",
    },
    {
      id: 2,
      image: dining,
      title: "Elegant Dining Sets",
      description:
        "Create memorable dining experiences with our handcrafted dining tables and chairs.",
      buttonText: "Shop Dining Room",
    },
    {
      id: 3,
      image: bedroom,
      title: "Luxury Bedroom Collections",
      description:
        "Transform your bedroom into a peaceful retreat with our premium bedroom furniture.",
      buttonText: "Shop Bedroom",
    },
    {
      id: 4,
      image: kitchen,
      title: "Functional Home Office",
      description:
        "Boost your productivity with our ergonomic and stylish home office solutions.",
      buttonText: "Shop Office",
    },
  {
  id: 5,
  image: kitchen2,
  title: "Modern Kitchen Essentials",
  description:
    "Upgrade your cooking space with our sleek and functional kitchen furniture and accessories.",
  buttonText: "Shop Kitchen",
},

    {
      id: 6,
      image: office,
      title: "Functional Home Office",
      description:
        "Boost your productivity with our ergonomic and stylish home office solutions.",
      buttonText: "Shop Office",
    },
  ];

  const categories = [
    { id: 1, name: "Living Room", icon: <MdLiving size={40} />, count: 125 },
    { id: 2, name: "Bedroom", icon: <MdKingBed size={40} />, count: 89 },
    { id: 3, name: "Dining", icon: <BiDish size={40} />, count: 64 },
    { id: 4, name: "Kitchen", icon: <MdKitchen size={40} />, count: 42 },
    { id: 5, name: "Office", icon: <MdDesk size={40} />, count: 56 },
    { id: 6, name: "Chairs", icon: <MdChair size={40} />, count: 78 },
  ];

  const businessImages = [
    { src: bussines, alt: "Businessman making OK sign" },
    { src: bussines2, alt: "Businessman doing victory gesture" },
    { src: bussines3, alt: "Businessman sitting in armchair" },
  ];

  const [currentBusinessImage, setCurrentBusinessImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBusinessImage((prev) =>
        prev === businessImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [businessImages.length]);
     
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Interior Designer",
      comment:
        "The quality of furniture from this store is exceptional. My clients are always satisfied with the pieces I recommend from here.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Homeowner",
      comment:
        "I furnished my entire living room with their collection. The delivery was prompt and the assembly was straightforward.",
      rating: 4,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Architect",
      comment:
        "As an architect, I appreciate the design aesthetics and durability of their products. Highly recommended for modern homes.",
      rating: 5,
    },
  ];
  
  const featuredProducts = [
    {
      id: 1,
      name: "Modern Leather Sofa",
      price: 899.99,
      oldPrice: 1099.99,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Oak Dining Table",
      price: 599.99,
      oldPrice: 749.99,
      image:
        "https://images.unsplash.com/photo-1583845112203-454c7c58199c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.2,
    },
    {
      id: 3,
      name: "King Size Bed Frame",
      price: 799.99,
      oldPrice: 999.99,
      image:
        "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
    },
    {
      id: 4,
      name: "Ergonomic Office Chair",
      price: 349.99,
      oldPrice: 429.99,
      image:
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  return (
    <div className="font-sans">
      <div className="relative h-[700px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${
              index === currentSlide
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="container mx-auto px-6 relative z-10 text-white">
              <div className="max-w-lg">
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl mb-8">{slide.description}</p>
                <button className="text-white border rounded-full px-8 py-3 font-semibold hover:bg-gray-100 hover:text-black transition duration-300">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-gray-800 p-2 rounded-full z-20 hover:bg-opacity-100 transition"
        >
          <FaChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-gray-800 p-2 rounded-full z-20 hover:bg-opacity-100 transition"
        >
          <FaChevronRight size={24} />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            ></button>
          ))}
        </div>
      </div>

      <section className="py-28 z-50 px-6 md:px-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <h1 className="uppercase text-red-500 font-semibold">
              shop by category
            </h1>
            <h1 className="font-semibold text-4xl md:text-5xl">
              Beautiful finds for <br /> any room
            </h1>
            <p className="max-w-[500px] text-lg text-gray-600">
              Find inspiration for how to decorate your living room with this
              collection of the most beautiful living rooms from our favorite
              interior designers
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <img src={checked} alt="" className="w-[20px]" />
                <p className="font-medium text-lg">Easy entryway updates</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={checked} alt="" className="w-[20px]" />
                <p className="font-medium text-lg">
                  Keep shopping for crates and carriers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <img src={checked} alt="" className="w-[20px]" />
                <p className="font-medium text-lg">
                  Earn rewards every time you shop
                </p>
              </div>
            </div>
            <div className="py-3">
              <button className="text-red-500 text-sm font-semibold border border-red-500 rounded-full py-3 px-6 hover:bg-red-500 hover:text-white transition duration-300">
                Shop Collection
              </button>
            </div>
          </div>

          <div className="relative h-96 md:h-auto rounded-lg overflow-hidden">
            {businessImages.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentBusinessImage ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {businessImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBusinessImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentBusinessImage
                      ? "bg-red-500"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      

      <section>
        <div className="mx-36">
          <HomeProducts />
          <div className="text-center">
            <p className="text-lg text-gray-600 py-4">
              Earn rewards and enjoy exclusive perks, every time you shop
            </p>
          </div>
          <div className="text-center py-8 cursor-pointer">
            <span className=" hover:bg-red-600 hover:text-white transition-all ease-in-out border border-red-600 py-3 px-6 text-sm rounded-full text-red-600 font-semibold">
              {" "}
              View All Products
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="pb-56">
          <GridOffer />
        </div>
      </section>

      <section>
        <div className="bg-neutral-700 fle h-[1100px] flex-col relative py-96">
          <div className="rounded-xl absolute -top-60 px-20">
            <img src={kitchen} alt="" className="rounded-xl  bg-black inset-0 bg-opacity-35" />
            <div className="grid grid-cols-2 gap-10 py-20">
              <div className="flex flex-col gap-3">
                <h1 className="text-red-600 uppercase ">Design resources</h1>
                <p className="text-white text-5xl">
                  From styling tip to home <br />
                  makeovers, we’re on it.
                  <br /> for free.
                </p>
                <div className="py-10">
                  <span className="border bg-white rounded-full text-red-600  font-semibold py-2 px-6 inline">
                    Join Us Now
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-10">
                <div className="flex items-center gap-8">
                  <div className="w-[60px] ">
                    <img
                      src={besideTable}
                      alt=""
                      className="text-red-600 bg-red-60"
                    />
                  </div>
                  <div className="flex flex-col ">
                    <h1 className="text-white text-2xl ">
                      Free one on one design sessions
                    </h1>
                    <p className="text-gray-200">
                      Virtually, in store, or at home, one of our design experts
                      will meet with you to understand your project goals and
                      vision.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 ">
                  <div className="w-[60px]">
                    <img
                      src={dressTable}
                      alt=""
                      className="text-red-600 bg-red-60"
                    />
                  </div>
                  <div flex flex-col>
                    <h1 className="text-white text-2xl">
                      Solutions just for you
                    </h1>
                    <p className="text-gray-200">
                      You’ll receive mood boards, product recommendations, room
                      plans, and cost estimates, tailored to your specific
                      needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-7">
                  <div className="w-[50px]">
                    <img src={sofa} alt="" className="text-red-600 bg-red-60" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-white text-2xl">
                      Every detail covered
                    </h1>
                    <p className="text-gray-200">
                      From order placement to free swatches, we’ll provide it
                      all.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

   <section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <span className="inline-block text-red-600 text-sm font-semibold tracking-widest uppercase mb-3">Latest News</span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Stay Updated With Our News</h2>
      <div className="mx-auto mt-4 h-1 w-20 bg-red-600"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative overflow-hidden h-64">
          <img  
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGZ1cm5pdHVyZSUyMGNhcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" 
            alt="Furniture care"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full">FLOORING</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
            <span>Feb 07, 2025</span>
            <span>•</span>
            <span>By Admin</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">Seasonal Furniture Care: Protecting Your Pieces Year-Round</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">Turning a house into a home is not an easy task it requires time, attention, and the right home furniture...</p>
          <a href="#" className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors">
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative overflow-hidden h-64">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aG9tZSUyMG9mZmljZSUyMGZ1cm5pdHVyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60" 
            alt="Home office"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full">EXTERIORS</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
            <span>Feb 06, 2025</span>
            <span>•</span>
            <span>By Admin</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">Creating a Cozy and Stylish Home Office</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">Safe is the heart of your living space, offering a cozy spot for relaxation and entertainment after a long day...</p>
          <a href="#" className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors">
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative overflow-hidden h-64">
          <img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVybml0dXJlJTIwc2hvcHBpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" 
            alt="Furniture shopping"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full">DECORATION</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
            <span>Feb 06, 2025</span>
            <span>•</span>
            <span>By Admin</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">Furniture Shopping Guide: Quality Pieces Essentials</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">There's so much more to these shelves than meets the eye. What begins as a set of three simple shelves...</p>
          <a href="#" className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors">
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-lg shadow-md"
              >
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <FaQuoteLeft className="text-gray-300 text-3xl mb-4" />
                <p className="text-gray-700 mb-6">{testimonial.comment}</p>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign up for our newsletter and get 10% off your first order plus
            exclusive access to new collections.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-l-md text-gray-800 focus:outline-none"
            />
            <button className="bg-blue-800 px-6 py-3 rounded-r-md font-semibold hover:bg-blue-900 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
