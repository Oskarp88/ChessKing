import { Piece, PieceType, Position, samePosition, TeamType } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./generatePiece";

export const pawnMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {

    const array = [{x:'a'},{x:'b'},{x:'c'},{x:'d'},{x:'e'},{x:'f'},{x:'g'},{x:'h'}];
    for (let i = 0; i < array.length; i++) {
        if(i === initialPosition.x ){
        console.log(`movimiento previo: ${array[i].x}${initialPosition.y+1}`);            
        }
        if(i === desiredPosition.x){
            console.log(`movimiento actual: ${array[i].x}${desiredPosition.y+1}`);
        }
    }

    const specialRow = (team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

    if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2*pawnDirection){
        if(!tileIsOccupied(desiredPosition,boardState) && 
        !tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - pawnDirection},boardState)){
            return true;
        }
    }else if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection){
        if(!tileIsOccupied(desiredPosition, boardState)){                   
            return true;
        }
    }  
    //atacar piezar
    else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection){
        
        //ataque izquierda
        console.log('izquierda');
        if(tileIsOccupiedByOpponent(desiredPosition, boardState,team)){
            //console.log('we can strike enemy');
            return true;
        }
    } else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection){
        //ataque por la derecha
        console.log('derecha');
        if(tileIsOccupiedByOpponent(desiredPosition, boardState,team)){
            //console.log('we can strike enemy');
            return true;
        }
    } 
    
    return false;

}


export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];
   
    const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;
    const specialRow = pawn.team === TeamType.OUR ? 1 : 6;

    const normalMove: Position = {x: pawn.position.x, y: pawn.position.y + pawnDirection}
    const specialMove: Position = {x: normalMove.x, y: normalMove.y + pawnDirection}
    const upperLeftAttack: Position = { x: pawn.position.x - 1, y: pawn.position.y + pawnDirection}
    const upperRightAttack: Position = {x: pawn.position.x + 1, y: pawn.position.y + pawnDirection}
    const leftPosition: Position = {x: pawn.position.x -1, y: pawn.position.y};
    const rightPosition: Position = {x: pawn.position.x +1, y: pawn.position.y};  
    if(!tileIsOccupied(normalMove, boardState)){
        possibleMoves.push(normalMove);
        
        if(pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)){
            possibleMoves.push(specialMove);
        }
    }
     
    if(tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)){
        possibleMoves.push(upperLeftAttack);
    }else if(!tileIsOccupied(upperLeftAttack, boardState)){
        const leftPiece = boardState.find(p => samePosition(p.position, leftPosition));
        if(leftPiece != null && leftPiece.type === PieceType.PAWN && leftPiece.enPassant){
           possibleMoves.push(upperLeftAttack);
        }
    }
    if(tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)){
        possibleMoves.push(upperRightAttack);
    }else if(!tileIsOccupied(upperRightAttack, boardState)){
         const rightPiece = boardState.find(p => samePosition(p.position, rightPosition));
         if(rightPiece != null && rightPiece.type === PieceType.PAWN && rightPiece.enPassant){
            possibleMoves.push(upperRightAttack);
         }
    }
    return possibleMoves;
}