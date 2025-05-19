import cloneDeep from 'lodash/cloneDeep';
import { PieceType } from "../../Types";
import { getPossibleBishopCaptures, getPossibleBishopMoves, getPossibleBishopMovesKing, isMoveValidForBishop } from "../pieces/Bishop";
import { getPossibleKingCaptures, getPossibleKingMoves, getPossibleKingMovesKing, isMoveValidForKing, isSimulatedMoveCausingCheck } from "../pieces/King";
import { getPossibleKnightCaptures, getPossibleKnightMoves, getPossibleKnightMovesKing, isMoveValidForKnight } from "../pieces/Knight";
import { getPossiblePawnCaptures, getPossiblePawnMoves, getPossiblePawnMovesKing, isMoveValidForPawn } from "../pieces/Pawn";
import { getPossibleQueenCaptures, getPossibleQueenMoves, getPossibleQueenMovesKing, isMoveValidForQueen } from "../pieces/Queen";
import { getPossibleRookCaptures, getPossibleRookMoves, getPossibleRookMovesKing, isMoveValidForRook } from "../pieces/Rook";

export const isMoveValid = (pieceType, selectedPiece,x,y,pieces, enPassantTarget) => {
    switch (pieceType) {
      case PieceType.PAWN:
        return isMoveValidForPawn(selectedPiece, x, y, pieces, enPassantTarget);

      case PieceType.ROOK:
        return isMoveValidForRook(selectedPiece, x, y, pieces);

      case PieceType.KNIGHT:
        return isMoveValidForKnight(selectedPiece, x, y, pieces);

      case PieceType.BISHOP:
        return isMoveValidForBishop(selectedPiece, x, y, pieces);

      case PieceType.QUEEN:
        return isMoveValidForQueen(selectedPiece, x, y, pieces);

      case PieceType.KING:
        return isMoveValidForKing(selectedPiece, x, y, pieces);

      default:
        return false;
    }
  };

  export const getMovesFunction = (pieceType, selectedPiece, pieces, enPassantTarget) => {
    switch (pieceType) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(selectedPiece, pieces, enPassantTarget);
      case PieceType.ROOK:
        return getPossibleRookMoves(selectedPiece, pieces);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(selectedPiece, pieces);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(selectedPiece, pieces);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(selectedPiece, pieces);
      case PieceType.KING:
        return getPossibleKingMoves(selectedPiece, pieces);
      default:
        return [];
    }
  };

  export const getCaptureFunction = (pieceType, selectedPiece, pieces) => {
    switch (pieceType) {
      case PieceType.PAWN:
        return getPossiblePawnCaptures(selectedPiece, pieces);
      case PieceType.KNIGHT:
        return getPossibleKnightCaptures(selectedPiece, pieces);
      case PieceType.ROOK:
        return getPossibleRookCaptures(selectedPiece, pieces);
      case PieceType.BISHOP:
        return getPossibleBishopCaptures(selectedPiece, pieces);
      case PieceType.QUEEN:
        return getPossibleQueenCaptures(selectedPiece, pieces);
      case PieceType.KING:
        return getPossibleKingCaptures(selectedPiece, pieces);
      default:
        return [];
    }
  };
  
  export const getMovesFunctionKing = (pieceType, selectedPiece, pieces, enPassantTarget, currentTurn) => {
    switch (pieceType) {
      case PieceType.PAWN:
        return getPossiblePawnMovesKing(selectedPiece, pieces);
      case PieceType.ROOK:
        return getPossibleRookMovesKing(selectedPiece, pieces);
      case PieceType.BISHOP:
        return getPossibleBishopMovesKing(selectedPiece, pieces);
      case PieceType.KNIGHT:
        return getPossibleKnightMovesKing(selectedPiece, pieces);
      case PieceType.QUEEN:
        return getPossibleQueenMovesKing(selectedPiece, pieces);
      case PieceType.KING:
        return getPossibleKingMovesKing(selectedPiece, pieces, currentTurn);
      default:
        return [];
    }
  };

  export const handleThreefoldRepetition = (move) => {
     const move1 = move[move.length-1];
     const move2 = move[move.length-2];
     const move3 = move[move.length-3];
     const move4 = move[move.length-4];
     const move5 = move[move.length-5];
     const move6 = move[move.length-6];
     const move7 = move[move.length-7];
     const move8 = move[move.length-8];
     if(move.length > 7 && move1 === move5 && move2 === move6 &&
        move3 === move7 && move4 === move8){
          return true;
        }else{
          return false;
        }
  };

  export const insufficientMaterial = (pieces) => {
    if(pieces.length === 2 ){
      return true
    }if(pieces.length === 3){
      const bishop = pieces.find((p) => p.type === PieceType.BISHOP);
      const knight = pieces.find((p) => p.type === PieceType.KNIGHT);
      if(bishop || knight){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
  
 

  export const isStalemate = (king, pieces, piece,x,y) => {
    const { color } = king;
  
    // Clonar el array de piezas para tener una copia
    const piecesCopy = cloneDeep(pieces);

    const indexOfPiece = piecesCopy.findIndex((p) => p.x === piece.x && p.y === piece.y);

    if (indexOfPiece === -1) {
      throw new Error('No se encontró la pieza en la copia de las piezas.');
    }

    // Actualizar la posición de la pieza en la copia
    piecesCopy[indexOfPiece].x = x;
    piecesCopy[indexOfPiece].y = y;

    // Buscar el rey en la copia de las piezas actualizadas
    const updatedPieces = piecesCopy.filter((p) => !(p.x === x && p.y === y && p.color === color)); // Elimina la pieza capturada
  
    // Obtener todas las piezas del mismo color del rey
    const sameColorPieces = updatedPieces.filter((p) => p.color === color);
  
    // Iterar a través de todas las piezas del mismo color
    for (const piece of sameColorPieces) {
      // Obtener los movimientos posibles de cada pieza
          const possibleMoves = getMovesFunction(piece.type, piece, updatedPieces, null, color);
      
          for (const move of possibleMoves) {
            // Simular cada movimiento y verificar si deja al rey en jaque
            const isCheckAfterMove = isSimulatedMoveCausingCheck(piece, move.x, move.y, updatedPieces, null, color);
      
            if (!isCheckAfterMove) {
              // Si alguna pieza tiene un movimiento legal, no es ahogado
              return false;
            }
        }
    }
    
    const king1 = updatedPieces.find((p) => p.type === PieceType.KING && p.color !== piece.color);

    // Si ninguna pieza puede moverse legalmente, verificar los movimientos del rey
    const kingMoves = getPossibleKingMoves(king1, pieces);
  
    for (const move of kingMoves) {
      const isCheckAfterMove = isSimulatedMoveCausingCheck(king1, move.x, move.y, piecesCopy, null, color);
  
      if (!isCheckAfterMove) {
        // Si el rey tiene un movimiento legal, no es ahogado
        return false;
      }
    }

    return true;
  
   
  };

  