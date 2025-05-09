import { EnPassantTarget, Move, PieceType } from "../../../Types";
import { Piece } from "./Pieces";

export const isMoveValidForPawn = (
  piece: Piece, 
  x: number, 
  y: number, 
  pieces: Piece[], 
  enPassantTarget: EnPassantTarget | null
): boolean => {
  const dx = x - piece.x;
  const dy = y - piece.y;
  const pieceAtDestination = pieces.find((p) => p.x === x && p.y === y);

  if (pieceAtDestination && pieceAtDestination.color === piece.color) {
    return false;
  }

  if (dx === 0) {
    if (piece.color === 'white') {
      if (dy === 1 && !pieceAtDestination) {
        return true;
      } else if (piece.y === 1 && dy === 2 && !pieceAtDestination) {
        const intermediateCell = pieces.find((p) => p.x === x && p.y === y - 1);
        return !intermediateCell;
      }
    } else if (piece.color === 'black') {
      if (dy === -1 && !pieceAtDestination) {
        return true;
      } else if (piece.y === 6 && dy === -2 && !pieceAtDestination) {
        const intermediateCell = pieces.find((p) => p.x === x && p.y === y + 1);
        return !intermediateCell;
      }
    }
  } else if (Math.abs(dx) === 1 && piece.color === 'white' && dy === 1) {
    if (pieceAtDestination && pieceAtDestination.color !== piece.color) {
      return true;
    } else if (enPassantTarget && piece.y === 4 && y === enPassantTarget.y && x === enPassantTarget.x) {
      if (piece.type === PieceType.PAWN) {
        const capturedPiece = pieces.find(
          (p) =>
            (p.x === enPassantTarget.x && p.y === enPassantTarget.y - 1) ||
            (p.x === enPassantTarget.x && p.y === enPassantTarget.y + 1)
        );
        if (capturedPiece) {
          pieces.splice(pieces.indexOf(capturedPiece), 1);
        }
      }
      return true;
    }
  } else if (Math.abs(dx) === 1 && piece.color === 'black' && dy === -1) {
    if (pieceAtDestination && pieceAtDestination.color !== piece.color) {
      return true;
    } else if (enPassantTarget && piece.y === 3 && y === enPassantTarget.y && x === enPassantTarget.x) {
      if (piece.type === PieceType.PAWN) {
        const capturedPiece = pieces.find(
          (p) =>
            (p.x === enPassantTarget.x && p.y === enPassantTarget.y - 1) ||
            (p.x === enPassantTarget.x && p.y === enPassantTarget.y + 1)
        );
        if (capturedPiece) {
          pieces.splice(pieces.indexOf(capturedPiece), 1);
        }
      }
      return true;
    }
  }

  return false;
};

export function getPossiblePawnMoves(
  pawn: Piece, 
  pieces: Piece[], 
  enPassantTarget: EnPassantTarget | null
): Move[] {
  const { x, y, color } = pawn;
  const possibleMoves: Move[] = [];
  const forwardDirection = color === 'white' ? 1 : -1;

  const addMoveIfEmpty = (dx: number, dy: number) => {
    const targetX = x + dx;
    const targetY = y + dy;
    if (targetX >= 0 && targetX <= 7 && targetY >= 0 && targetY <= 7) {
      if (!pieces.some((p) => p.x === targetX && p.y === targetY)) {
        possibleMoves.push({ x: targetX, y: targetY });
      }
    }
  };

  addMoveIfEmpty(0, forwardDirection);

  if ((color === 'white' && y === 1) || (color === 'black' && y === 6)) {
    const intermediateY = y + forwardDirection;
    const finalY = y + 2 * forwardDirection;
    const intermediateCell = pieces.find((p) => p.x === x && p.y === intermediateY);
    const finalCell = pieces.find((p) => p.x === x && p.y === finalY);
    if (!intermediateCell && !finalCell) {
      possibleMoves.push({ x, y: finalY });
    }
  }

  if (enPassantTarget) {
    const targetX = enPassantTarget.x;
    const targetY = enPassantTarget.y;
    if (
      (targetX === x + 1 || targetX === x - 1) &&
      targetY === y + forwardDirection &&
      (y === 3 || y === 4)
    ) {
      possibleMoves.push({ x: targetX, y: targetY });
    }
  }

  return possibleMoves;
}

export function getPossiblePawnMovesKing(pawn: Piece, pieces: Piece[]): Move[] {
  const { x, y, color } = pawn;
  const possibleMoves: Move[] = [];
  const forwardDirection = color === 'white' ? 1 : -1;

  const addMoveIfEmpty = (dx: number, dy: number) => {
    const targetX = x + dx;
    const targetY = y + dy;
    if (targetX >= 0 && targetX <= 7 && targetY >= 0 && targetY <= 7) {
      if (!pieces.some((p) => p.x === targetX && p.y === targetY)) {
        possibleMoves.push({ x: targetX, y: targetY });
      }
    }
  };

  const addCaptureMove = (dx: number, dy: number) => {
    const targetX = x + dx;
    const targetY = y + dy;
    if (targetX >= 0 && targetX <= 7 && targetY >= 0 && targetY <= 7) {
      const targetPiece = pieces.find((p) => p.x === targetX && p.y === targetY);
      if (targetPiece && targetPiece.color !== color) {
        possibleMoves.push({ x: targetX, y: targetY });
      }
    }
  };

  addMoveIfEmpty(0, forwardDirection);

  if ((color === 'white' && y === 1) || (color === 'black' && y === 6)) {
    addMoveIfEmpty(0, 2 * forwardDirection);
  }

  addCaptureMove(1, forwardDirection);
  addCaptureMove(-1, forwardDirection);

  return possibleMoves;
}

export const getPossiblePawnCaptures = (pawn: Piece, pieces: Piece[]): Move[] => {
  const { x, y, color } = pawn;
  const possibleCaptures: Move[] = [];
  const forwardDirection = color === 'white' ? 1 : -1;

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

  addCaptureIfEnemyPiece(-1, forwardDirection);
  addCaptureIfEnemyPiece(1, forwardDirection);

  return possibleCaptures;
};
