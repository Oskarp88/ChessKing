export const isMoveValidForKnight = (piece, x, y, pieces) => {
    const deltaX = Math.abs(x - piece.x);
    const deltaY = Math.abs(y - piece.y);
  
    // El caballo se mueve en "L" de 2 casillas en una dirección y 1 casilla en la otra dirección.
    // Por lo tanto, la suma de los cambios en X y Y debe ser 3, y ninguno de los cambios debe ser 0.
  
    if ((deltaX === 1 && deltaY === 2) || (deltaX === 2 && deltaY === 1)) {
        const targetPiece = pieces.find((p) => p.x === x && p.y === y);

        if (!targetPiece || targetPiece.color !== piece.color) {
          // Actualiza hasMoved a true solo si el caballo no se ha movido antes
            if (!piece.hasMoved) {
              piece.hasMoved = true;
            }
          return true; // El movimiento cumple con la forma "L" y no está ocupado por una pieza del mismo color.
        }
    
    }
  
    return false; // El movimiento no es válido
  };
  
  export const getPossibleKnightMoves = (piece, pieces) => {
    const possibleMoves = [];
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

  export const getPossibleKnightMovesKing = (piece, pieces) => {
    const possibleMoves = [];
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
          // Verificar si la pieza en la casilla ocupada es del color opuesto para considerarla como una captura.
          const isOpponentPiece = pieces.some((p) => p.x === x && p.y === y && p.color !== piece.color);
  
          if (isOpponentPiece) {
            possibleMoves.push({ x, y });
          }
        }
      }
    }
  
    return possibleMoves;
  };
  
  
  // Función para calcular las posibles capturas de un caballo
export const getPossibleKnightCaptures = (knight, pieces) => {
  const { x, y, color } = knight;
  const possibleCaptures = [];

  // Las ocho posibles direcciones en las que un caballo puede moverse en forma de "L"
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

  // Iterar a través de las ocho posibles direcciones de movimiento del caballo
  for (const move of knightMoves) {
    addCaptureIfEnemyPiece(move.dx, move.dy);
  }

  return possibleCaptures;
};

  