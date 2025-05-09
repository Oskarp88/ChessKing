import { Piece } from "./Pieces";

export const isMoveValidForRook = (piece: Piece, x: number, y: number, pieces: Piece[]): boolean => {
    const deltaX = x - piece.x;
    const deltaY = y - piece.y;
  
    if (deltaX !== 0 && deltaY !== 0) {
      return false;
    }
  
    if (deltaX !== 0) {
      const step = deltaX > 0 ? 1 : -1;
      for (let i = piece.x + step; i !== x; i += step) {
        if (pieces.some((p) => p.x === i && p.y === piece.y)) {
          return false;
        }
      }
    } else if (deltaY !== 0) {
      const step = deltaY > 0 ? 1 : -1;
      for (let j = piece.y + step; j !== y; j += step) {
        if (pieces.some((p) => p.x === piece.x && p.y === j)) {
          return false;
        }
      }
    }
  
    const pieceAtDestination = pieces.find((p) => p.x === x && p.y === y);
    if (pieceAtDestination) {
      return pieceAtDestination.color !== piece.color;
    }
  
    if (!piece.hasMoved) {
      piece.hasMoved = true;
    }
  
    return true;
  };
  
  export const getPossibleRookMoves = (rook: Piece, pieces: Piece[]): { x: number; y: number }[] => {
    const { x, y } = rook;
    const possibleMoves: { x: number; y: number }[] = [];
  
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 }
    ];
  
    for (const direction of directions) {
      for (let step = 1; step < 8; step++) {
        const targetX = x + direction.dx * step;
        const targetY = y + direction.dy * step;
  
        if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) {
          break;
        }
  
        const pieceAtTarget = pieces.find((p) => p.x === targetX && p.y === targetY);
  
        if (pieceAtTarget) {
          break;
        }
  
        possibleMoves.push({ x: targetX, y: targetY });
      }
    }
  
    return possibleMoves;
  };

  export const getPossibleRookMovesKing = (rook: Piece, pieces: Piece[]): { x: number; y: number }[] => {
    const { x, y } = rook;
    const possibleMoves: { x: number; y: number }[] = [];
  
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 }
    ];
  
    for (const direction of directions) {
      for (let step = 1; step < 8; step++) {
        const targetX = x + direction.dx * step;
        const targetY = y + direction.dy * step;
  
        if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) {
          break;
        }
  
        const pieceAtTarget = pieces.find((p) => p.x === targetX && p.y === targetY);
  
        if (pieceAtTarget) {
          if (pieceAtTarget.color !== rook.color) {
            possibleMoves.push({ x: targetX, y: targetY });
          }
          break;
        }
  
        possibleMoves.push({ x: targetX, y: targetY });
      }
    }
  
    return possibleMoves;
  };

  export const getPossibleRookCaptures = (rook: Piece, pieces: Piece[]): { x: number; y: number }[] => {
    const { x, y, color } = rook;
    const possibleCaptures: { x: number; y: number }[] = [];
  
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 }
    ];
  
    for (const direction of directions) {
      for (let step = 1; step < 8; step++) {
        const targetX = x + direction.dx * step;
        const targetY = y + direction.dy * step;
  
        if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) {
          break;
        }
  
        const pieceAtTarget = pieces.find((p) => p.x === targetX && p.y === targetY);
  
        if (pieceAtTarget) {
          if (pieceAtTarget.color !== color) {
            possibleCaptures.push({ x: targetX, y: targetY });
          }
          break;
        }
      }
    }
  
    return possibleCaptures;
  };
  