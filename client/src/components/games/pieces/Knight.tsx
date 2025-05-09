import { Piece } from "./Pieces";

export const isMoveValidForKnight = (piece: Piece, x: number, y: number, pieces: Piece[]): boolean => {
    const deltaX = Math.abs(x - piece.x);
    const deltaY = Math.abs(y - piece.y);
  
    if ((deltaX === 1 && deltaY === 2) || (deltaX === 2 && deltaY === 1)) {
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
  
  export const getPossibleKnightMoves = (piece: Piece, pieces: Piece[]): { x: number; y: number }[] => {
    const possibleMoves: { x: number; y: number }[] = [];
    const knightMoves = [
      { x: -1, y: -2 },
      { x: 1, y: -2 },
      { x: -2, y: -1 },
      { x: 2, y: -1 },
      { x: -2, y: 1 },
      { x: 2, y: 1 },
      { x: -1, y: 2 },
      { x: 1, y: 2 },
    ];
  
    for (const move of knightMoves) {
      const x = piece.x + move.x;
      const y = piece.y + move.y;
  
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const isOccupied = pieces.some((p) => p.x === x && p.y === y);
        if (!isOccupied) {
          possibleMoves.push({ x, y });
        }
      }
    }
  
    return possibleMoves;
  };
  
  export const getPossibleKnightMovesKing = (piece: Piece, pieces: Piece[]): { x: number; y: number }[] => {
    const possibleMoves: { x: number; y: number }[] = [];
    const knightMoves = [
      { x: -1, y: -2 },
      { x: 1, y: -2 },
      { x: -2, y: -1 },
      { x: 2, y: -1 },
      { x: -2, y: 1 },
      { x: 2, y: 1 },
      { x: -1, y: 2 },
      { x: 1, y: 2 },
    ];
  
    for (const move of knightMoves) {
      const x = piece.x + move.x;
      const y = piece.y + move.y;
  
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const isOccupied = pieces.some((p) => p.x === x && p.y === y);
  
        if (!isOccupied) {
          possibleMoves.push({ x, y });
        } else {
          const isOpponentPiece = pieces.some((p) => p.x === x && p.y === y && p.color !== piece.color);
  
          if (isOpponentPiece) {
            possibleMoves.push({ x, y });
          }
        }
      }
    }
  
    return possibleMoves;
  };
  
  export const getPossibleKnightCaptures = (knight: Piece, pieces: Piece[]): { x: number; y: number }[] => {
    const { x, y, color } = knight;
    const possibleCaptures: { x: number; y: number }[] = [];
  
    const knightMoves = [
      { dx: 1, dy: 2 },
      { dx: 2, dy: 1 },
      { dx: 2, dy: -1 },
      { dx: 1, dy: -2 },
      { dx: -1, dy: -2 },
      { dx: -2, dy: -1 },
      { dx: -2, dy: 1 },
      { dx: -1, dy: 2 },
    ];
  
    const addCaptureIfEnemyPiece = (dx: number, dy: number) => {
      const targetX = x + dx;
      const targetY = y + dy;
      if (targetX >= 0 && targetX <= 7 && targetY >= 0 && targetY <= 7) {
        const targetPiece = pieces.find((p) => p.x === targetX && p.y === targetY);
        if (targetPiece && targetPiece.color !== color) {
          possibleCaptures.push({ x: targetX, y: targetY });
        }
      }
    };
  
    for (const move of knightMoves) {
      addCaptureIfEnemyPiece(move.dx, move.dy);
    }
  
    return possibleCaptures;
  };
  