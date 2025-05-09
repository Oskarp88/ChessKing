import { AnyAction } from "redux";

export enum PieceType {
    PAWN = 'pawn',
    BISHOP = 'bishop',
    KNIGHT = 'nigth',
    ROOK = 'rook',
    QUEEN = 'queen',
    KING = 'king'
}

export enum TeamType{
    OPPONENT = 'd',
    OUR = 'l',
}

export interface Move {
  x: number;
  y: number;
}

export interface EnPassantTarget {
  x: number;
  y: number;
}

export interface FormData {
    // ...definición de las propiedades de los datos del formulario
  }
  
  export interface RegistrationState {
    formData: FormData;
    // ...otras propiedades del estado de registro
  }
  
  export interface RegisterUserAction extends AnyAction {
    type: 'REGISTER_USER';
    payload: FormData;
  }