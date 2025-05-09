// --- ChessboardContext.tsx ---

import React, { createContext, useContext, useState } from 'react';

interface Castle {
 x: number;
 y: number;
}

interface CastleContextProps {
  castle: Castle;
  setCastle: React.Dispatch<React.SetStateAction<Castle>>;
}

const CastleContext = createContext<CastleContextProps | undefined>(undefined);

export const useCastleContext = (): CastleContextProps => {
  const context = useContext(CastleContext);
  if (!context) {
    throw new Error('useChessboardContext must be used within a CastleProvider');
  }
  return context;
};

export const CastleProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const [castle, setCastle] = useState<Castle>({
    x: 0,
    y: 0,
  });
  
  return (
    <CastleContext.Provider value={{ castle, setCastle }}>
      {children}
    </CastleContext.Provider>
  );
};
