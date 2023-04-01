import { samePosition, TeamType } from "../../Constants";
import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";

export const tilesIsEmptyOrOccupiedByOpponent = (position: Position, boardState: Piece[], team: TeamType) => {
    return (!tileIsOccupied(position, boardState) || tileIsOccupiedByOpponent(position, boardState, team));
 }

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean => {
     // console.log('Casilla ocupada');
     const piece = boardState.find((p) => samePosition(p.position, position));
     if(piece){
         return true;
     }else{
         return false
     }
 }

 export const tileIsOccupiedByOpponent = (position: Position, boardState: Piece[], team:TeamType): boolean => {
    const piece = boardState.find((p)=> samePosition(p.position, position) && p.team !== team)
    if(piece){
        return true;
     }else{
         return false
     }
 }