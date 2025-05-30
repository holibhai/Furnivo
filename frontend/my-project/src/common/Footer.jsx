import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaArrowRight } from "react-icons/fa";
import logo from "../assets/Cream_and_Brown_Minimalist_Furniture_Logo-removebg-preview (1).png";


const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", href: "#" },
      { name: "Our Story", href: "#" },
      { name: "Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
    ],
    shop: [
      { name: "All Products", href: "#" },
      { name: "New Arrivals", href: "#" },
      { name: "Best Sellers", href: "#" },
      { name: "Special Offers", href: "#" },
      { name: "Gift Cards", href: "#" },
    ],
    customer: [
      { name: "Contact Us", href: "#" },
      { name: "FAQs", href: "#" },
      { name: "Shipping", href: "#" },
      { name: "Returns", href: "#" },
      { name: "Order Tracking", href: "#" },
    ],
    policies: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Accessibility", href: "#" },
    ],
  };

  return (
    <footer className="w-full min-h-screen bg-gray-700 flex flex-col mt-12">
      {/* Main Footer Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4">
        {/* Left Content (2/4 width) */}
        <div className="lg:col-span-2 p-12 xl:p-20 ">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {/* Brand Section */}
            <div className="mb-16">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  <img src={logo} alt="" className="-mb-28 -mt-36" />
                </h1>
              </div>
              <p className="text-gray-400 mt-6 max-w-2xl text-base">
                Elevating your space with handcrafted furniture that combines timeless design with modern functionality.
                Each piece is meticulously crafted to bring warmth and character to your home.
              </p>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-auto">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold mb-6 text-white uppercase tracking-wider">
                    {category}
                  </h3>
                  <ul className="space-y-4">
                    {links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-gray-900 transition-colors duration-300 flex items-center group"
                        >
                          <span className="group-hover:mr-2 transition-all duration-300">
                            <FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                          </span>
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Image Section (2/4 width) */}
        <div className="lg:col-span-2 relative">
          <div 
            className="h-full w-full bg-cover bg-center sticky top-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-12 xl:p-20">
              <div className="w-full">
                <h3 className="text-3xl font-bold text-white mb-4">Join Our Community</h3>
                <p className="text-white mb-8 text-lg">
                  Subscribe to receive exclusive offers, design inspiration, and early access to new collections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-grow px-6 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition-all"
                  />
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center justify-center font-medium shadow-md transition-colors duration-300">
                    <span className="mr-2">Subscribe</span>
                    <FaEnvelope />
                  </button>
                </div>
                <div className="flex gap-6 mt-12">
                  <a
                    href="#"
                    className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors duration-300"
                  >
                    <FaFacebookF className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors duration-300"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors duration-300"
                  >
                    <FaLinkedinIn className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-900 text-gray-400 py-8 px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center gap-6">
              <p className="text-sm">© {new Date().getFullYear()} Sen-Sora Furniture. All rights reserved.</p>
              <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</a>
            </div>
            <p className="text-sm">Crafted with Mohanathas Holins</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
