
function getCellClass(i,j,selectedPiece, startCell, destinationCell, kingCheckCell, blackTile, whiteTile) {
    
    const isEven = (i + j) % 2 === 0;
    const isSelected = selectedPiece && selectedPiece.x === i && selectedPiece.y === j;
    const isStartCell = startCell && startCell.x === i && startCell.y === j;
    const isDestinationCell = destinationCell && destinationCell.x === i && destinationCell.y === j;

    const isKingCheckCell = kingCheckCell && kingCheckCell.x === i && kingCheckCell.y === j;

  if (isKingCheckCell) {
    return 'king-check-cell';
  }

    if (isSelected) {
      return 'selected-cell';
    } else if (isStartCell) {
      return 'start-cell';
    } else if (isDestinationCell) {
      return 'destination-cell';
    } 
    else{      
      return isEven ? blackTile : whiteTile;
    }
}

export default getCellClass;