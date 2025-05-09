import { Piece } from "./Pieces";
// Valida un movimiento de alfil
export const isMoveValidForBishop = (piece: Piece, x: number, y: number, pieces: Piece[]): boolean => {
    const deltaX = Math.abs(x - piece.x);
    const deltaY = Math.abs(y - piece.y);
  
    if (deltaX === deltaY) {
      for (let i = 1; i < deltaX; i++) {
        const targetX = piece.x + (x > piece.x ? i : -i);
        const targetY = piece.y + (y > piece.y ? i : -i);
  
        const isOccupied = pieces.some((p) => p.x === targetX && p.y === targetY);
  
        if (isOccupied) {
          return false;
        }
      }
  
      const targetPiece = pieces.find((p) => p.x === x && p.y === y);
      if (!targetPiece || targetPiece.color !== piece.color) {
        if (!piece.hasMoved) {
          piece.hasMoved = true;
        }
        return true;
      }
    }
  
    return false;
  };
  
  // Movimientos posibles para un alfil (sin capturas)
  export const getPossibleBishopMoves = (piece: Piece, pieces: Piece[]): { x: number; y: number }[] => {
    const possibleMoves: { x: number; y: number }[] = [];
  
    if (!piece) {
      console.error('La pieza es undefined en getPossibleBishopMoves');
      return [];
    }
  
    for (let dx = -1; dx <= 1; dx += 2) {
      for (let dy = -1; dy <= 1; dy += 2) {
        for (let i = 1; i < 8; i++) {
          const x = piece.x + i * dx;
          const y = piece.y + i * dy;
  
          if (x < 0 || x > 7 || y < 0 || y > 7) break;
  
          const targetPiece = pieces.find((p) => p.x === x && p.y === y);
  
          if (targetPiece) break;
  
          possibleMoves.push({ x, y });
        }
      }
    }
  
    return possibleMoves;
  };
  
  // Movimientos posibles para el alfil (permitiendo captura de oponentes)
  export const getPossibleBishopMovesKing = (piece: Piece, pieces: Piece[]): { x: number; y: number }[] => {
    const possibleMoves: { x: number; y: number }[] = [];
  
    if (!piece) {
      console.error('La pieza es undefined en getPossibleBishopMovesKing');
      return [];
    }
  
    for (let dx = -1; dx <= 1; dx += 2) {
      for (let dy = -1; dy <= 1; dy += 2) {
        for (let i = 1; i < 8; i++) {
          const x = piece.x + i * dx;
          const y = piece.y + i * dy;
  
          if (x < 0 || x > 7 || y < 0 || y > 7) break;
  
          const targetPiece = pieces.find((p) => p.x === x && p.y === y);
  
          if (targetPiece) {
            if (targetPiece.color !== piece.color) {
              possibleMoves.push({ x, y });
            }
            break;
          }
  
          possibleMoves.push({ x, y });
        }
      }
    }
  
    return possibleMoves;
  };
  
  // Capturas posibles para un alfil
  export const getPossibleBishopCaptures = (bishop: Piece, pieces: Piece[]): { x: number; y: number }[] => {
    const possibleCaptures: { x: number; y: number }[] = [];
  
    for (let dx = -1; dx <= 1; dx += 2) {
      for (let dy = -1; dy <= 1; dy += 2) {
        for (let i = 1; i < 8; i++) {
          const x = bishop.x + i * dx;
          const y = bishop.y + i * dy;
  
          if (x < 0 || x > 7 || y < 0 || y > 7) break;
  
          const targetPiece = pieces.find((p) => p.x === x && p.y === y);
  
          if (targetPiece) {
            if (targetPiece.color !== bishop.color) {
              possibleCaptures.push({ x, y });
            }
            break;
          }
        }
      }
    }
  
    return possibleCaptures;
  };