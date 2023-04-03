import React, { useRef, useState } from 'react';
import Tile from '../tile/tile';
import './ChessBoard.css';
import {
    VERTICAL_AXIS, 
    HORIZONTAL_AXIS, 
    GRID_SIZE,     
} from '../../Constants';
import { Piece, Position } from '../../models';


interface Props {
    playMove: (piece: Piece, position: Position) => boolean;
    pieces: Piece[];
}

const ChessBoard = ({ playMove, pieces}: Props) => {
    const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));   
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const chessboardRef = useRef<HTMLDivElement>(null)

    // para tocar la pieza
    const grabPiece = (e: React.MouseEvent) => {
        
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX-chessboard.offsetLeft)/GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY-chessboard.offsetTop - 600)/GRID_SIZE));
            
            setGrabPosition(new Position(grabX ,grabY ));
            
            const x = e.clientX -GRID_SIZE/2;
            const y = e.clientY -GRID_SIZE/2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    //para mover la pieza
    const movePiece = (e: React.MouseEvent) => {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) { 
            const minX = chessboard.offsetLeft-18.75;
            const minY = chessboard.offsetTop-18.75;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth-56.25;
            const maxY = chessboard.offsetTop + chessboard.clientHeight-56.25;
            const x = e.clientX - GRID_SIZE/2;
            const y = e.clientY - GRID_SIZE/2;
            activePiece.style.position = "absolute";
            activePiece.style.left = `${x}px`;
            activePiece.style.top = `${y}px`;
            if(x < minX){
                activePiece.style.left = `${minX}px`;
            }else if(x > maxX){
                activePiece.style.left = `${maxX}px`;
            }else{
                activePiece.style.left = `${x}}px`;
            }
            
            if(y < minY){
                activePiece.style.top = `${minY}px`;
            }else if(y > maxY){
                activePiece.style.top = `${maxY}px`;
            }else{
                activePiece.style.top = `${y}px`;
            }
        }
    }

    //para soltar la pieza
    const dropPiece = (e: React.MouseEvent) => {
        
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const x = Math.floor((e.clientX-chessboard.offsetLeft)/GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY-chessboard.offsetTop - 600)/GRID_SIZE));
            // console.log(x, y, 'dropPiece');
            const currentPiece = pieces.find((p)=> p.position.samePosition(grabPosition));
            // console.log(currentPiece);

            //actualizar piezas
            if(currentPiece){
               var succes =  playMove(currentPiece, new Position(x,y)); 
               
               if(!succes){
                //reset the piece position
                activePiece.style.position = "relative";
                activePiece.style.removeProperty("top");
                activePiece.style.removeProperty("left");
               }
            }           
            setActivePiece(null);
        }
    }


    

    let board = [];

    for(let j = VERTICAL_AXIS.length-1; j >=0; j--){
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find(p => p.samePosition(new Position(i, j)));
            let image = piece ? piece.image : undefined;

            let currentPiece = activePiece !== null ? pieces.find(p => p.samePosition(grabPosition)) : undefined;
            let highlight = currentPiece?.posibleMoves ? 
            currentPiece.posibleMoves.some(p=> p.samePosition(new Position(i, j))) : false;
            
            board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} />);       
        }
        
    }
    return ( 
        <>
           <div onMouseMove={e => movePiece(e)} 
             onMouseDown={e => grabPiece(e)} 
             onMouseUp={e => dropPiece(e)}
             id='chessboard'
             ref={chessboardRef}
             >
            {board}
           </div>
        </>
     );
}
 
export default ChessBoard;