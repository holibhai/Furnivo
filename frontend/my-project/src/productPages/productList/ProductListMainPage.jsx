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
    <div className="mt-48 mx-16 border-t-2 border-l-2">
      
      <div className="flex  gap-5  ">
        <div className="flex flex-col w-1/6 gap-4  p-3  ">
          <div>
            <h1 className=" font-semibold text-lg">PRICE RANGE</h1>
            <div>
              <PriiceRange />
            </div>
          </div>
          <div>
            <h1 className=" font-semibold text-lg py-4">CATAGORIES</h1>
            <div>
                <CatagorieList />
            </div>
          </div>
          <div>
            <h1 className=" font-semibold text-lg py-4">OFFERS</h1>
            <div>
                <OfferList />
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-lg py-4">LATEST PRODUCTS</h1>
            <div>
                <LatestProducts/>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-3/4 gap-3 border-l border-gray-300 px-3 pl-10">
            <div className="flex items-center gap-3  py-3  ">
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
