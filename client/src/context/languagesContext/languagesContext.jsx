import { createContext, useContext } from 'react';

export const LanguagesContext = createContext();

export const useLanguagesContext = () => {
  const context = useContext(LanguagesContext);
  if (!context) {
    throw new Error('useLanguagesContext must be used within a LanguagesContext');
  }
  return context;
};
