import {TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileIsOccupied, tileIsOccupiedByOpponent, tilesIsEmptyOrOccupiedByOpponent } from "./generatePiece";

export const bishopMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    // console.log("Alfil"); 
    //    console.log(`desiredX: ${desiredPosition.x} - initialX ${initialPosition.x} === ? && desiretY ${desiredPosition.y} - initialY ${initialPosition.y} === ?`);
    const array = [{x:'a'},{x:'b'},{x:'c'},{x:'d'},{x:'e'},{x:'f'},{x:'g'},{x:'h'}];
    for (let i = 0; i < array.length; i++) {
        if(i === initialPosition.x ){
        console.log(`movimiento previo: A${array[i].x}${initialPosition.y+1}`);            
        }
        if(i === desiredPosition.x){
            console.log(`movimiento actual: A${array[i].x}${desiredPosition.y+1}`);
        }
    }

       for (let i = 1; i < 8; i++) {
        if(desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y){
            
            let passedPosition = new Position(initialPosition.x + i, initialPosition.y + i);
            
                if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y){
                //Dealing with destination tile
                    if(tilesIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                        return true;
                    }
                }else {
                //Dealing with passing tile
                   if(tileIsOccupied(passedPosition, boardState)){
                      break;
                   }
                }
                
        }

         if(desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y){
            let passedPosition = new Position(initialPosition.x - i, initialPosition.y - i);
            if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y){
                //Dealing with destination tile
                    if(tilesIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                        return true;
                    }
                }else {
                //Dealing with passing tile
                   if(tileIsOccupied(passedPosition, boardState)){
                      break;
                   }
                }
                
         }

         if(desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y){
            let passedPosition = new Position(initialPosition.x + i, initialPosition.y - i);
            if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y){
                //Dealing with destination tile
                    if(tilesIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                        return true;
                    }
                }else {
                //Dealing with passing tile
                   if(tileIsOccupied(passedPosition, boardState)){
                      break;
                   }
                }
                
         }

        if(desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y){
            let passedPosition = new Position(initialPosition.x - i, initialPosition.y + i);
            if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y){
                //Dealing with destination tile
                    if(tilesIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                        return true;
                    }
                }else {
                //Dealing with passing tile
                   if(tileIsOccupied(passedPosition, boardState)){
                      break;
                   }
                }
                
        }
      }
    return false;
}

export const getPossibleBishopMoves = (bishop: Piece, boardState: Piece[]): Position[] => {
    const posibleMoves: Position[] = [];

    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x + i, bishop.position.y + i);

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x + i, bishop.position.y - i);

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x - i, bishop.position.y + i);

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x - i, bishop.position.y - i);

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    return posibleMoves;
}