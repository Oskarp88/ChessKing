import { PieceType } from "../../Types";

export const isMoveValidForPawn = (piece, x, y, pieces, enPassantTarget) => {
    const dx = x - piece.x;
    const dy = y - piece.y;
    const pieceAtDestination = pieces.find((p) => p.x === x && p.y === y);
    
    if (pieceAtDestination && pieceAtDestination.color === piece.color) {
      return false; // No puedes mover a una casilla ocupada por una pieza del mismo color
    }
    
    if (dx === 0) {
      // Mover hacia adelante
      if (piece.color === 'white') {
        if (dy === 1 && !pieceAtDestination) {
          return true; // Mover una casilla hacia adelante si está vacía
        } else if (piece.y === 1 && dy === 2 && !pieceAtDestination) {
          // Mover dos casillas hacia adelante en el primer movimiento
          // También verifica si la casilla intermedia está vacía
          const intermediateCell = pieces.find((p) => p.x === x && p.y === y - 1);
          return !intermediateCell;
        }
      } else if (piece.color === 'black') {
        if (dy === -1 && !pieceAtDestination) {
          return true; // Mover una casilla hacia adelante si está vacía
        } else if (piece.y === 6 && dy === -2 && !pieceAtDestination) {
          // Mover dos casillas hacia adelante en el primer movimiento
          // También verifica si la casilla intermedia está vacía
          const intermediateCell = pieces.find((p) => p.x === x && p.y === y + 1);
          return !intermediateCell;
        }
      }
    } else if (Math.abs(dx) === 1 && piece.color === 'white' && dy === 1) {
      // Mover diagonalmente para capturar hacia adelante (solo para piezas blancas)
      if (pieceAtDestination && pieceAtDestination.color !== piece.color) {
        return true;
      } else if (enPassantTarget && piece.y=== 4 && y === enPassantTarget.y && x === enPassantTarget.x) {
        // Captura al paso (solo para piezas blancas)
        if (enPassantTarget && x === enPassantTarget.x && 
          y === enPassantTarget.y && piece.type === PieceType.PAWN) {

          const pieceAtDestination = pieces.find((p) =>
            p.x === enPassantTarget.x && p.y === enPassantTarget.y-1 
            || p.x === enPassantTarget.x && p.y === enPassantTarget.y+1);
            
          pieces.splice(pieces.indexOf(pieceAtDestination), 1);           
      } 
        return true;
      }
    } else if (Math.abs(dx) === 1 && piece.color === 'black' && dy === -1) {
      // Mover diagonalmente para capturar hacia adelante (solo para piezas negras)
      if (pieceAtDestination && pieceAtDestination.color !== piece.color) {
        return true;
      } else if (enPassantTarget  && piece.y===3 && y === enPassantTarget.y && x === enPassantTarget.x) {
        // Captura al paso (solo para piezas negras)
        if (enPassantTarget && x === enPassantTarget.x && 
          y === enPassantTarget.y && piece.type === PieceType.PAWN) {

          const pieceAtDestination = pieces.find((p) =>
            p.x === enPassantTarget.x && p.y === enPassantTarget.y-1 
            || p.x === enPassantTarget.x && p.y === enPassantTarget.y+1);
            
          pieces.splice(pieces.indexOf(pieceAtDestination), 1);           
      }
        return true;
      }
    }
    
    return false;
  };
  
  export function getPossiblePawnMoves(pawn, pieces, enPassantTarget) {
    const { x, y, color } = pawn;
    const possibleMoves = [];
  
    // Determinar la dirección de avance basada en el color del peón
    const forwardDirection = color === 'white' ? 1 : -1;
  
    // Función para agregar un movimiento si la casilla está desocupada
    const addMoveIfEmpty = (dx, dy) => {
      const targetX = x + dx;
      const targetY = y + dy;
      if (targetX >= 0 && targetX <= 7 && targetY >= 0 && targetY <= 7) {
        if (!pieces.some((p) => p.x === targetX && p.y === targetY)) {
          possibleMoves.push({ x: targetX, y: targetY });
        }
      }
    };
  
    // Mover una casilla hacia adelante
    addMoveIfEmpty(0, forwardDirection);
  
    // En el primer movimiento, el peón puede mover dos casillas hacia adelante si no hay piezas en el camino
    if ((color === 'white' && y === 1) || (color === 'black' && y === 6)) {
      // Verificar si tanto la casilla intermedia como la final están vacías
      const intermediateY = y + forwardDirection;
      const finalY = y + 2 * forwardDirection;
      const intermediateCell = pieces.find(p => p.x === x && p.y === intermediateY);
      const finalCell = pieces.find(p => p.x === x && p.y === finalY);
      if (!intermediateCell && !finalCell) {
        possibleMoves.push({ x, y: finalY });
      }
    }
  
    // Movimiento al paso
    if (enPassantTarget) {
      const targetX = enPassantTarget.x;
      const targetY = enPassantTarget.y;
  
      // Verificar si la casilla adyacente en diagonal al peón tiene una pieza enemiga
      if (
        (targetX === x + 1 || targetX === x - 1) &&
        targetY === y + forwardDirection && (y === 3 || y === 4)
      ) {
        possibleMoves.push({ x: targetX, y: targetY });
      }
    }
  
    return possibleMoves;
  }
  
  
  export function getPossiblePawnMovesKing(pawn, pieces) {
    const { x, y, color } = pawn;
    const possibleMoves = [];
  
    // Determinar la dirección de avance basada en el color del peón
    const forwardDirection = color === 'white' ? 1 : -1;
  
    // Función para agregar un movimiento si la casilla está desocupada
    const addMoveIfEmpty = (dx, dy) => {
      const targetX = x + dx;
      const targetY = y + dy;
      if (targetX >= 0 && targetX <= 7 && targetY >= 0 && targetY <= 7) {
        if (!pieces.some((p) => p.x === targetX && p.y === targetY)) {
          possibleMoves.push({ x: targetX, y: targetY });
        }
      }
    };
  
    // Función para agregar un movimiento de captura si la casilla está ocupada por una pieza enemiga
    const addCaptureMove = (dx, dy) => {
      const targetX = x + dx;
      const targetY = y + dy;
      if (targetX >= 0 && targetX <= 7 && targetY >= 0 && targetY <= 7) {
        const targetPiece = pieces.find((p) => p.x === targetX && p.y === targetY);
        if (targetPiece && targetPiece.color !== color) {
          possibleMoves.push({ x: targetX, y: targetY });
        }
      }
    };
  
    // Mover una casilla hacia adelante
    addMoveIfEmpty(0, forwardDirection);
  
    // En el primer movimiento, el peón puede mover dos casillas hacia adelante
    if ((color === 'white' && y === 1) || (color === 'black' && y === 6)) {
      addMoveIfEmpty(0, 2 * forwardDirection);
    }
  
    // Capturas diagonales
    addCaptureMove(1, forwardDirection);
    addCaptureMove(-1, forwardDirection);
  
    return possibleMoves;
  }
  
  
  // Función para calcular las casillas atacadas por un peón
  export const getPossiblePawnCaptures = (pawn, pieces) => {
    const { x, y, color } = pawn;
    const possibleCaptures = [];
  
    // Determinar la dirección de avance basada en el color del peón
    const forwardDirection = color === 'white' ? 1 : -1;
  
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
  
    // Captura en diagonal izquierda
    addCaptureIfEnemyPiece(-1, forwardDirection);
  
    // Captura en diagonal derecha
    addCaptureIfEnemyPiece(1, forwardDirection);
    
  
    return possibleCaptures;
  };
  
  
  
  
  