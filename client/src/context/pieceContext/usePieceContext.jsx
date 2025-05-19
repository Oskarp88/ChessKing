import { useContext } from 'react';
import { PieceContext } from './PieceContext';

export const usePieceContext = () => {
  const context = useContext(PieceContext);
  if (!context) {
    throw new Error('usePieceContext must be used within a PieceProvider');
  }
  return context;
};
