import { PieceType } from "../../../Types";

export interface Piece {
    type: PieceType; 
    color: String;
    x: number;
    y: number;
    hasMoved?: boolean;
    image?: string; 
  }