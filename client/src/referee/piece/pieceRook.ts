import { Position, TeamType } from "../../Constants";
import { Piece } from "../../models/Piece";
import { tileIsOccupied, tileIsOccupiedByOpponent, tilesIsEmptyOrOccupiedByOpponent } from "./generatePiece";

 export const rookMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {

    console.log(`desiredX: ${desiredPosition.x} - initialX ${initialPosition.x} === ? && desiretY ${desiredPosition.y} - initialY ${initialPosition.y} === ?`);

    const array = [{x:'a'},{x:'b'},{x:'c'},{x:'d'},{x:'e'},{x:'f'},{x:'g'},{x:'h'}];
    for (let i = 0; i < array.length; i++) {
        if(i === initialPosition.x ){
        console.log(`movimiento previo: T${array[i].x}${initialPosition.y+1}`);            
        }
        if(i === desiredPosition.x){
            console.log(`movimiento actual: T${array[i].x}${desiredPosition.y+1}`);
        }
    }

    if(initialPosition.x === desiredPosition.x){

        for(let i = 1; i < 8; i++){
            let multipier = (desiredPosition.y < initialPosition.y) ? -1 : 1;
            let passedPosition: Position = { x: initialPosition.x, y: initialPosition.y + (i*multipier)};
            if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y){
                if(tilesIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                    return true;
                }
            }else{
                if(tileIsOccupied(passedPosition, boardState)){
                    break;
                }
            }
        }           
   }
   if(desiredPosition.y === initialPosition.y){
    
    for(let i = 1; i < 8; i++){
        let multipier = (desiredPosition.x < initialPosition.x) ? -1 : 1;
        let passedPosition: Position = { x: initialPosition.x + (i*multipier), y: initialPosition.y };
            if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y){
                if(tilesIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                    return true;
                }
            }else{
                if(tileIsOccupied(passedPosition, boardState)){
                    break;
                }
            }
    }
  
   }
    return false;
}

export const getPossibleRookMoves = (rook: Piece, boardState: Piece[]): Position[] => {
    const posibleMoves: Position[] = [];
    
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: rook.position.x, y: rook.position.y + i}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: rook.position.x, y: rook.position.y - i}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: rook.position.x + i, y: rook.position.y}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: rook.position.x - i, y: rook.position.y}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    return posibleMoves;
}
