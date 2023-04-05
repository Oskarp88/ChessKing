import {TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileIsOccupied, tileIsOccupiedByOpponent, tilesIsEmptyOrOccupiedByOpponent } from "./generatePiece";

export const kingMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    // console.log(`desiredX: ${desiredPosition.x} - initialX ${initialPosition.x} === ? && desiretY ${desiredPosition.y} - initialY ${initialPosition.y} === ?`);
    // console.log('Rey');
    const array = [{x:'a'},{x:'b'},{x:'c'},{x:'d'},{x:'e'},{x:'f'},{x:'g'},{x:'h'}];
    for (let i = 0; i < array.length; i++) {
        if(i === initialPosition.x ){
        console.log(`movimiento previo: R${array[i].x}${initialPosition.y+1}`);            
        }
        if(i === desiredPosition.x){
            console.log(`movimiento actual: R${array[i].x}${desiredPosition.y+1}`);
        }
    }

    for(let i = 1; i < 2; i++){

        let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
        let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;

        let passedPosition = new Position(initialPosition.x + (i * multiplierX), initialPosition.y + (i * multiplierY))

        if(passedPosition.samePosition(desiredPosition)){
            if(tilesIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){                   
                return true;
            }
            if(tileIsOccupied(desiredPosition, boardState)){
                //console.log('we can strike enemy');
                return true;
            }
        }
    }
   
    return false;
}

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const posibleMoves: Position[] = [];
    
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x, king.position.y + i)

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
        const destination = new Position(king.position.x, king.position.y - i)

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
        const destination = new Position(king.position.x + i, king.position.y)

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
        const destination = new Position(king.position.x - i, king.position.y)

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
        const destination = new Position(king.position.x + i, king.position.y + i);

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
        const destination = new Position(king.position.x + i, king.position.y - i);

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
        const destination = new Position(king.position.x - i, king.position.y + i);

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
        const destination = new Position(king.position.x - i, king.position.y - i);

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

export const getCastlingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const posibleMoves: Position[] = [];

    if(king.hasMoved) return posibleMoves;

    //we get the rooks from the king's team which haven't moved
    const rooks = boardState.filter(p => p.isRook && p.team === king.team && !p.hasMoved);

    //Loop through the rooks
    for(const rook of rooks){
        //determine if we need to go to the right or the left side
        const direction = (rook.position.x - king.position.x > 0) ? 1 : -1;

        const adjecentPosition = king.position.clone();
        adjecentPosition.x += direction;

        if(!rook.posibleMoves?.some(m=>m.samePosition(adjecentPosition))) continue;

        //we know that the rook can  move to the adjacent side of the king

        const conceringTiles = rook.posibleMoves.filter(m=>m.y===king.position.y);

        //Checking if any of the enemy pieces can attack the spaces between
        //the rook and the king
        const enemyPieces = boardState.filter(p=> p.team !== king.team);

        let valid = true;

        for(const enemy of enemyPieces){
            if(enemy.posibleMoves === undefined) continue; 

            for(const move of enemy.posibleMoves){
                if(conceringTiles.some(t => t.samePosition(move))){
                    valid = false;
                }

                if(!valid) break;
            }

            if(!valid) break;
        }

        if(!valid) break;
    
    }

    return posibleMoves;
}
