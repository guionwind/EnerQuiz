// En un archivo, por ejemplo, AppContext.js
import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [mitoken, setMiToken] = useState(null);

  const guardarToken = (nuevoToken) => {
    setMiToken(nuevoToken);
  };

  return (
    <AppContext.Provider value={{ mitoken, guardarToken }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe ser utilizado dentro de un AppProvider');
  }
  return context;
};

export { AppProvider, useAppContext };




