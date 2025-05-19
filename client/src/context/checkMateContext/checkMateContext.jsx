import { createContext, useContext } from 'react';

export const CheckMateContext = createContext();

export const useCheckMateContext = () => {
  const context = useContext(CheckMateContext);
  if (!context) {
    throw new Error('useCheckMateContext must be used within a CheckMateProvider');
  }
  return context;
};
