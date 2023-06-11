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
         }else {
            if(tileIsOccupied(desiredPosition, boardState)){
                //console.log('we can strike enemy');           
                break;
            }
        }
        
    }
   
    return false;
}

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const posibleMoves: Position[] = [];
    // Movimiento superior
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x, king.position.y + i)
         
        // If the move is outside of the board don't add it
        // Si el movimiento está fuera del tablero, no lo agregue
        if(destination.x < 0 || destination.x > 7 
            || destination.y < 0 || destination.y > 7) {
              break;
          }
      
        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    // Movimiento de fondo
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x, king.position.y - i)

        // Si el movimiento está fuera del tablero, no lo agregue
        if(destination.x < 0 || destination.x > 7 
            || destination.y < 0 || destination.y > 7) {
              break;
          }

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    // movimiento derecho
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x + i, king.position.y)

        if(destination.x < 0 || destination.x > 7 
            || destination.y < 0 || destination.y > 7) {
              break;
          }

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //movimiento izquierdo
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x - i, king.position.y)
        
        if(destination.x < 0 || destination.x > 7 
            || destination.y < 0 || destination.y > 7) {
              break;
          }

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }

//Movimiento superior derecho
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x + i, king.position.y + i);
        
        if(destination.x < 0 || destination.x > 7 
            || destination.y < 0 || destination.y > 7) {
              break;
          }

        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }// Movimiento abajo a la derecha
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x + i, king.position.y - i);

        if(destination.x < 0 || destination.x > 7 
            || destination.y < 0 || destination.y > 7) {
              break;
          }
      
        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //movimiento superior a la izquierda
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x - i, king.position.y + i);

        if(destination.x < 0 || destination.x > 7 
            || destination.y < 0 || destination.y > 7) {
              break;
          }
      
        if(!tileIsOccupied(destination, boardState)){
            posibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            posibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //movimiento inferior a la izquierda
    for(let i = 1; i < 2; i++){
        const destination = new Position(king.position.x - i, king.position.y - i);

        if(destination.x < 0 || destination.x > 7 
            || destination.y < 0 || destination.y > 7) {
              break;
          }
      
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

// En este método los movimientos enemigos ya han sido calculados
export const getCastlingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const posibleMoves: Position[] = [];

    if(king.hasMoved) return posibleMoves;

    //we get the rooks from the king's team which haven't moved
    //obtenemos las torres del equipo del rey que no se han movido
    const rooks = boardState.filter(p => 
        p.isRook && p.team === king.team && !p.hasMoved);

    //Loop through the rooks
    //Recorrer las torres
    for(const rook of rooks){
        //determine if we need to go to the right or the left side
        //determinar si necesitamos ir al lado derecho o al izquierdo
        const direction = (rook.position.x - king.position.x > 0) ? 1 : -1;

        const adjecentPosition = king.position.clone();
        adjecentPosition.x += direction;

        if(!rook.posibleMoves?.some(m=>m.samePosition(adjecentPosition))) continue;

        //we know that the rook can  move to the adjacent side of the king
        //sabemos que la torre puede moverse al lado adyacente del rey
        const conceringTiles = rook.posibleMoves.filter(m=>m.y===king.position.y);

        //Checking if any of the enemy pieces can attack the spaces between
        //the rook and the king
        //Comprobando si alguna de las piezas enemigas puede atacar los espacios entre
        //la torre y el rey
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

        // ¡Ahora queremos agregarlo como un posible movimiento!
        posibleMoves.push(rook.position.clone());
    
    }

    return posibleMoves;
}
