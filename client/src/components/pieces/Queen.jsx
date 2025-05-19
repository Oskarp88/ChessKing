import { isMoveValidForBishop } from "./Bishop";
import { isMoveValidForRook } from "./Rook";

export const isMoveValidForQueen = (piece, x, y, pieces) => {
    const deltaX = Math.abs(x - piece.x);
    const deltaY = Math.abs(y - piece.y);
  
    // Verifica si el movimiento es válido para una torre (horizontal o vertical)
    if (deltaX === 0 || deltaY === 0) {
      if (!piece.hasMoved) {
        piece.hasMoved = true;
      }
      return isMoveValidForRook(piece, x, y, pieces);
    }
  
    // Verifica si el movimiento es válido para un alfil (diagonal)
    if (deltaX === deltaY) {
      if (!piece.hasMoved) {
        piece.hasMoved = true;
      }
      return isMoveValidForBishop(piece, x, y, pieces);
    }
  
    return false; // El movimiento no es válido para una dama.
  };
  
  export const getPossibleQueenMoves = (piece, pieces) => {
    const possibleMoves = [];
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
    ];
  
    for (const direction of directions) {
      for (let i = 1; i < 8; i++) {
        const x = piece.x + i * direction.x;
        const y = piece.y + i * direction.y;
  
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const isOccupied = pieces.some((p) => p.x === x && p.y === y);
  
          if (!isOccupied) {
            possibleMoves.push({ x, y });
          } else {
            // La casilla está ocupada, no se pueden mover más allá
            break;
          }
        } else {
          // La casilla está fuera del tablero, no se puede mover más allá
          break;
        }
      }
    }
  
    return possibleMoves;
  };
  export const getPossibleQueenMovesKing = (piece, pieces) => {
    const possibleMoves = [];
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
    ];
  
    for (const direction of directions) {
      for (let i = 1; i < 8; i++) {
        const x = piece.x + i * direction.x;
        const y = piece.y + i * direction.y;
  
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const isOccupied = pieces.some((p) => p.x === x && p.y === y);
  
          if (!isOccupied) {
            possibleMoves.push({ x, y });
          } else {
            // La casilla está ocupada, verificar si la pieza es del color opuesto
            const isOpponentPiece = pieces.some((p) => p.x === x && p.y === y && p.color !== piece.color);
  
            if (isOpponentPiece) {
              // Se puede capturar la pieza en esta posición
              possibleMoves.push({ x, y });
            }
  
            // No se pueden mover más allá después de una ocupación
            break;
          }
        } else {
          // La casilla está fuera del tablero, no se puede mover más allá
          break;
        }
      }
    }
  
    return possibleMoves;
  };
  
  
  export const getPossibleQueenCaptures = (queen, pieces) => {
    const possibleCaptures = [];
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
    ];
  
    for (const direction of directions) {
      for (let i = 1; i < 8; i++) {
        const x = queen.x + i * direction.x;
        const y = queen.y + i * direction.y;
  
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const targetPiece = pieces.find((p) => p.x === x && p.y === y);
  
          if (targetPiece) {
            if (targetPiece.color !== queen.color) {
              // Si hay una pieza enemiga en las coordenadas de destino, es una posible captura.
              possibleCaptures.push({ x, y });
            }
            break; // Detén la búsqueda en esta dirección.
          }
        } else {
          // Las coordenadas están fuera del tablero, detén la búsqueda en esta dirección.
          break;
        }
      }
    }
  
    return possibleCaptures;
  };
  