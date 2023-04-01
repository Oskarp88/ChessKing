import { Piece } from "./models/Piece";
import { Position } from "./models/Position";

export const VERTICAL_AXIS = ["1","2","3","4","5","6","7","8"];
export const HORIZONTAL_AXIS = ["a","b","c","d","e","f","g","h"];

export const GRID_SIZE = 75;

export function samePosition(p1: Position, p2: Position){
    return p1.x === p2.x && p1.y === p2.y;
}

export enum PieceType {
    PAWN = 'pawn',
    BISHOP = 'bishop',
    KNIGTH = 'nigth',
    ROOK = 'rook',
    QUEEN = 'queen',
    KING = 'king'
}

export enum TeamType{
    OPPONENT = 'd',
    OUR = 'l',
}

export const initialBoardState: Piece[] = [
    new Piece(
        {
            x: 7,
            y: 0,
        },
        PieceType.ROOK,
        TeamType.OUR),
    new Piece(
        {
            x: 0,
            y: 0,
        },
        PieceType.ROOK,
        TeamType.OUR,  ),
    new Piece(
        {
            x: 1,
            y: 0,
        },
        PieceType.KNIGTH,
        TeamType.OUR, ),
    new Piece(
        {
            x: 6,
            y: 0,
        },
        PieceType.KNIGTH,
        TeamType.OUR, ),
    new Piece(
        {
            x: 2,
            y: 0,
        },
        PieceType.BISHOP,
        TeamType.OUR,  ),
    new Piece(
        {
            x: 5,
            y: 0,
        },
        PieceType.BISHOP,
        TeamType.OUR, ),
    new Piece(
        {
            x: 3,
            y: 0,
        },
        PieceType.QUEEN,
        TeamType.OUR,  ),
    new Piece(
    {
        x: 4,
        y: 0,
    },
        PieceType.KING,
        TeamType.OUR, ),
    new Piece(
        {
            x: 7,
            y: 7,
        },
        PieceType.ROOK,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 0,
            y: 7,
        },
        PieceType.ROOK,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 1,
            y: 7,
        },
        PieceType.KNIGTH,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 6,
            y: 7,
        },
        PieceType.KNIGTH,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 2,
            y: 7,
        },
        PieceType.BISHOP,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 5,
            y: 7,
        },
        PieceType.BISHOP,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 3,
            y: 7,
        },
        PieceType.QUEEN,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 4,
            y: 7,
        },
        PieceType.KING,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 0,
            y: 1,
        },
        PieceType.PAWN,
        TeamType.OUR),
    new Piece(
        {
            x: 1,
            y: 1,
        },
        PieceType.PAWN,
        TeamType.OUR),
    new Piece(
        {
            x: 2,
            y: 1,
        },
        PieceType.PAWN,
        TeamType.OUR),
    new Piece(
        {
            x: 3,
            y: 1,
        },
        PieceType.PAWN,
        TeamType.OUR),
    new Piece(
        {
            x: 4,
            y: 1,
        },
        PieceType.PAWN,
        TeamType.OUR),
    new Piece(
        {
            x: 5,
            y: 1,
        },
        PieceType.PAWN,
        TeamType.OUR),
    new Piece(
        {
            x: 6,
            y: 1,
        },
        PieceType.PAWN,
        TeamType.OUR),
    new Piece(
        {
            x: 7,
            y: 1,
        },
        PieceType.PAWN,
        TeamType.OUR),
    new Piece(
        {
            x: 0,
            y: 6,
        },
        PieceType.PAWN,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 1,
            y: 6,
        },
        PieceType.PAWN,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 2,
            y: 6,
        },
        PieceType.PAWN,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 3,
            y: 6,
        },
        PieceType.PAWN,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 4,
            y: 6,
        },
        PieceType.PAWN,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 5,
            y: 6,
        },
        PieceType.PAWN,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 6,
            y: 6,
        },
        PieceType.PAWN,
        TeamType.OPPONENT),
    new Piece(
        {
            x: 7,
            y: 6,
        },
        PieceType.PAWN,
        TeamType.OPPONENT),
];
