import React, { useState } from 'react';
import { PieceContext } from './PieceContext';

const PieceProvider = ({ children }) => {
  const [pieceFile, setPieceFile] = useState({ image: '' });

  return (
    <PieceContext.Provider value={{ pieceFile, setPieceFile }}>
      {children}
    </PieceContext.Provider>
  );
};

export { PieceProvider };
