import { Position, TeamType } from "../../Constants";
import { Piece } from "../../models/Piece";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./generatePiece";

export const kingMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    console.log(`desiredX: ${desiredPosition.x} - initialX ${initialPosition.x} === ? && desiretY ${desiredPosition.y} - initialY ${initialPosition.y} === ?`);
    console.log('Rey');
    const array = [{x:'a'},{x:'b'},{x:'c'},{x:'d'},{x:'e'},{x:'f'},{x:'g'},{x:'h'}];
    for (let i = 0; i < array.length; i++) {
        if(i === initialPosition.x ){
        console.log(`movimiento previo: R${array[i].x}${initialPosition.y+1}`);            
        }
        if(i === desiredPosition.x){
            console.log(`movimiento actual: R${array[i].x}${desiredPosition.y+1}`);
        }
    }

    let multiplierX;
    let multiplierY;

    if(desiredPosition.x < initialPosition.x){
        multiplierX = -1;
    }else if(desiredPosition.x > initialPosition.x){
        multiplierX = 1;
    }else{
        multiplierX = 0;
    }

    if(desiredPosition.y < initialPosition.y){
        multiplierY = -1;
    }else if(desiredPosition.y > initialPosition.y){
        multiplierY = 1;
    }else{
        multiplierY = 0;
    }

    if(desiredPosition.x - initialPosition.x === multiplierX && desiredPosition.y - initialPosition.y === multiplierY){
        if(!tileIsOccupied(desiredPosition, boardState)){                   
            return true;
        }
        if(tileIsOccupiedByOpponent(desiredPosition, boardState,team)){
            //console.log('we can strike enemy');
            return true;
        }
    }
   
    return false;
}

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const posibleMoves: Position[] = [];
    
    for(let i = 1; i < 2; i++){
        const destination: Position = {x: king.position.x, y: king.position.y + i}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination: Position = {x: king.position.x, y: king.position.y - i}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination: Position = {x: king.position.x + i, y: king.position.y}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination: Position = {x: king.position.x - i, y: king.position.y}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination: Position = {x: king.position.x + i, y: king.position.y + i};

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination: Position = {x: king.position.x + i, y: king.position.y - i};

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination: Position = {x: king.position.x - i, y: king.position.y + i};

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 2; i++){
        const destination: Position = {x: king.position.x - i, y: king.position.y - i};

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    return posibleMoves;
}
