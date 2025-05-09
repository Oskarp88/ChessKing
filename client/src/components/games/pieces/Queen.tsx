
import { isMoveValidForBishop } from "./Bishop";
import { Piece } from "./Pieces";
import { isMoveValidForRook } from "./Rook";

export const isMoveValidForQueen = (
  piece: Piece,
  x: number,
  y: number,
  pieces: Piece[]
): boolean => {
  const deltaX = Math.abs(x - piece.x);
  const deltaY = Math.abs(y - piece.y);

  if (deltaX === 0 || deltaY === 0) {
    if (!piece.hasMoved) {
      piece.hasMoved = true;
    }
    return isMoveValidForRook(piece, x, y, pieces);
  }

  if (deltaX === deltaY) {
    if (!piece.hasMoved) {
      piece.hasMoved = true;
    }
    return isMoveValidForBishop(piece, x, y, pieces);
  }

  return false;
};

export const getPossibleQueenMoves = (
  piece: Piece,
  pieces: Piece[]
): { x: number; y: number }[] => {
  const possibleMoves: { x: number; y: number }[] = [];
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
          break;
        }
      } else {
        break;
      }
    }
  }

  return possibleMoves;
};

export const getPossibleQueenMovesKing = (
  piece: Piece,
  pieces: Piece[]
): { x: number; y: number }[] => {
  const possibleMoves: { x: number; y: number }[] = [];
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
        const targetPiece = pieces.find((p) => p.x === x && p.y === y);

        if (!targetPiece) {
          possibleMoves.push({ x, y });
        } else {
          if (targetPiece.color !== piece.color) {
            possibleMoves.push({ x, y });
          }
          break;
        }
      } else {
        break;
      }
    }
  }

  return possibleMoves;
};

export const getPossibleQueenCaptures = (
  queen: Piece,
  pieces: Piece[]
): { x: number; y: number }[] => {
  const possibleCaptures: { x: number; y: number }[] = [];
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
            possibleCaptures.push({ x, y });
          }
          break;
        }
      } else {
        break;
      }
    }
  }

  return possibleCaptures;
};
