import { initialBoardState } from "../../Constants";
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


export default function Referee(){
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        updatePossibleMoves();
    }, []);

    function updatePossibleMoves() {
        setPieces((currentPieces) => {
            return currentPieces.map(p=>{
                p.posibleMoves = getValidMoves(p, currentPieces);
                return p;
            });
        });
        return [];
    }

    function playMove(playedPiece: Piece, destination: Position): boolean{
        const validMove = isValidMove(
            playedPiece.position,
            destination, 
            playedPiece.type, 
            playedPiece.team
        );
        
        const enPassantMove = isEnPassantMove(
            playedPiece.position, 
            destination,
            playedPiece.type, 
            playedPiece.team, 
        );

        const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

        if(enPassantMove){
           const updatePieces = pieces.reduce((results, piece)=>{
            if(piece.samePiecePosition(playedPiece)){
                piece.enPassant = false;
                piece.position.x = destination.x;
                piece.position.y = destination.y;
                results.push(piece);
            }else if(!piece.samePosition(new Position(destination.x, destination.y-pawnDirection))){
                if(piece.type === PieceType.PAWN){
                    piece.enPassant = false;
                 }
                    results.push(piece);
            }
            return results
           }, [] as Piece[]);
           
            updatePossibleMoves();

           setPieces(updatePieces);

        }else if(validMove){
            const updatePieces = pieces.reduce((results, piece) => {
            if(piece.samePiecePosition(playedPiece)){
            
                piece.enPassant = Math.abs(playedPiece.position.y-destination.y) === 2 && piece.type === PieceType.PAWN
                piece.position.x = destination.x;
                piece.position.y = destination.y;
                
                //promocionar peon
                let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;
                if(destination.y === promotionRow && piece.type === PieceType.PAWN){
                    modalRef.current?.classList.remove("hidden")
                    setPromotionPawn(piece);
                    console.log("this piece is up for promotion")
                }
                results.push(piece);
            }else if(!(piece.samePosition(new Position(destination.x, destination.y)))){
                 if(piece.type === PieceType.PAWN){
                    piece.enPassant = false;
                 }
                    results.push(piece);
            }
            
            return results;
            }, [] as Piece[]);

            updatePossibleMoves();

            setPieces(updatePieces);
        }else{
            //reset piezas
           return false;
        }
        return true;
    }

    function isEnPassantMove(
        initialPosition: Position, 
        desiredPosition: Position, 
        type: PieceType, 
        team: TeamType){
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if(type === PieceType.PAWN){
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y-initialPosition.y === pawnDirection){
                const piece = pieces.find(p => 
                    p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant);
                if (piece)return true;
            }    
             
        }       
        return false;
    }

    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType){
        console.log('revisando los movimientos...');
        console.log(`piece type: ${type}`);
        console.log(`team: ${team}`);

        let validMove = false;
        switch(type){
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.KNIGTH:
                validMove = knigthMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, pieces);    
                
        }

        return validMove;
    }

    function getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
        switch(piece.type){
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

    
    function promotePawn(pieceType: PieceType){
        if(promotionPawn === undefined) return;
        const updatePieces = pieces.reduce((results, piece) => {
            if(piece.samePiecePosition(promotionPawn)){
               piece.type = pieceType;
               const teamType = (piece.team === TeamType.OUR) ? "l" : "d";
               let image = "";
               switch(pieceType){
                case PieceType.ROOK: {
                    image = "r";
                    break;
                }
                case PieceType.KNIGTH: {
                    image = "n";
                    break;
                }
                case PieceType.BISHOP: {
                    image = "b";
                    break; 
                }
                case PieceType.QUEEN: {
                    image = "q";
                    break;
                }
               }
               piece.image = `assets/images/Chess_${image}${teamType}t60.png`
            }
            results.push(piece);
            return results;
        }, [] as Piece[])

        updatePossibleMoves();

        setPieces(updatePieces);
        modalRef.current?.classList.add("hidden")
    }

    function promotionType() {
        return (promotionPawn?.team === TeamType.OUR) ? "l" : "d";
    }

    return(
       <>
           <div id="pawn-promotion-modal" className='hidden' ref={modalRef}>
             <div className='modal-body'>
                <img onClick={() => promotePawn(PieceType.QUEEN)} src = {`/assets/images/Chess_q${promotionType()}t60.png`}/>
                <img onClick={() => promotePawn(PieceType.ROOK)} src = {`/assets/images/Chess_r${promotionType()}t60.png`}/>
                <img onClick={() => promotePawn(PieceType.BISHOP)} src = {`/assets/images/Chess_b${promotionType()}t60.png`}/>
                <img onClick={() => promotePawn(PieceType.KNIGTH)} src = {`/assets/images/Chess_n${promotionType()}t60.png`}/>
             </div>
           </div>
      <ChessBoard 
                  playMove={playMove}
                  pieces={pieces}/>
       </>
    )
}