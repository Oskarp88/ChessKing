const initializeBoard = () => {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  
    // Pawns
    for (let i = 0; i < 8; i++) {
      newBoard[6][i] = { type: "pawn", isWhite: false, imagePath: "assets/pieces/images01/bp.png" };
      newBoard[1][i] = { type: "pawn", isWhite: true, imagePath: "assets/pieces/images01/wp.png" };
    }
  
    // Rooks
    newBoard[7][0] = newBoard[7][7] = { type: "rook", isWhite: false, imagePath: "assets/pieces/images01/br.png" };
    newBoard[0][0] = newBoard[0][7] = { type: "rook", isWhite: true, imagePath: "assets/pieces/images01/wr.png" };
  
    // Knights
    newBoard[7][1] = newBoard[7][6] = { type: "knight", isWhite: false, imagePath: "assets/pieces/images01/bn.png" };
    newBoard[0][1] = newBoard[0][6] = { type: "knight", isWhite: true, imagePath: "assets/pieces/images01/wn.png" };
  
    // Bishops
    newBoard[7][2] = newBoard[7][5] = { type: "bishop", isWhite: false, imagePath: "assets/pieces/images01/bb.png" };
    newBoard[0][2] = newBoard[0][5] = { type: "bishop", isWhite: true, imagePath: "assets/pieces/images01/wb.png" };
  
    // Queens
    newBoard[7][3] = { type: "queen", isWhite: false, imagePath: "assets/pieces/images01/bq.png" };
    newBoard[0][3] = { type: "queen", isWhite: true, imagePath: "assets/pieces/images01/wq.png" };
  
    // Kings
    newBoard[7][4] = { type: "king", isWhite: false, imagePath: "assets/pieces/images01/bk.png" };
    newBoard[0][4] = { type: "king", isWhite: true, imagePath: "assets/pieces/images01/wk.png" };
  
    return newBoard;
  };
  
  export default initializeBoard;
  