// --- ChessboardContext.tsx ---

import React, { createContext, useContext, useState } from 'react';

interface BoardColor {
  blackTile: string;
  whiteTile: string;
  register?: string;
  whiteRow: string;
  blackRow: string;
}

interface ChessboardContextProps {
  boardColor: BoardColor;
  setBoardColor: React.Dispatch<React.SetStateAction<BoardColor>>;
}

const ChessboardContext = createContext<ChessboardContextProps | undefined>(undefined);

export const useChessboardContext = (): ChessboardContextProps => {
  const context = useContext(ChessboardContext);
  if (!context) {
    throw new Error('useChessboardContext must be used within a ChessboardProvider');
  }
  return context;
};

export const ChessboardProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const [boardColor, setBoardColor] = useState<BoardColor>({
    blackTile: '',
    whiteTile: '',
    register: '',
    whiteRow: '',
    blackRow: ''
  });
  
  return (
    <ChessboardContext.Provider value={{ boardColor, setBoardColor }}>
      {children}
    </ChessboardContext.Provider>
  );
};
