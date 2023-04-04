import { PieceType, TeamType } from "../Types";
import { Position } from "./Position";

export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    team: TeamType;
    posibleMoves?: Position[];
    hasMoved: boolean;
    constructor( position: Position, type: PieceType, team: TeamType, hasMoved: boolean, possibleMoves: Position[]=[]){
        this.image = `assets/images/Chess_${type[0]}${team}t60.png`;
        this.position = position;
        this.type = type;
        this.team = team;
        this.posibleMoves = possibleMoves;
        this.hasMoved = hasMoved;
    }

    isPawn(): boolean {
        return this.type === PieceType.PAWN;
    }

    isRook(): boolean {
        return this.type === PieceType.ROOK;
    }

    isBishop(): boolean {
        return this.type === PieceType.BISHOP;
    }

    isKnigth(): boolean {
        return this.type === PieceType.KNIGTH;
    }

    isQueen(): boolean {
        return this.type === PieceType.QUEEN;
    }
    
    isKing(): boolean {
        return this.type === PieceType.KING;
    }

    samePiecePosition(otherPiece: Piece): boolean{
        return this.position.samePosition(otherPiece.position); 
    }

    samePosition(otherPosition: Position): boolean{
        return this.position.samePosition(otherPosition);
    }
}

