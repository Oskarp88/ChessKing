import { PieceType, TeamType } from "../Types";
import { getCastlingMoves, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnigthMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "../referee/piece";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";


export class Board {
    pieces: Piece[];
    totalTurns: number;
    winningTeam?: TeamType;

    constructor(pieces: Piece[], totalTurns: number) {
        this.pieces = pieces;
        this.totalTurns = totalTurns;
    }

    get currentTeam(): TeamType {
        return this.totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;
    }

    calculateAllMoves() {
        // Calculate the moves of all the pieces
        for (const piece of this.pieces) {
            piece.posibleMoves = this.getValidMoves(piece, this.pieces)
        }

        // Calculate castling moves
        for (const king of this.pieces.filter(p => p.isKing)) {
            if(king.posibleMoves === undefined) continue;

            king.posibleMoves = [...king.posibleMoves, ...getCastlingMoves(king, this.pieces)];
        }

        // Check if the current team moves are valid
        this.checkCurrentTeamMoves();

        // Remove the posibble moves for the team that is not playing
        for (const piece of
            this.pieces.filter(p => p.team !== this.currentTeam)) {
            piece.posibleMoves= [];
        }

         // Check if the playing team still has moves left
        // Otherwise, checkmate!
        if (this.pieces.filter(p => p.team === this.currentTeam)
            .some(p => p.posibleMoves !== undefined && p.posibleMoves.length > 0)) return;

        this.winningTeam = (this.currentTeam === TeamType.OUR) ? TeamType.OPPONENT : TeamType.OUR;
    }



    checkCurrentTeamMoves() {
        // Loop through all the current team's pieces
        // Recorre todas las piezas del equipo actual
        for (const piece of this.pieces.filter(p => p.team === this.currentTeam)) {           
            if (piece.posibleMoves === undefined) continue;

            // Simulate all the piece moves
            // Simular todos los movimientos de la pieza
            for (const move of piece.posibleMoves) {
                const simulatedBoard = this.clone();

                // Remove the piece at the destination position
                // Retire la pieza en la posición de destino
                simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !p.samePosition(move));
                // Obtener la pieza del tablero clonado
                // Get the piece of the cloned board
                const clonedPiece = simulatedBoard.pieces.find(p => p.samePiecePosition(piece))!;
                clonedPiece.position = move.clone();
                // Consigue el rey del tablero clonado
                // Get the king of the cloned board
                const clonedKing = simulatedBoard.pieces.find(p => p.isKing && p.team === simulatedBoard.currentTeam)!;
                
                // Loop through all enemy pieces, update their possible moves
                // And check if the current team's king will be in danger
                // Recorre todas las piezas enemigas, actualiza sus posibles movimientos
                // Y comprobar si el rey del equipo actual estará en peligro
                for (const enemy of simulatedBoard.pieces.filter(p => p.team !== simulatedBoard.currentTeam)) {
                    enemy.posibleMoves = simulatedBoard.getValidMoves(enemy, simulatedBoard.pieces);

                    if (enemy.isPawn) {
                        if (enemy.posibleMoves.some(m => m.x !== enemy.position.x
                            && m.samePosition(clonedKing.position))) {
                            piece.posibleMoves = piece.posibleMoves?.filter(m => !m.samePosition(move));
                            
                        }
                    } else {
                        if (enemy.posibleMoves.some(m => m.samePosition(clonedKing.position))) {
                            piece.posibleMoves = piece.posibleMoves?.filter(m => !m.samePosition(move));
                        }
                    }
                }
            }
        }
    }

    getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
        switch (piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.KNIGTH:
                return getPossibleKnigthMoves(piece, boardState);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.KING:
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }

    playMove(enPassantMove: boolean,
        validMove: boolean,
        playedPiece: Piece,
        destination: Position): boolean {
        const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;
        const destinationPiece = this.pieces.find(p => p.samePosition(destination));

        // If the move is a castling move do this
        if (playedPiece.isKing && destinationPiece?.isRook
            && destinationPiece.team === playedPiece.team) {
            const direction = (destinationPiece.position.x - playedPiece.position.x > 0) ? 1 : -1;
            const newKingXPosition = playedPiece.position.x + direction * 2;
            this.pieces = this.pieces.map(p => {
                if (p.samePiecePosition(playedPiece)) {
                    p.position.x = newKingXPosition;
                } else if (p.samePiecePosition(destinationPiece)) {
                    p.position.x = newKingXPosition - direction;
                }

                return p;
            });

            this.calculateAllMoves();
            return true;
        }

        if (enPassantMove) {
            this.pieces = this.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(playedPiece)) {
                    if (piece.isPawn)
                        (piece as Pawn).enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;
                    results.push(piece);
                } else if (
                    !piece.samePosition(new Position(destination.x, destination.y - pawnDirection))
                ) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }

                return results;
            }, [] as Piece[]);

            this.calculateAllMoves();
        } else if (validMove) {
            //UPDATES THE PIECE POSITION
            //AND IF A PIECE IS ATTACKED, REMOVES IT
            this.pieces = this.pieces.reduce((results, piece) => {
                // Piece that we are currently moving
                if (piece.samePiecePosition(playedPiece)) {
                    //SPECIAL MOVE
                    if (piece.isPawn)
                        (piece as Pawn).enPassant =
                            Math.abs(playedPiece.position.y - destination.y) === 2 &&
                            piece.type === PieceType.PAWN;
                        piece.position.x = destination.x;
                        piece.position.y = destination.y;
                        piece.hasMoved = true;
                        results.push(piece);
                } else if (!piece.samePosition(destination)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }

                // The piece at the destination location
                // Won't be pushed in the results
                return results;
            }, [] as Piece[]);

            this.calculateAllMoves();
        } else {
            return false;
        }

        return true;
    }

    clone(): Board {
        return new Board(this.pieces.map(p => p.clone()),
            this.totalTurns);
    }
}


