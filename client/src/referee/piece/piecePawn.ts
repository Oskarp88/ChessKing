import { PieceType, TeamType } from "../../Types";
import { Piece, Position } from "../../models";
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
        !tileIsOccupied(new Position(desiredPosition.x, desiredPosition.y - pawnDirection),boardState)){
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

    const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection)
    const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection)
    const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection)
    const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection)
    const leftPosition = new Position(pawn.position.x -1, pawn.position.y);
    const rightPosition = new Position(pawn.position.x +1, pawn.position.y);  
    if(!tileIsOccupied(normalMove, boardState)){
        possibleMoves.push(normalMove);
        
        if(pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)){
            possibleMoves.push(specialMove);
        }
    }
     
    if(tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)){
        possibleMoves.push(upperLeftAttack);
    }else if(!tileIsOccupied(upperLeftAttack, boardState)){
        const leftPiece = boardState.find(p => p.position.samePosition(leftPosition));
        if(leftPiece != null && leftPiece.type === PieceType.PAWN && leftPiece.enPassant){
           possibleMoves.push(upperLeftAttack);
        }
    }
    if(tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)){
        possibleMoves.push(upperRightAttack);
    }else if(!tileIsOccupied(upperRightAttack, boardState)){
         const rightPiece = boardState.find(p => p.position.samePosition(rightPosition));
         if(rightPiece != null && rightPiece.type === PieceType.PAWN && rightPiece.enPassant){
            possibleMoves.push(upperRightAttack);
         }
    }
    return possibleMoves;
}