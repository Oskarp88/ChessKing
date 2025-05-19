import React, { useEffect, useRef , memo, useContext} from 'react';
import { useNavigate,} from 'react-router-dom';
import './Chessboard.css';
import { PieceType } from '../Types';
import { useChessboardContext } from '../context/boardContext/boardContext';
import { 
  getCaptureFunction, 
  getMovesFunction, 
  isMoveValid, 
  isStalemate } from './referee/Referee';
import { HORIZONTAL_AXIS, VERTICAL_AXIS} from '../Constants';
import {
  isCheckmateAfterMove,  
  isSimulatedMoveCausingCheck, 
  isSimulatedMoveCheckOpponent, 
} from './pieces/King';
import { useSocketContext } from '../context/socketContext/socketContext';
import { useAuth } from '../context/authContext/authContext';
import PlayerInfo from './profileUser/PlayerInfo';
import Modal from './modal/Modal';
import ModalTablas from './modal/ModalTablas';
import ModalRevancha from './modal/ModalRevancha';
import ModalCheckMate from './modal/ModalCheckMate';
import ModalAbandonar from './modal/ModalAbandonar';
import { useCheckMateContext } from '../context/checkMateContext/checkMateContext';
import ModalSendTablas from './modal/ModalSendTablas';
import ModalTablasAceptada from './modal/ModalTablasAceptada';
import PlayerInf2 from './profileUser/playerInf2';
import ChatChess from './ChatChess';
import BoardInfo from './board/BoardInfo';
import RecordPlays from './board/RecordPlays';
import PromotionPiece from './board/PromotionPiece';
import { GameContext } from '../context/gameContext/gameContext';
import MinNabvar from './board/MinNabvar';
import { useWindowWidth } from '../hooks/useWindowWidth';

function Chessboard() {
  const {
     socket, 
     room, 
     setRoom,    
     userChess,    
     setUser,
    } = useSocketContext();
  const {
    infUser, 
    setInfUser, 
    whiteMoveLog, 
    blackMoveLog, 
    currentTurn, setCurrentTurn,
    selectedPiece, setSelectedPiece,
    startCell, setStartCell,
    startCellRival, 
    destinationCell, setDestinationCell,
    destinationCellRival, 
    kingCheckCell, setKingCheckCell,
    enPassantTarget, setEnPassantTarget,
    userWon, setUserWon,
    isPromotionModalOpen, setPromotionModalOpen,
    isModaltime,
    isGameOver, setGameOver,
    whiteTime, setWhiteTime,
    blackTime, setBlackTime,
    modalTablas, 
    modalSendTablas, 
    aceptarRevancha, 
    modalAbandonar, 
    tied, setTied,
    frase, setFrase,
    modalTablasAceptada, setModalTablasAceptada,
    isCheckMate,
    handlePieceClick,
    handleTileClick,
    movePiece,
    formatTime,
    setWhiteTimeEnd,
    setBlackTimeEnd, 
    resetBoard,
    setIsGameStart,
    player1,
    modelRoom
  } = useContext(GameContext);
  const {auth} = useAuth();
  const {setCheckMate} = useCheckMateContext();
  const {
    boardColor,
    pieces, setPieces, 
  } = useChessboardContext();  
  const width = useWindowWidth();

  // const toqueAudio = new Audio('/to/tocar.mp3');
  // const soltarAudio = new Audio('/to/soltar.mp3');
  // const capturedAudio = new Audio('/to/captured.mp3');
  // const victoryAudio = new Audio('/to/VICTORIA.mp3');
  // const derrotaAudio = new Audio('/to/derrota.mp3');
  // const jakeAudio = new Audio('/to/jake.mp3');
  // const jakeMateAudio = new Audio('/to/jakemate.mp3');
  const navigate = useNavigate();
  const ref = useRef();
  const chessboardRef = useRef(null);

  useEffect(()=>{
    if(!socket) return;
    socket.on('revanchaAceptada',  (data) => {
          
      if (!data) return; // Check if data exists
      setIsGameStart(true);
      if(room) socket.emit('joinRoomGamePlay', room); 
      localStorage.setItem('gameStart', JSON.stringify(true));
      const time = parseInt(localStorage.getItem('time')) || infUser?.time;
      socket.emit('initPlay', {gameId: room, time});
      setInfUser((prevInfUser) => ({
        ...prevInfUser,
        color: data.color === 'white' ? 'black' : 'white',
      }));
      setUser((prevInfUser) => ({
        ...prevInfUser,
        color: data.color === 'white' ? 'black' : 'white',
      }));
      localStorage.setItem('infUser', JSON.stringify(infUser));
      resetBoard(); // Add a log inside resetBoard to verify
      navigate('/chess')
    });

  },[socket, infUser, navigate, resetBoard, room, setInfUser, setIsGameStart, setUser])

  useEffect(() => {
    const dataCellStart = localStorage.getItem('startCell');
    if(dataCellStart){
      const parseData = JSON.parse(dataCellStart);
      setStartCell({x: parseData.x, y: parseData.y});
    }

    const dataDestinationCell = localStorage.getItem('destinationCell');
    if(dataDestinationCell){
      const parseData = JSON.parse(dataDestinationCell);
      setDestinationCell({x: parseData.x, y: parseData.y})
    }
    const data = localStorage.getItem('chessboard');
    if (data) {
      const parseData = JSON.parse(data);
      setRoom(parseData.room);
      setCheckMate(parseData.checkMate);
      setUser(parseData.userChess);
      setCurrentTurn(parseData.currentTurn);
    }
    // Recuperar la disposición de las piezas
    const piecesData = localStorage.getItem('pieces');
    if (piecesData) {
      try {
        const parseData = JSON.parse(piecesData);
        if (Array.isArray(parseData)) {
          setPieces(parseData);
        }
      } catch (error) {
        console.error("Error parsing pieces data from localStorage:", error);
      }
    }
    const userData = localStorage.getItem('userChess');
    if(userData){
      const parseData = JSON.parse(userData);
      setUser(parseData);
    }
    
    const dataTimeWhite = localStorage.getItem('whiteTime');
    
    if(!isNaN(dataTimeWhite) && dataTimeWhite) {
      setWhiteTime(parseInt(dataTimeWhite));
    }
    const dataTimeBlack = localStorage.getItem('blackTime');
    
    if(!isNaN(dataTimeBlack) && dataTimeBlack) {
      setBlackTime(parseInt(dataTimeBlack));
    }
    const dataTimeWhiteEnd = localStorage.getItem('whiteTimeEnd');
    
    if(!isNaN(dataTimeWhiteEnd ) && dataTimeWhiteEnd) {
      setWhiteTimeEnd(parseInt(dataTimeWhiteEnd));
    }
    const dataTimeBlackEnd = localStorage.getItem('blackTimeEnd');
    
    if(!isNaN(dataTimeBlackEnd) && dataTimeBlackEnd) {
      setBlackTimeEnd(parseInt(dataTimeBlackEnd));
    }
  },[setBlackTime, setBlackTimeEnd, setCheckMate, setCurrentTurn, setDestinationCell, setPieces, setRoom, setStartCell, setUser, setWhiteTime, setWhiteTimeEnd]);

  const handleMouseDown = (e, piece, x, y) => {
    e.preventDefault();

    if (tied || player1.playerType !== modelRoom.turn || !piece || piece.color !== modelRoom.turn) return;
  
      setStartCell({ x, y });
      const pieceElement = e.target;
      
      // Obtener el rectángulo del tablero y la pieza
      const chessboardRect = chessboardRef.current.getBoundingClientRect();
      // Calcular el desplazamiento de la pieza desde el cursor
      const offsetX = e.clientX;
      const offsetY = e.clientY;

      setSelectedPiece(piece);
  
   function onMouseMove(event) {
        // Calcular la nueva posición de la pieza ajustada
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;
        // Asegurarse de que la pieza no se mueva fuera del tablero
        
        pieceElement.style.position = 'absolute';
        pieceElement.style.zIndex = 5;
        pieceElement.style.left = `${newX}px`;
        pieceElement.style.top = `${newY}px`;
   }
  
      async function onMouseUp(event) {
          // Obtener las coordenadas actuales del ratón en relación con el tablero
          const xRaw = (event.clientX - chessboardRect.left) / (chessboardRect.width / 8);
          const yRaw = (event.clientY - chessboardRect.top) / (chessboardRect.height / 8);

          // Calcular las coordenadas en el tablero considerando si el tablero está invertido
          const x = player1?.playerType === 'black' ? 7 - Math.floor(xRaw) : Math.floor(xRaw);
          const y = player1?.playerType === 'black' ? Math.floor(yRaw) : 7 - Math.floor(yRaw);

          const check =  isSimulatedMoveCausingCheck(
            piece, x, y, pieces, enPassantTarget, modelRoom.turn === 'white' ? 'black' : 'white'
          );
  
        if ( x < 0 || x > 7 || y < 0 || y > 7) {
          console.log("Movimiento fuera del tablero");
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          pieceElement.style.position = '';
          pieceElement.style.left = '';
          pieceElement.style.top = '';
          return;  // Salir de la función si las coordenadas están fuera del tablero
        }

        if (check) {
          // Implementar la lógica para manejar el jaque mate
          console.log('¡estas en jake'); 
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          pieceElement.style.position = '';
          pieceElement.style.left = '';
          pieceElement.style.top = '';  
          setSelectedPiece(null)     
          return;
        } 

        if (piece && piece.type === PieceType.PAWN) {
          if (piece.x !== x || piece.y !== y) {
            const dy = y - piece.y;
            if (Math.abs(dy) === 2) {
              // Esto significa que el peón avanzó dos casillas, y puedes configurar enPassantTarget.
              setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
            }      
          }
        }
        if(isMoveValid(
          piece.type, 
          piece, 
          x, y,
          pieces, 
          enPassantTarget,
          currentTurn)){

        if (enPassantTarget && x === enPassantTarget.x && 
            y === enPassantTarget.y && piece.type === PieceType.PAWN) {
          const pieceAtDestination = pieces.find((p) => 
            p.x === enPassantTarget.x && p.y === enPassantTarget.y-1 
            || p.x === enPassantTarget.x && p.y === enPassantTarget.y+1);
          pieces.splice(pieces.indexOf(pieceAtDestination), 1);             
        }  

        const isCheck = isSimulatedMoveCheckOpponent(piece, x, y, pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white')
        const king = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);

        if( isCheck){
          // jakeAudio.play();
          setKingCheckCell({x: king.x, y: king.y});       
          const checkMate = piece && isCheckmateAfterMove(piece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
        //  !checkMate && jakeAudio.play();
          if(checkMate){
            // jakeMateAudio.play();
            // victoryAudio.play();
            setUserWon(prev => ({
              ...prev, 
              username: auth?.user?.username,
              nameOpponent: infUser?.username, 
              idUser: auth?.user?._id,
              idOpponent: infUser?.idOpponent,
              turn: infUser?.color === 'white' ? 'black' : 'white',
              status: '1',
              color: infUser?.color === 'white' ? 'black' : 'white',
              photo: infUser?.photo
            }));
          
           if(socket ===null) return; 
            isCheckMate('victoria');
            setFrase('por !!Jaque Mate!!');
            setGameOver(prevIsGameOver => {
              console.log("isGameOver:", !prevIsGameOver);
              return true;
            });
            if(socket ===null) return; 
            socket.emit('checkMate', {room, username: auth?.user?.username, idUser: auth?.user?._id, color: infUser?.color === 'white' ? 'black' : 'white'});
          }         
        }else{
          setKingCheckCell(null);
        }

        const pieceData = {
          id: auth?.user?._id,
          piece: piece,
          row: y,
          col: x,
          initRow: piece.y,
          initCol: piece.x,
          turn: modelRoom.turn === 'white' ? 'black' : 'white',
          roomId: modelRoom._id,
        };
    
        movePiece(piece, x, y);
        setSelectedPiece(null);
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
        setDestinationCell({ x, y });
        
        localStorage.setItem('destinationCell', JSON.stringify({x,y}));
  
         localStorage.setItem('chessboard',
          JSON.stringify({ 
            room,  
            userChess,
            currentTurn: currentTurn === 'white' ? 'black' : 'white'
        }));
        localStorage.setItem('infUser', JSON.stringify(infUser));       
        
        if (piece.type === PieceType.PAWN && (y === 0 || y === 7)) {
          // Abrir el modal de promoción
          setPromotionModalOpen(true);
          return;
        }
        localStorage.setItem('send_move', JSON.stringify(pieceData));
        await socket.emit("sendMove", pieceData);
        const king1 = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);
        
      if (!isCheck && isStalemate(king1, pieces, piece, x, y)) {
        socket.emit('stalemate', {room, state : true});
        setModalTablasAceptada(true);
        setTied(true);
        setFrase('por Rey ahogado');
        isCheckMate('empate');
        return;
      }
      };
  
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        pieceElement.style.position = '';
        pieceElement.style.left = '';
        pieceElement.style.top = '';
      }
  
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    
  };

  const AceptarRevancha = async() => {
    resetBoard();
    setIsGameStart(true);
    localStorage.setItem('gameStart', JSON.stringify(true));
    const color = infUser?.color === 'white' ? 'black' : 'white';
    if(socket === null) return;
    setInfUser((prevInfUser) => ({
      ...prevInfUser,
      color: color,
    }));
    setUser((prevInfUser) => ({
      ...prevInfUser,
      color: color,
    }));
    if(room) socket.emit('joinRoomGamePlay', room); 
    socket.emit('aceptarRevancha', {revancha: true, room, color});
    const time = parseInt(localStorage.getItem('time')) || infUser?.time;
    socket.emit('initPlay', {gameId: room, time}); 
    localStorage.setItem('infUser', JSON.stringify(infUser));
    navigate('/chess');
  };

      
    const possibleMoves = getMovesFunction(
      selectedPiece && selectedPiece.type,
      selectedPiece,
      pieces,
      enPassantTarget,
      currentTurn
    );

    const possibleCaptures = getCaptureFunction(
      selectedPiece && selectedPiece.type,
      selectedPiece,
      pieces
    );

  // Agregar clases CSS condicionales para las casillas
  const getCellClass = (i, j) => {
    const isEven = (i + j) % 2 === 0;
    const isSelected = selectedPiece && selectedPiece.x === i && selectedPiece.y === j;
    const isStartCell = startCell && startCell.x === i && startCell.y === j;
    const isDestinationCell = destinationCell && destinationCell.x === i && destinationCell.y === j;
    const isStartCellRival = startCellRival && startCellRival.x === i && startCellRival.y === j;
    const isDestinationCellRival = destinationCellRival && destinationCellRival.x === i && destinationCellRival.y === j;
    const isKingCheckCell = kingCheckCell && kingCheckCell.x === i && kingCheckCell.y === j;

  if (isKingCheckCell) {
    return 'king-check-cell';
  }

    if (isSelected) {
      return 'selected-cell';
    } else if (isStartCell) {
      return 'start-cell';
    } else if (isDestinationCell) {
      return 'destination-cell';
    } else if (isStartCellRival){
      return 'start-cell'
    } else if (isDestinationCellRival) {
      return 'destination-cell'
    }
    else{      
      return isEven ? boardColor?.blackTile ||  'black-tile-azul' : boardColor?.whiteTile || 'white-tile-azul';
    }
  };

  const board = [];

 if(player1.playerType === 'white' ){
  for (let j = VERTICAL_AXIS.length-1; j >= 0; j--) {
  for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {

    let image = undefined;

    pieces.forEach(p => {
      if (p.x === i && p.y === j) {
        image = p.image;
      }
    });
    
    
    const isPossibleMove =  selectedPiece && possibleMoves.some((move) => move.x === i && move.y === j);
    
    const isPossibleCaptures = possibleCaptures.some((move) => move.x === i && move.y === j) 

    board.push(
      <div
        className={
          `tile ${getCellClass(i, j)} 
           ${isPossibleMove ? 'possible-move' : ''} 
           ${isPossibleCaptures ? 'possible-capture' : ''}`
        }
        key={`${HORIZONTAL_AXIS[i]}${VERTICAL_AXIS[j]}`}
        onMouseDown={() => handleTileClick(i, j)}
        ref={ref}
      >
        {j === 0 ? <div className="tile-content">{HORIZONTAL_AXIS[i]}</div> : null}
        {i === 0 ? <div className="tile-content-num">{VERTICAL_AXIS[j]}</div> : null}
        {image && (
         <img
            src={image}
            onClick={() => {
              const clickedPiece = pieces.find((p) => p.x === i && p.y === j);
              if (clickedPiece) {
                handlePieceClick(clickedPiece, i, j);
              }
            }}
            key={`${i}, ${j}`}
            className={`chess-piece ${
              selectedPiece === pieces.find((p) => p.x === i && p.y === j)
                ? 'selected'
                : ''
            }`}
            onMouseDown={(e) => handleMouseDown(e, pieces.find(p => p.x === i && p.y === j), i, j)}
         />         
        )}
      </div>
    );
  }
}}else{
  for (let j = 0; j < VERTICAL_AXIS.length;  j++) {
  for (let i = VERTICAL_AXIS.length-1; i >=0; i--) {
    
    let image = undefined;

    pieces.forEach(p => {
      if (p.x === i && p.y === j) {
        image = p.image;
      }
    });
    
    
    const isPossibleMove =  selectedPiece && possibleMoves.some((move) => move.x === i && move.y === j);
    
    const isPossibleCaptures = possibleCaptures.some((move) => move.x === i && move.y === j) 

    board.push(
      <div
        className={
          `tile ${getCellClass(i, j)} 
           ${isPossibleMove ? 'possible-move' : ''} 
           ${isPossibleCaptures ? 'possible-capture' : ''}`
        }
        style={width <= 450 ? {width: `${width/8}px`, height: `${width/8}px`} : {}}
        key={`${HORIZONTAL_AXIS[i]}${VERTICAL_AXIS[j]}`}
        onMouseDown={() => handleTileClick(i, j)}
        ref={ref}
      >
        {j === 7 ? <div className="tile-content">{HORIZONTAL_AXIS[i]}</div> : null}
        {i === 7 ? <div className="tile-content-num">{VERTICAL_AXIS[j]}</div> : null}
        {image && (
         <div
            style={{backgroundImage: `url(${image})`}}
            onClick={() => {
              const clickedPiece = pieces.find((p) => p.x === i && p.y === j);
              if (clickedPiece) {
                handlePieceClick(clickedPiece, i, j);
              }
            }}
            key={`${i}, ${j}`}
            className={`chess-piece ${
              selectedPiece === pieces.find((p) => p.x === i && p.y === j)
                ? 'selected'
                : ''
            }`}
            onMouseDown={(e) => handleMouseDown(e, pieces.find(p => p.x === i && p.y === j), i, j)}

         />     
        )}
      </div>
    );
  }
}
}
 
  return (
    <>
     <div className='display'>
     <div className='profile-container-chess'>
      <div className={'recordPlay'}>
        <RecordPlays whiteMoveLog={whiteMoveLog} blackMoveLog={blackMoveLog}/>
      </div>
      <div className='space1'>
        <PlayerInf2
            playerName={infUser?.username} 
            playerIcon={infUser?.photo}
            playerColor={infUser?.color}  
            playerTime={infUser?.color === 'black' ? formatTime(whiteTime) : formatTime(blackTime)} 
            currentTurn={ currentTurn === (infUser?.color === 'white' ? 'black' : 'white') ? infUser?.color === 'white' ? 'black' : 'white' : '' }
        />
      </div>
      <div 
        id="chessboard" 
        ref={chessboardRef}
        style={width <= 450 ? {background: '#f4d03f', width: `${width}px`, height: `${width}px`} : {}}
      >     
      {board}
      {isGameOver ? <ModalCheckMate 
                      infUser={userWon} 
                      time={infUser?.time}  
                      frase={frase}/> : null}
      {isModaltime && <Modal 
                      infUser={infUser} 
                      user={auth?.user} 
                    />
      }
      {aceptarRevancha && <ModalRevancha 
                            infUser={infUser} 
                            AceptarRevancha={AceptarRevancha}
                          />
      }
      {modalAbandonar && <ModalAbandonar />}
      {modalTablasAceptada && <ModalTablasAceptada 
                                infUser={infUser} 
                                frase={frase}
                              />}
      {modalTablas && <ModalTablas 
                        infUser={infUser} 
                      />}
      {modalSendTablas && <ModalSendTablas 
                              infUser={infUser} 
                          />}
      {isPromotionModalOpen && <PromotionPiece/>}
      </div>
      <div className='space'>
        <PlayerInfo        
          playerIcon={auth?.user?.photo}  
          playerColor={infUser?.color === 'white' ? 'black' : 'white'}
          userChess={userChess}
          time={infUser?.time} 
          playerTime={infUser?.color === 'black' ? formatTime(blackTime) : formatTime(whiteTime)} 
          currentTurn={currentTurn === infUser?.color ? infUser?.color : ''}
        />
      </div>
     </div>     
     <div  className='move-container'>
        <div className='register' style={{background: boardColor?.register || 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' }}>
          <h5>{'Registro de jugadas'.toUpperCase()}</h5>
          <div>
            <img src="/icon/moneda.png" alt="" />
            <span>{infUser?.valor}</span> 
          </div>              
        </div>
        <RecordPlays whiteMoveLog={whiteMoveLog} blackMoveLog={blackMoveLog}/>
        <div className='chat'>
          <ChatChess />
        </div>
         <BoardInfo />
    </div>
   
    <MinNabvar/>
    
     </div>  
    </>
  );
}

export default memo(Chessboard);
