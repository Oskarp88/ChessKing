import { Position, TeamType } from "../../Constants";
import { Piece } from "../../models/Piece";
import {  tilesIsEmptyOrOccupiedByOpponent } from "./generatePiece";

export const knigthMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    //movimiento del caballo
    //8 posibles movimientos
    // console.log(`desiredX: ${desiredPosition.x} - initialX ${initialPosition.x} === -1 && desiretY ${desiredPosition.y} - initialY ${initialPosition.y} === 2`)
    const array = [{x:'a'},{x:'b'},{x:'c'},{x:'d'},{x:'e'},{x:'f'},{x:'g'},{x:'h'}];
    for (let i = 0; i < array.length; i++) {
        if(i === initialPosition.x ){
        console.log(`movimiento previo: C${array[i].x}${initialPosition.y+1}`);            
        }
        if(i === desiredPosition.x){
            console.log(`movimiento actual: C${array[i].x}${desiredPosition.y+1}`);
        }
    }
     if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === 2 || 
        desiredPosition.x - initialPosition.x === -2 && desiredPosition.y - initialPosition. y === 1 || 
        desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition. y === -2 ||
        desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition. y === 2 ||
        desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition. y === -2 ||
        desiredPosition.x - initialPosition.x === -2 && desiredPosition.y - initialPosition. y === -1 ||
        desiredPosition.x - initialPosition.x === 2 && desiredPosition.y - initialPosition. y === 1 ||
        desiredPosition.x - initialPosition.x === 2 && desiredPosition.y - initialPosition. y === -1){
        // console.log(`desiredX: ${desiredPosition.x} - initialX ${initialPosition.x} === -1 && desiretY ${desiredPosition.y} - initialY ${initialPosition.y} === 2`);
        //atacar pieza
        //mover pieza si el espacio esta libre
        if(tilesIsEmptyOrOccupiedByOpponent(desiredPosition, boardState,team)){
            //console.log('we can strike enemy');
            return true;
        }
      }
   return false;
}

export const getPossibleKnigthMoves = (knigth: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];
    
    for(let i = -1; i < 2; i += 2){
        for(let j = -1; j < 2; j += 2){
           const verticalMove: Position = {x: knigth.position.x + j, y: knigth.position.y + i * 2};
           const horizontalMove: Position = {x: knigth.position.x + i * 2, y: knigth.position.y + j};

           if(tilesIsEmptyOrOccupiedByOpponent(verticalMove, boardState, knigth.team)){
              possibleMoves.push(verticalMove);
           }
           if(tilesIsEmptyOrOccupiedByOpponent(horizontalMove, boardState, knigth.team)){
              possibleMoves.push(horizontalMove);
           }
        }
    }

    return possibleMoves;
}