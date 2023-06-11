import { initialBoard } from "../../Constants";
import ChessBoard from "../chessboard/ChessBoard";
import {useState, useRef, useEffect } from 'react';
import { bishopMove, 
        getPossibleBishopMoves, 
        getPossibleKingMoves, 
        getPossibleKnigthMoves, 
        getPossiblePawnMoves, 
        getPossibleQueenMoves, 
        getPossibleRookMoves, 
        kingMove, knigthMove, 
        pawnMove, queenMove, 
        rookMove } from "../../referee/piece";
import { Piece, Position } from "../../models";
import { PieceType, TeamType } from "../../Types";
import { Board } from "../../models/Board";
import { Pawn } from "../../models/Pawn";


export default function Referee(){
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);

    function playMove(playedPiece: Piece, destination: Position): boolean{
        //if the playing piece doesn´t have any moves return
        //si la pieza de juego no tiene ningún movimiento regresa
        if(playedPiece.posibleMoves === undefined) return false;

        //Prevent the inactive team from playing
        //Evitar que juegue el equipo inactivo
        if(playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1) return false;
        if(playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0) return false;

        let playedMoveIsValid = false;

        const validMove = playedPiece.posibleMoves?.some(m => m.samePosition(destination));

        if(!validMove) return false;

        const enPassantMove = isEnPassantMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team
        );

        //playMove modifiies the board thus we
        //need to call setBoard
        //playMove modifica el tablero por lo que
         // necesito llamar a setBoard
        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.totalTurns += 1;
            //playing the  move
            playedMoveIsValid = clonedBoard.playMove(
                enPassantMove,
                validMove, 
                playedPiece, 
                destination);
            
            if(clonedBoard.winningTeam !== undefined) {
                checkmateModalRef.current?.classList.remove("hidden");
            }
            return clonedBoard;
        })

        //this is for promoting a pawn
        let promotionRaw = (playedPiece.team === TeamType.OUR) ? 7 : 0;

        if(destination.y === promotionRaw && playedPiece.isPawn){
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn((previousPromotionPawn)=> {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;           
           });
        }

        return playedMoveIsValid;
    }

    function isEnPassantMove(
        initialPosition: Position, 
        desiredPosition: Position, 
        type: PieceType, 
        team: TeamType){

        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if(type === PieceType.PAWN){
            if((desiredPosition.x - initialPosition.x === -1 || 
                desiredPosition.x - initialPosition.x === 1) && 
                desiredPosition.y-initialPosition.y === pawnDirection){
                const piece = board.pieces.find(p => 
                    p.position.x === desiredPosition.x && 
                    p.position.y === desiredPosition.y - pawnDirection 
                    && p.isPawn && (p as Pawn).enPassant);
                if (piece){
                    return true;
                }
            }    
             
        }       
        return false;
    }

    //TODO
    //Add stalemate!
    //HACER
     //¡Agregue punto muerto!
    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType){
        console.log('revisando los movimientos...');
        console.log(`piece type: ${type}`);
        console.log(`team: ${team}`);

        let validMove = false;
        switch(type){
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KNIGTH:
                validMove = knigthMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);    
                
        }

        return validMove;
    }

    // function getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
    //     switch(piece.type){
    //         case PieceType.PAWN:
    //            return getPossiblePawnMoves(piece, boardState);
    //         case PieceType.KNIGTH: 
    //            return getPossibleKnigthMoves(piece, boardState);
    //         case PieceType.BISHOP:
    //             return getPossibleBishopMoves(piece, boardState);
    //         case PieceType.ROOK: 
    //             return getPossibleRookMoves(piece, boardState);
    //         case PieceType.QUEEN:
    //             return getPossibleQueenMoves(piece, boardState);
    //         case PieceType.KING:
    //             return getPossibleKingMoves(piece, boardState);
    //         default:
    //             return [];
    //     }
    // }

    
    function promotePawn(pieceType: PieceType){

        if(promotionPawn === undefined) return;

        setBoard((previousBoard) => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece)=>{
                if(piece.samePiecePosition(promotionPawn)){
                    results.push(new Piece(piece.position.clone(), pieceType, piece.team, true));
                }else{
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);

            clonedBoard.calculateAllMoves();
            return clonedBoard;
        });

        modalRef.current?.classList.add('hidden');
    }

    function promotionType() {
        return (promotionPawn?.team === TeamType.OUR) ? "l" : "d";
    }
    
    function restarGame() {
        checkmateModalRef.current?.classList.add('hidden');
        setBoard(initialBoard.clone());
    }
    return(
       <>
           <p style={{color: "white", fontSize: "24px", textAlign: 'center' }}>Total Turnos: {board.totalTurns -1}</p>
           <div className='modal hidden' ref={modalRef}>
             <div className='modal-body'>
                <img onClick={() => promotePawn(PieceType.QUEEN)} src = {`/assets/images/Chess_q${promotionType()}t60.png`}/>
                <img onClick={() => promotePawn(PieceType.ROOK)} src = {`/assets/images/Chess_r${promotionType()}t60.png`}/>
                <img onClick={() => promotePawn(PieceType.BISHOP)} src = {`/assets/images/Chess_b${promotionType()}t60.png`}/>
                <img onClick={() => promotePawn(PieceType.KNIGTH)} src = {`/assets/images/Chess_n${promotionType()}t60.png`}/>
             </div>
           </div>
           <div className="modal hidden" ref={checkmateModalRef}>
            <div className="modal-body">
                <div className="checkmate-body">
                    <span>TThe winning team is {board.winningTeam === TeamType.OUR ? 'white' : 'black'} </span>
                    <button onClick={restarGame}>Play again</button>
                </div>
            </div>
           </div>
      <ChessBoard 
                  playMove={playMove}
                  pieces={board.pieces}/>
       </>
    )
}