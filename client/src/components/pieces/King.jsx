import { PieceType } from "../../Types";
import { getMovesFunctionKing } from "../referee/Referee";
import cloneDeep from 'lodash/cloneDeep';


export const isMoveValidForKing = (piece, x, y, pieces) => {
  const dx = Math.abs(x - piece.x);
  const dy = Math.abs(y - piece.y);
  const color = piece.color;

  const isAtackKing = isSimulatedMoveCausingCheck(piece, piece.x, piece.y, pieces, null, piece.color); 
  const isAtackKingRight = isSimulatedMoveCausingCheck(piece, x-1, y, pieces, null, piece.color) ;

  if (dx === 2 && y === piece.y) {
    // Verificar si es el primer movimiento del rey y si el enroque es válido
    // Determinar la posición de la torre correspondiente para el enroque a la derecha
    const rookX = 7;
    const rook = pieces.find((p) => p.x === rookX && p.y === y);
    const minCol = Math.min(piece.x, x);
    const maxCol = Math.max(piece.x, x);

    if(isAtackKing) return;

    if (!piece.hasMoved ) {
      if (minCol === piece.x && maxCol === piece.x + 2 && rook && !rook.hasMoved) {
                // Verificación para el enroque a la derecha
           if(isAtackKingRight) return;
         if (!pieces.some((p) => p.x === piece.x + 1 && p.y === y) &&
              !pieces.some((p) => p.x === piece.x + 2 && p.y === y)) {

            if (rook) {
              // Mover la torre al lado opuesto del rey
              rook.x = 5;
              rook.hasMoved= true;
              piece.hasMoved = true;
              return true;
            }           
        }
      } else if (minCol === piece.x - 2 && maxCol === piece.x) {

        // Determinar la posición de la torre correspondiente para el enroque a la izquierda
        if(isAtackKing) return;
        const rookX = 0;
        const rook = pieces.find((p) => p.x === rookX && p.y === y);
         if( rook && !rook.hasMoved){
             // Verificación para el enroque a la izquierda
            if (!pieces.some((p) => p.x === piece.x - 1 && p.y === y) &&
            !pieces.some((p) => p.x === piece.x - 2 && p.y === y) &&
            !pieces.some((p) => p.x === piece.x - 3 && p.y === y)) {
          
            // Mover la torre al lado opuesto del rey
            rook.x = 3;
            rook.hasMoved = true;
            piece.hasMoved = true;
            return true;
          
        
           }
         }
      }
    }
  } else if (dx <= 1 && dy <= 1) {
    const destinationPiece = pieces.find((p) => p.x === x && p.y === y);

    if (!destinationPiece || destinationPiece.color !== color) {     
        piece.hasMoved = true;
        return true;      
    }
  }
  return false;
};

export const getPossibleKingMoves = (king, pieces) => {
  const possibleMoves = [];
  const kingX = king.x;
  const kingY = king.y;

  // Definir las direcciones a las que un rey puede moverse
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: -1 },
  ];

  // Verificar si el enroque corto (a la derecha) es posible
  const canCastleShort = canCastle(king, pieces, true);

  // Verificar si el enroque largo (a la izquierda) es posible
  const canCastleLong = canCastle(king, pieces, false);

  // Iterar a través de las direcciones y calcular las casillas a las que el rey puede moverse
  for (const direction of directions) {
    const x = kingX + direction.dx;
    const y = kingY + direction.dy;

    // Comprobar si la casilla está dentro del tablero (entre 0 y 7 en ambos ejes)
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      // Comprobar si la casilla está vacía
      const destinationPiece = pieces.find((p) => p.x === x && p.y === y);
      const destinationPieceShort = pieces.find((p) => p.x === x+1 && p.y === y);
      const destinationPieceLong = pieces.find((p) => p.x === x-1 && p.y === y) ||
                                   pieces.find((p) => p.x === x-2 && p.y === y);

      if (!destinationPiece) {

          if (canCastleShort && !destinationPieceShort) {                      
              possibleMoves.push({ x: x + 1, y: y === 0 ? 0 : y === 7 ? 7 : null });            
          }
          if (canCastleLong && !destinationPieceLong) {
                 possibleMoves.push({ x: x - 1, y : y === 0 ? 0 : y === 7 ? 7 : null });
              
        }
        
          possibleMoves.push({ x, y });
          // Añadir movimientos de enroque si son posible             
      }
    }
  }

  

  return possibleMoves;
};

export const getPossibleKingMovesKing = (king, pieces) => {
  const possibleMoves = [];
  const kingX = king.x;
  const kingY = king.y;

  // Definir las direcciones a las que un rey puede moverse
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: -1 },
  ];

  // Iterar a través de las direcciones y calcular las casillas a las que el rey puede moverse
  for (const direction of directions) {
    const x = kingX + direction.dx;
    const y = kingY + direction.dy;

    // Comprobar si la casilla está dentro del tablero (entre 0 y 7 en ambos ejes)
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      // Comprobar si la casilla está vacía o tiene una pieza del color opuesto
      const destinationPiece = pieces.find((p) => p.x === x && p.y === y);

      if (!destinationPiece || destinationPiece.color !== king.color) {
        possibleMoves.push({ x, y });
      }
    }
  }

  return possibleMoves;
};

// Función para verificar si el enroque es posible
const canCastle = (king, pieces, short) => {
  if (king.hasMoved) {
    return false; // El rey ya se ha movido, el enroque no es posible
  }

  const rookX = short ? 7 : 0; // Si es enroque corto, usar la torre derecha, de lo contrario, usar la torre izquierda
  const rook = pieces.find((p) => p.x === rookX && p.y === king.y);

  if (rook && rook.hasMoved) {
    return false; // La torre no está presente o ya se ha movido, el enroque no es posible
  }
  return true;
};

export const getPossibleKingCaptures = (king, pieces) => {
  const { x, y, color } = king;
  const possibleCaptures = [];
  const kingMoves = [
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: -1 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: 1 },
  ];

  // Función para agregar una captura si la casilla contiene una pieza enemiga
  const addCaptureIfEnemyPiece = (dx, dy) => {
    const targetX = x + dx;
    const targetY = y + dy;
    if (targetX >= 0 && targetX <= 7 && targetY >= 0 && targetY <= 7) {
      const targetPiece = pieces.find((p) => p.x === targetX && p.y === targetY);
      if (targetPiece && targetPiece.color !== color) {
        possibleCaptures.push({ x: targetX, y: targetY });
      }
    }
  };

  // Iterar a través de las ocho posibles direcciones de movimiento del rey
  for (const move of kingMoves) {
    addCaptureIfEnemyPiece(move.dx, move.dy);
  }

  return possibleCaptures;
};

export const isSimulatedMoveCausingCheck = (piece, x, y, pieces, enPassantTarget, currentTurn) => {
  
  try {
    // Clonar el array de piezas para tener una copia
    const piecesCopy = cloneDeep(pieces);

    if (!piece) throw new Error('La pieza no está definida.');

    // Buscar el índice de la pieza en la copia para actualizar su posición
    const indexOfPiece = piecesCopy.findIndex((p) => p.x === piece.x && p.y === piece.y);
    const indexOfCapturedPiece = piecesCopy.findIndex((p) => p.x === x && p.y === y);

    if (indexOfCapturedPiece !== -1) {
      piecesCopy[indexOfCapturedPiece].color = piece.color;
      piecesCopy[indexOfCapturedPiece].type = piece.type;
    }

    if (indexOfPiece === -1) {
      throw new Error('No se encontró la pieza en la copia de las piezas.');
    }

    // Actualizar la posición de la pieza en la copia
    piecesCopy[indexOfPiece].x = x;
    piecesCopy[indexOfPiece].y = y;

    // console.log('pieceCopy', piecesCopy);

    // Buscar el rey en la copia de las piezas actualizadas
    const king = piecesCopy.find((p) => p.type === PieceType.KING && p.color === piece.color);

    if (!king) {
      console.error('No se encontró el rey en la copia de las piezas.');
      return false;
    }
    
    // Obtener las posiciones amenazadas por las piezas rivales en la copia actualizada
    const threatenedPositions = [];

    piecesCopy.forEach((p) => {
      if (p.color !== king.color) {
        const captureMoves = getMovesFunctionKing(p.type, p, piecesCopy, enPassantTarget, currentTurn);
        threatenedPositions.push(...captureMoves);
      }
    });
    
    // Verificar si la posición del rey está entre las amenazadas por las piezas rivales
    const isKingThreatened = threatenedPositions.some(
      (threatenedPosition) =>
        threatenedPosition.x === king.x && threatenedPosition.y === king.y
    );
    // console.log(isKingThreatened);
    return isKingThreatened;
  } catch (error) {
    console.error('Error en la función isSimulatedMoveCausingCheck:', error.message);
    return false; // O devuelve un valor que indique un error, según tu lógica
  }
};

export const isSimulatedMoveCheckOpponent = (piece, x, y, pieces, enPassantTarget, currentTurn) => {
  
  
  try {
    // Clonar el array de piezas para tener una copia
    let piecesCopy = cloneDeep(pieces);

    if (!piece) throw new Error('La pieza no está definida.');

    // Buscar el índice de la pieza en la copia para actualizar su posición
    const indexOfPiece = piecesCopy.findIndex((p) => p.x === piece.x && p.y === piece.y);
    
     const indexOfCapturedPiece = piecesCopy.findIndex((p) => p.x === x && p.y === y);
       if(indexOfCapturedPiece !== -1){
      
      piecesCopy[indexOfCapturedPiece].color = piece.color;
      piecesCopy[indexOfCapturedPiece].type = piece.type;
    }
    
        if (indexOfPiece === -1) {
      throw new Error('No se encontró la pieza en la copia de las piezas.');
    }

    // Actualizar la posición de la pieza en la copia
    piecesCopy[indexOfPiece].x = x;
    piecesCopy[indexOfPiece].y = y;

    // Buscar el rey en la copia de las piezas actualizadas
    const king = piecesCopy.find((p) => p.type === PieceType.KING && p.color !== piece.color);

    if (!king) {
      console.error('No se encontró el rey en la copia de las piezas.');
      return false;
    }

    // Obtener las posiciones amenazadas por las piezas rivales en la copia actualizada
    const threatenedPositions = [];

    piecesCopy.forEach((p) => {
      if (p.color !== king.color) {
        const captureMoves = getMovesFunctionKing(p.type, p, piecesCopy, enPassantTarget, currentTurn);
        threatenedPositions.push(...captureMoves);
      }
    });

    // Verificar si la posición del rey está entre las amenazadas por las piezas rivales
    const isKingThreatened = threatenedPositions.some(
      (threatenedPosition) =>
        threatenedPosition.x === king.x && threatenedPosition.y === king.y
    );

    return isKingThreatened;
  } catch (error) {
    console.error('Error en la función isSimulatedMoveCausingCheck:', error.message);
    return false; // O devuelve un valor que indique un error, según tu lógica
  }
};

export const isCheckmateAfterMove = (piece, x, y, pieces, enPassantTarget, currentTurn) => {
  try {
    
    if (!piece) throw new Error('La pieza no está definida.');
    const simulatedMoveResult = isSimulatedMoveCheckOpponent(piece, x, y, pieces, enPassantTarget, currentTurn);

    // Si el movimiento no pone al rey en jaque, entonces no hay jaque mate
    if (!simulatedMoveResult) {
      return false;
    }
    // Clonar el array de piezas para tener una copia
    const piecesCopy = cloneDeep(pieces);

    // Buscar el índice de la pieza en la copia para actualizar su posición
    const indexOfPiece = piecesCopy.findIndex((p) => p.x === piece.x && p.y === piece.y);

    if (indexOfPiece === -1) {
      throw new Error('No se encontró la pieza en la copia de las piezas.');
    }

    // Actualizar la posición de la pieza en la copia
    piecesCopy[indexOfPiece].x = x;
    piecesCopy[indexOfPiece].y = y;

    // Buscar el rey en la copia de las piezas actualizadas
    const updatedPieces = piecesCopy.filter((p) => !(p.x === x && p.y === y && p.color === currentTurn)); // Elimina la pieza capturada

    const king = updatedPieces.find((p) => p.type === PieceType.KING && p.color !== piece.color);

    if (!king) {
      console.error('No se encontró el rey en la copia de las piezas.');
      return false;
    }

    // Obtener todas las piezas del mismo color del rey
    const sameColorPieces = updatedPieces.filter((p) => p.color === king.color);
    
    // Iterar a través de todas las piezas del mismo color
    for (const allyPiece of sameColorPieces) {
      // Obtener los movimientos posibles de cada pieza aliada
      const possibleMoves = getMovesFunctionKing(allyPiece.type, allyPiece, updatedPieces, enPassantTarget, currentTurn);
    
      for (const move of possibleMoves) {
        const escapeResult = isSimulatedMoveCausingCheck(allyPiece, move.x, move.y, updatedPieces, enPassantTarget, currentTurn);
       
        if (!escapeResult) {
          // Si el rey puede escapar al menos a una posición, no hay jaque mate
          return false;
        }
      }
    }

    // Si no hay posiciones de escape para el rey, entonces es jaque mate
    return true;
  } catch (error) {
    console.error('Error en la función isCheckmateAfterMove:', error.message);
    return false; // O devuelve un valor que indique un error, según tu lógica
  }
};

export const isDrownedKingMove = (piece, x, y, pieces, enPassantTarget, currentTurn) => {
  try {

    const king = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);

    if (!king) {
      console.error('No se encontró el rey en la copia de las piezas.');
      return false;
    }

    // Obtener todas las piezas del mismo color del rey
    const sameColorPieces = pieces.filter((p) => p.color === king.color);
    
    // Iterar a través de todas las piezas del mismo color
    for (const allyPiece of sameColorPieces) {
      // Obtener los movimientos posibles de cada pieza aliada
      const possibleMoves = getMovesFunctionKing(allyPiece.type, allyPiece, pieces, enPassantTarget, currentTurn);
    
      for (const move of possibleMoves) {
        const escapeResult = isSimulatedMoveCausingCheck(allyPiece, move.x, move.y, pieces, enPassantTarget, currentTurn);
       
        if (!escapeResult) {
          // Si el rey puede escapar al menos a una posición, no hay jaque mate
          return false;
        }
      }
    }

    // Si no hay posiciones de escape para el rey, entonces es jaque mate
    return true;
  } catch (error) {
    console.error('Error en la función isCheckmateAfterMove:', error.message);
    return false; // O devuelve un valor que indique un error, según tu lógica
  }
};













