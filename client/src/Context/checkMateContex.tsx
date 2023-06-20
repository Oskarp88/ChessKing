import React, { createContext, useContext, useState } from 'react';


interface CheckMate{
    mate: boolean;
}
interface CheckMateContextProps {
    checkMate: CheckMate;
    setCheckMate: React.Dispatch<React.SetStateAction<CheckMate>>;
  }

const CheckMateContext = createContext<CheckMateContextProps | undefined>(undefined);

export const useCheckMateContext = (): CheckMateContextProps => {
  const context = useContext(CheckMateContext);
  if (!context) {
    throw new Error('useChessboardContext must be used within a ChessboardProvider');
  }
  return context;
};

export const CheckMateProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const [checkMate, setCheckMate] = useState<CheckMate>({mate: false});
  
  return (
    <CheckMateContext.Provider value={{ checkMate, setCheckMate }}>
      {children}
    </CheckMateContext.Provider>
  );
};
