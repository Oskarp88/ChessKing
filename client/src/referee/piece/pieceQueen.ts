import { Position, samePosition, TeamType } from "../../Constants";
import { Piece } from "../../models/Piece";
import { tileIsOccupied, tileIsOccupiedByOpponent, tilesIsEmptyOrOccupiedByOpponent } from "./generatePiece";

export const queenMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {

    const array = [{x:'a'},{x:'b'},{x:'c'},{x:'d'},{x:'e'},{x:'f'},{x:'g'},{x:'h'}];
    for (let i = 0; i < array.length; i++) {
        if(i === initialPosition.x ){
        console.log(`movimiento previo: D${array[i].x}${initialPosition.y+1}`);            
        }
        if(i === desiredPosition.x){
            console.log(`movimiento actual: D${array[i].x}${desiredPosition.y+1}`);
        }
    }
    for(let i = 1; i < 8; i++){

        //diagonal 
        let multipierX; // = (desiredPosition.x < initialPosition.x) ? -1 : 1;
        let multipierY; // = (desiredPosition.y < initialPosition.y) ? -1 : 1;  
        
        if(desiredPosition.x < initialPosition.x){
            multipierX = -1;
        }else if(desiredPosition.x > initialPosition.x){
            multipierX = 1;
        }else{
            multipierX = 0;
        }

        if(desiredPosition.y < initialPosition.y){
            multipierY = -1;
        }else if(desiredPosition.y > initialPosition.y){
            multipierY = 1;
        }else{
            multipierY = 0;
        }


        let passedPosition: Position = {x: initialPosition.x + (i*multipierX), y: initialPosition.y + (i*multipierY)};
        
        if(samePosition(passedPosition, desiredPosition)){
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
    return false;
}

export const getPossibleQueenMoves = (queen: Piece, boardState: Piece[]): Position[] => {
    const posibleMoves: Position[] = [];
    
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x, y: queen.position.y + i}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x, y: queen.position.y - i}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x + i, y: queen.position.y}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x - i, y: queen.position.y}

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x + i, y: queen.position.y + i};

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x + i, y: queen.position.y - i};

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x - i, y: queen.position.y + i};

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination: Position = {x: queen.position.x - i, y: queen.position.y - i};

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, queen.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    return posibleMoves;
}