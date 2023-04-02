import { PieceType, TeamType } from "../Constants";
import { Position } from "./Position";

export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    team: TeamType;
    enPassant?: boolean;
    posibleMoves?: Position[];
    constructor( position: Position, type: PieceType, team: TeamType){
        this.image = `assets/images/Chess_${type[0]}${team}t60.png`;
        this.position = position;
        this.type = type;
        this.team = team;
    }
    samePiecePosition(otherPiece: Piece): boolean{
        return this.position.samePosition(otherPiece.position); 
    }

    samePosition(otherPosition: Position): boolean{
        return this.position.samePosition(otherPosition);
    }
}

