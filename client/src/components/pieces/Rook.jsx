export const isMoveValidForRook = (piece, x, y, pieces) => {
  const deltaX = x - piece.x;
  const deltaY = y - piece.y;

  // La torre se mueve en línea recta, por lo que la suma de los cambios en X y Y debe ser igual a 0
  if (deltaX !== 0 && deltaY !== 0) {
    return false;
  }

  // Verifica si hay piezas en el camino de la torre
  if (deltaX !== 0) {
    const step = deltaX > 0 ? 1 : -1;
    for (let i = piece.x + step; i !== x; i += step) {
      if (pieces.some((p) => p.x === i && p.y === piece.y)) {
        return false; // Hay una pieza en el camino
      }
    }
  } else if (deltaY !== 0) {
    const step = deltaY > 0 ? 1 : -1;
    for (let j = piece.y + step; j !== y; j += step) {
      if (pieces.some((p) => p.x === piece.x && p.y === j)) {
        return false; // Hay una pieza en el camino
      }
    }
  }

  // Verifica si la casilla de destino está ocupada por una pieza enemiga o está vacía
  const pieceAtDestination = pieces.find((p) => p.x === x && p.y === y);
  if (pieceAtDestination) {
    return pieceAtDestination.color !== piece.color; // Puede capturar una pieza enemiga
  }
  if (!piece.hasMoved) {
    piece.hasMoved = true;
  }
  return true; // El movimiento es válido
};
  
  export const getPossibleRookMoves = (rook, pieces) => {
    const { x, y } = rook;
    const possibleMoves = [];
  
    // Direcciones de movimiento posibles para la torre: arriba, abajo, izquierda y derecha.
    const directions = [{ dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }];
  
    for (const direction of directions) {
      for (let step = 1; step < 8; step++) {
        const targetX = x + direction.dx * step;
        const targetY = y + direction.dy * step;
  
        if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) {
          // La casilla objetivo está fuera del tablero, por lo que no se pueden realizar más movimientos en esta dirección.
          break;
        }
  
        const pieceAtTarget = pieces.find((p) => p.x === targetX && p.y === targetY);
  
        if (pieceAtTarget) {
          // Hay una pieza en la casilla de destino, por lo que no puedes moverte más en esta dirección.
          break;
        }
  
        // Si la casilla de destino está vacía, puedes moverte a ella.
        possibleMoves.push({ x: targetX, y: targetY });
      }
    }
  
    return possibleMoves;
  };
  
  export const getPossibleRookMovesKing = (rook, pieces) => {
    const { x, y } = rook;
    const possibleMoves = [];
  
    // Direcciones de movimiento posibles para la torre: arriba, abajo, izquierda y derecha.
    const directions = [{ dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }];
  
    for (const direction of directions) {
      for (let step = 1; step < 8; step++) {
        const targetX = x + direction.dx * step;
        const targetY = y + direction.dy * step;
  
        if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) {
          // La casilla objetivo está fuera del tablero, por lo que no se pueden realizar más movimientos en esta dirección.
          break;
        }
  
        const pieceAtTarget = pieces.find((p) => p.x === targetX && p.y === targetY);
  
        if (pieceAtTarget) {
          // Verificar si la pieza en la casilla de destino es del color opuesto para considerarla como una captura.
          if (pieceAtTarget.color !== rook.color) {
            possibleMoves.push({ x: targetX, y: targetY });
          }
          
          // No puedes moverte más en esta dirección después de encontrar una pieza.
          break;
        }
  
        // Si la casilla de destino está vacía, puedes moverte a ella.
        possibleMoves.push({ x: targetX, y: targetY });
      }
    }
  
    return possibleMoves;
  };
  
  // Función para calcular las posibles capturas de una torre
export const getPossibleRookCaptures = (rook, pieces) => {
  const { x, y, color } = rook;
  const possibleCaptures = [];

  // Direcciones de movimiento posibles para la torre: arriba, abajo, izquierda y derecha.
  const directions = [{ dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }];

  for (const direction of directions) {
    for (let step = 1; step < 8; step++) {
      const targetX = x + direction.dx * step;
      const targetY = y + direction.dy * step;

      if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) {
        // La casilla objetivo está fuera del tablero, por lo que no se pueden realizar más capturas en esta dirección.
        break;
      }

      const pieceAtTarget = pieces.find((p) => p.x === targetX && p.y === targetY);

      if (pieceAtTarget) {
        // Hay una pieza enemiga en la casilla de destino, por lo que puedes capturarla y debes detenerte en esta dirección.
        if (pieceAtTarget.color !== color) {
          possibleCaptures.push({ x: targetX, y: targetY });
        }
        break;
      }
    }
  }

  return possibleCaptures;
};

