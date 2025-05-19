  export const isMoveValidForBishop = (piece, x, y, pieces) => {
    const deltaX = Math.abs(x - piece.x);
    const deltaY = Math.abs(y - piece.y);
  
    // Un movimiento de alfil es válido si el cambio en X y el cambio en Y son iguales
    // (lo que significa que el alfil se mueve en diagonal) y no hay piezas en su camino.
  
    if (deltaX === deltaY) {
      // Verifica que no haya ninguna pieza en el camino del alfil
      for (let i = 1; i < deltaX; i++) {
        const targetX = piece.x + (x > piece.x ? i : -i);
        const targetY = piece.y + (y > piece.y ? i : -i);
  
        const isOccupied = pieces.some((p) => p.x === targetX && p.y === targetY);
  
        if (isOccupied) {
          return false; // El movimiento no es válido si hay una pieza en el camino.
        }
      }
  
      // Verifica si la casilla de destino está ocupada por una pieza del oponente o está vacía
      const targetPiece = pieces.find((p) => p.x === x && p.y === y);
      if (!targetPiece || targetPiece.color !== piece.color) {
        if (!piece.hasMoved) {
          piece.hasMoved = true;
        }
        return true; // El movimiento de alfil es válido.
      }
    }
  
    return false; // El movimiento no es válido.
  };  

  export const getPossibleBishopMoves = (piece, pieces) => {
    const possibleMoves = [];

    if (!piece) {
      // Manejar el caso donde la pieza es undefined
      console.error('La pieza es undefined en getPossibleBishopMoves');
      return [];
    }
  
    for (let dx = -1; dx <= 1; dx += 2) {
      for (let dy = -1; dy <= 1; dy += 2) {
        for (let i = 1; i < 8; i++) {
          const x = piece.x + i * dx;
          const y = piece.y + i * dy;
  
          if (x < 0 || x > 7 || y < 0 || y > 7) {
            // Check if the coordinates are out of the board bounds
            break;
          }
  
          const targetPiece = pieces.find((p) => p.x === x && p.y === y);
  
          if (targetPiece) {
            // If there is a piece at the target coordinates, break without adding it
            break;
          } else {
            // If the target square is empty, it's a valid move
            possibleMoves.push({ x, y });
          }
        }
      }
    }
  
    return possibleMoves;
  };
  export const getPossibleBishopMovesKing = (piece, pieces) => {
    const possibleMoves = [];
  
    if (!piece) {
      // Manejar el caso donde la pieza es undefined
      console.error('La pieza es undefined en getPossibleBishopMoves');
      return [];
    }
  
    for (let dx = -1; dx <= 1; dx += 2) {
      for (let dy = -1; dy <= 1; dy += 2) {
        for (let i = 1; i < 8; i++) {
          const x = piece.x + i * dx;
          const y = piece.y + i * dy;
  
          if (x < 0 || x > 7 || y < 0 || y > 7) {
            // Verificar si las coordenadas están fuera de los límites del tablero
            break;
          }
  
          const targetPiece = pieces.find((p) => p.x === x && p.y === y);
  
          if (targetPiece) {
            // Verificar si la pieza en la casilla de destino es del color opuesto para considerarla como una captura.
            if (targetPiece.color !== piece.color) {
              possibleMoves.push({ x, y });
            }
            
            // No puedes moverte más en esta dirección después de encontrar una pieza.
            break;
          } else {
            // Si la casilla de destino está vacía, es un movimiento válido
            possibleMoves.push({ x, y });
          }
        }
      }
    }
  
    return possibleMoves;
  };
  

  export const getPossibleBishopCaptures = (bishop, pieces) => {
    const possibleCaptures = [];
  
    for (let dx = -1; dx <= 1; dx += 2) {
      for (let dy = -1; dy <= 1; dy += 2) {
        for (let i = 1; i < 8; i++) {
          const x = bishop.x + i * dx;
          const y = bishop.y + i * dy;
  
          if (x < 0 || x > 7 || y < 0 || y > 7) {
            // Comprueba si las coordenadas están fuera de los límites del tablero
            break;
          }
  
          const targetPiece = pieces.find((p) => p.x === x && p.y === y);
  
          if (targetPiece) {
            if (targetPiece.color !== bishop.color) {
              // Si hay una pieza en las coordenadas de destino y es de un color diferente, es una posible captura.
              possibleCaptures.push({ x, y });
            }
            break; // Detén la búsqueda en esta dirección.
          }
        }
      }
    }
  
    return possibleCaptures;
  };
  
  