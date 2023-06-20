import React, { useEffect, useRef, useState } from 'react';
import Tile from '../tile/tile';
import './ChessBoard.css';
import {
    VERTICAL_AXIS, 
    HORIZONTAL_AXIS, 
    GRID_SIZE,     
} from '../../Constants';
import { Piece, Position } from '../../models';
import { useCheckMateContext } from '../../Context/checkMateContex';
import { useChessboardContext } from '../../Context/boardContext';


interface Props {
    playMove: (piece: Piece, position: Position) => boolean;
    pieces: Piece[];
    whitePlayer: string;
    blackPlayer: string;
}

const initialTime = 600;

// Convierte el tiempo en segundos en un formato legible (por ejemplo, "MM:SS")
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60).toString().padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function Chessboard({ playMove, pieces, whitePlayer, blackPlayer}: Props){
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));   
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [isInvalidMove, setIsInvalidMove] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [whiteMoveLog, setWhiteMoveLog] = useState<string[]>([]);
  const [blackMoveLog, setBlackMoveLog] = useState<string[]>([]);
  const {checkMate,setCheckMate} = useCheckMateContext();
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const {boardColor} = useChessboardContext();

  const chessboardRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    
    const handleMouseUp = () => {
        if (isDragging) {
            // Reset the piece position
            activePiece?.style.removeProperty("top");
            activePiece?.style.removeProperty("left");
            setActivePiece(null);
        }
    };

    if (isDragging) {
        document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
        document.removeEventListener("mouseup", handleMouseUp);
    };
    
}, [isDragging, activePiece]);

useEffect(() => {
  if (checkMate.mate) {
      setBlackMoveLog([]);
      setWhiteMoveLog([]);
  }

  setCheckMate({mate: false})
}, [checkMate.mate]);

useEffect(() => {
  let timer: NodeJS.Timeout | null = null;

  if (whiteTime === 0 || blackTime === 0) {
    // Uno de los jugadores se quedó sin tiempo, se puede manejar el final del juego aquí
  }

  if (whiteTime > 0 && blackTime > 0) {
    // Cambiar de turno y actualizar el tiempo restante
    if (isWhiteTurn) {
      timer = setTimeout(() => {
        setWhiteTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      timer = setTimeout(() => {
        setBlackTime((prevTime) => prevTime - 1);
      }, 1000);
    }
  }

  return () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
}, [isWhiteTurn, whiteTime, blackTime]);

useEffect(() => {
  if (soundRef.current) {
    soundRef.current.pause();
    soundRef.current.currentTime = 0;
  }
}, [whiteMoveLog, blackMoveLog]);


  // para tocar la pieza
  // para tocar la pieza
const grabPiece = (e: React.MouseEvent) => {
  e.preventDefault();
  const element = e.target as HTMLElement;
  const chessboard = chessboardRef.current;
  if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 600) / GRID_SIZE));

      setGrabPosition(new Position(grabX, grabY));

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
      setIsDragging(true);
  }
}


  //para mover la pieza
  const movePiece = (e: React.MouseEvent) => {
    e.preventDefault();
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
  // para soltar la pieza
const dropPiece = (e: React.MouseEvent) => {
    e.preventDefault();
  const chessboard = chessboardRef.current;
  if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 600) / GRID_SIZE));
      // console.log(x, y, 'dropPiece');
      const currentPiece = pieces.find((p) => p.position.samePosition(grabPosition));
      // console.log(currentPiece);

      // actualizar piezas
      if (currentPiece) {
          const success = playMove(currentPiece, new Position(x, y));

          if (!success) {
              setIsInvalidMove(true);
              setTimeout(() => {
                  setIsInvalidMove(false);
                  // Reset the piece position
                  activePiece.style.removeProperty("top");
                  activePiece.style.removeProperty("left");
              }, 100);
          }else{
            const move = `${currentPiece.type.charAt(0) === 'p' ? 
            ''  : currentPiece.type.charAt(0).toLocaleUpperCase() }${HORIZONTAL_AXIS[grabPosition.x]}${VERTICAL_AXIS[grabPosition.y]}->${HORIZONTAL_AXIS[x]}${VERTICAL_AXIS[y]}`;

        if (currentPiece.team === "l") {
          setWhiteMoveLog((prevMoveLog) => [...prevMoveLog, move]);
        } else {
          setBlackMoveLog((prevMoveLog) => [...prevMoveLog, move]);
        }

        // Reproducir el sonido
        console.log("Reproducir sonido");
        soundRef.current?.play();
          }
      }
      setActivePiece(null);
      setIsDragging(false);
      
    if (isWhiteTurn) {
      // Turno de las blancas, detener el temporizador de las negras
      setBlackTime((prevTime) => prevTime);
    } else {
      // Turno de las negras, detener el temporizador de las blancas
      setWhiteTime((prevTime) => prevTime);
    }

    setIsWhiteTurn((prevTurn) => !prevTurn); // Alternar el turno
  }
};


    let board = [];
    let rowLabels= [];
    for(let j = VERTICAL_AXIS.length-1; j >=0; j--){
        rowLabels.push(<div key={j} className="row-label">{VERTICAL_AXIS[j]}</div>);

        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find(p => p.samePosition(new Position(i, j)));
            let image = piece ? piece.image : undefined;

            let currentPiece = activePiece !== null ? pieces.find(p => p.samePosition(grabPosition)) : undefined;
            let highlight = currentPiece?.posibleMoves ? 
            currentPiece.posibleMoves.some(p=> p.samePosition(new Position(i, j))) : false;
            
            board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight}/>);       
        }
        
    }
    return ( 
        <>
           
           <div className="time-container" style={{background: boardColor.register}}>
              <div className="player-time-white" style={{backgroundColor: boardColor.whiteTile}}>
              <img src='assets/images/Chess_plt60.png' alt='' style={{width: '40px', height: '40px'}}/>
                <span className="player-color">{whitePlayer || 'Player1'}:</span>{" "}
                <span className="time">{formatTime(whiteTime)}</span>
              </div>
              <div className="player-time-black" style={{backgroundColor: boardColor.whiteTile}}>
                <img src='assets/images/Chess_pdt60.png' alt='' style={{width: '40px', height: '40px'}}/>
                <span className="player-color">{blackPlayer || 'Player2'}:</span>{" "}
                <span className="time">{formatTime(blackTime)}</span>
              </div>
            </div>
            
           <div className='chessboard-container'>           
            <div>           
              <div className="labels-container">
                <div className="row-labels">{rowLabels}</div>
                <div 
                    id="chessboard"
                    onMouseDown={grabPiece}
                    onMouseMove={movePiece}
                    onMouseUp={dropPiece}
                    className={isInvalidMove ? "invalid-move" : ""}

                    ref={chessboardRef}
                >{board}
                </div>
              </div>
              <div className="column-labels">
                <span className="empty-label" />
                {HORIZONTAL_AXIS.map((letter, index) => (
                    <span key={index} className="column-label">{letter.toUpperCase()}</span>
                ))}
              </div>
            </div>
            <div>
            <div className='register' style={{background: boardColor.register}}>
             <h2>Registro de jugadas</h2>
            </div>
            <div className="move-log-container" style={{background: boardColor.register}}>
            
              <div className="move-log">
              <ul>
                {whiteMoveLog.map((move, index) => (
                  <li key={index}> {index+1}.   {move === 'Ke1->a1' ? '0-0-0' : move === 'Ke1->h1' ? '0-0' : move}</li>
                ))}
              </ul>
              </div>
              <div className="move-log">
                <ul>
                  {blackMoveLog.map((move, index) => (
                    <li key={index}>{move === 'Ke8->a8' ? '0-0-0' : move === 'Ke8->h8' ? '0-0' : move }</li>
                  ))}
                </ul>
              </div>
            </div>
            </div>
        </div>
        <audio ref={soundRef}>
        <source src={'/toque.mp3'} type="audio/mpeg" />
      </audio>
        </>
     );
}
 
