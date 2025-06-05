import React from "react";
import PriiceRange from "./PriiceRange";
import CatagorieList from "./CatagorieList";
import OfferList from "./OfferList";
import LatestProducts from "./LatestProducts";
import { Grid3x3 } from 'lucide-react';
import { List } from 'lucide-react';
import { useState } from 'react'
import ListProduct from "./ListProduct";
import GridProduct from "./GridProduct";
import { useLocation } from "react-router-dom";

const ProductListMainPage = ({search,setSearch}) => {
  const location = useLocation();
  const categoryName = location.state?.categoryName;
  const selectedOffer=location.state?.selectedOffer;
  // const maxvalue = location.state?.maxvalue;
  // const minValue=location.state?.minValue; 
   // Default Min Value
    
  

  const [displayType,setDisplayedType]=useState(true);

  const handleDisplayType = () =>{
           setDisplayedType(!displayType);
      
  }
  return (
    <div className="mt-48 md:mx-16 mx-10 md: border-t-2 md:border-l-2">
      
      <div className="flex md:gap-5 ">
        <div className="flex flex-col  md:w-1/6 md:gap-4  md:p-3 relative  ">
          <div className="absolute  md:relative top-0 left-0 w-[200px] md:w-full">
            <h1 className="font-semibold text-lg">PRICE RANGE</h1>
            <div  >
              <PriiceRange />
            </div>
          </div>
          <div className="hidden md:block">
            <h1 className=" font-semibold text-lg py-4">CATAGORIES</h1>
            <div className="hidden md:block">
                <CatagorieList />
            </div>
          </div>
          <div className="hidden md:block">
            <h1 className=" font-semibold text-lg py-4">OFFERS</h1>
            <div className="hidden md:block">
                <OfferList  />
            </div>
          </div>
          <div className="hidden md:block">
            <h1 className="font-semibold text-lg py-4">LATEST PRODUCTS</h1>
            <div className="hidden md:block">
                <LatestProducts/>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:w-3/4 md:gap-3 md:border-l border-gray-300 md:px-3 md:pl-10 mt-20">
            <div className="flex items-center md:gap-3  py-3  ">
               <Grid3x3 className="cursor-pointer" onClick={handleDisplayType}/>
               <List  className="cursor-pointer" onClick={handleDisplayType}/>
            </div>
             {displayType? <div>
                  <div className="">
                      <GridProduct categoryName={categoryName}   search={search} setSearch={setSearch} selectedOffer={selectedOffer}/> 
                  </div>
                </div>:
                <div>
                  <div className="">
                     <ListProduct/>
                  </div>
                </div>
            }
        
        </div>
        
      </div>
    </div>
  );
};

export default ProductListMainPage;
