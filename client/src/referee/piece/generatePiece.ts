import { TeamType } from "../../Constants";
import { Piece, Position } from "../../models";


export const tilesIsEmptyOrOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType) => {
    return (!tileIsOccupied(position, boardState) || tileIsOccupiedByOpponent(position, boardState, team));
 }

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean => {
     // console.log('Casilla ocupada');
     const piece = boardState.find((p) => p.position.samePosition(position));
     if(piece){
         return true;
     }else{
         return false
     }
 }

 export const tileIsOccupiedByOpponent = (position: Position, boardState: Piece[], team:TeamType): boolean => {
    const piece = boardState.find((p)=> p.position.samePosition(position) && p.team !== team)
    if(piece){
        return true;
     }else{
         return false
     }
 }