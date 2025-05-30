import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [cartItemCount,setCartItemCount] = useState(0);
  const [items, setItems] = useState({ cartItem: [] });
  const [search,setSearch]=useState();
  const [offer,setOffer]=useState();
  const [maxValue, setMaxValue] = useState(); // Default Max Value
  const [minValue, setMinValue] = useState(); 
  const [favCount,setFavCount]=useState();
  
  const value = { navigate, cartItemCount, setCartItemCount,
                               items,setItems,
                               search,setSearch,
                               offer,setOffer,
                               maxValue,setMaxValue,
                               minValue,setMinValue,
                               favCount,setFavCount};

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
