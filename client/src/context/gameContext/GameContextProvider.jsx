import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useChessboardContext } from "../boardContext/boardContext";
import { isCheckmateAfterMove, isSimulatedMoveCausingCheck, isSimulatedMoveCheckOpponent } from "../../components/pieces/King";
import { useSocketContext } from "../socketContext/socketContext";
import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "@/Constants";
import { PieceType } from "@/Types";
import { useAuth } from "../authContext/authContext";
import { useCheckMateContext } from "../checkMateContext/checkMateContext";
import { handleThreefoldRepetition, insufficientMaterial, isMoveValid, isStalemate } from "@/components/referee/Referee";
import { baseUrl, postRequest } from "@/utils/services";
import axios from "axios";
import soundToque from '@/path/to/tocar.mp3';
import soundSoltar from '@/path/to/soltar.mp3';
import soundCaptured from '@/path/to/captured.mp3';
import soundVictory from '@/path/to/VICTORIA.mp3';
import soundDerrota from '@/path/to/derrota.mp3';
import soundJake from '@/path/to/jake.mp3';
import soundJakeMate from '@/path/to/jakemate.mp3';
import useSound from 'use-sound';
import { ChatContext } from "../chatContext/ChatContext";
import { GameContext } from "./gameContext";



export const GameContextProvider = ({children}) => {
    const {auth} = useAuth();
    const { onlineUsers, setOnlineUsers} = useContext(ChatContext);
    const {pieces,setPieces, resetPieces} = useChessboardContext();
    const {setCheckMate} = useCheckMateContext();
    const {room, setRoom, userChess, setUser, socket} = useSocketContext();
    const [infUser, setInfUser] = useState(JSON.parse(localStorage.getItem('infUser')) || {
      idOpponent: null,
      color: '',
      username: '',
      room: 0,
      time: 1,
      bullet: 0,
      blitz: 0,
      fast: 0,
      bandera: '',
      country: '',
      photo: '',
      marco: '',
      moneda: 500,
      valor: '500'
    });
    const [player1,setPlayer1] = useState({});
    const [player2, setPlayer2] = useState({});
    const [modelRoom, setModelRoom] = useState({});
    const [whiteMoveLog, setWhiteMoveLog] = useState([]);
    const [blackMoveLog, setBlackMoveLog] = useState([]);
    const [moveLog, setMoveLog] = useState([]);
    const [countNoCapture, setCountNoCapture] = useState(0);
    const [currentTurn, setCurrentTurn] = useState('white');
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [startCell, setStartCell] = useState(null);
    const [startCellRival, setStartCellRival] = useState(null);
    const [destinationCell, setDestinationCell] = useState(null);
    const [destinationCellRival, setDestinationCellRival] = useState(null);
    const [kingCheckCell, setKingCheckCell] = useState(null);
    const [enPassantTarget, setEnPassantTarget] = useState(null);
    const [pieceAux, setPieceAux] = useState(null);
    const [userWon, setUserWon] = useState(null);
    const [isPromotionModalOpen, setPromotionModalOpen] = useState(false);
    const [isPromotionComplete, setPromotionComplete] = useState(false);
    const [isModaltime, setModalTime] = useState(false);
    const [isGameOver, setGameOver] = useState(false);
    const [isGameStart, setIsGameStart] = useState(false);
    const [whiteTime, setWhiteTime] = useState(parseInt(infUser.time));
    const [blackTime, setBlackTime] = useState(parseInt(infUser.time));
    const [whiteTimeEnd, setWhiteTimeEnd] = useState(parseInt(infUser.time));
    const [blackTimeEnd, setBlackTimeEnd] = useState(parseInt(infUser.time));
    const [isWhiteTime, setIsWhiteTime] = useState('');
    const [isRedTime, setIsReadTime] = useState(false);
    const [loadingTablas, setLoadingTablas] = useState(false);
    const [modalTablas, setModalTablas] = useState(false);
    const [modalSendTablas, setSendTablas] = useState(false);
    const [modalTablasAceptada, setModalTablasAceptada] = useState(false);
    const [aceptarRevancha, setAceptarRevancha] = useState(false);
    const [modalAbandonar, setModalAbandonar] = useState(false);
    const [modalRendicion, setModalRendicion] = useState(false);
    const [sendRevancha, setSendRevancha] = useState(false);
    const [sendRevanchaRechada, setRevanchaRechazada] = useState(false);  
    const [tied, setTied] = useState(false);
    const [modalTiedRepetition, setModalTiedRepetition] = useState(false);
    const [frase, setFrase] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [color, setColor] = useState('');
    const [textToast, setTextToast] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [playerDisconnected, setPlayerDisconnected] = useState(false);
    const [reconnectionTimeout, setReconnectionTimeout] = useState(null);
    const [games, setGames] = useState(null);
    const [counter, setCounter] = useState(30);
    
    const [toqueAudio] = useSound(soundToque);
    const [soltarAudio] = useSound(soundSoltar);
    const [capturedAudio] = useSound(soundCaptured);
    const [victoryAudio] = useSound(soundVictory);
    const [derrotaAudio] = useSound(soundDerrota);
    const [jakeAudio] = useSound(soundJake);
    const [jakeMateAudio] = useSound(soundJakeMate);

    console.log('gameStarGameContext', isGameStart)

    const lastPingTime = useRef(Date.now()); // Tiempo en el que se recibió el último ping
        // El intervalo de ping configurado en el servidor (5 segundos)
    const pingTimeout = 5000;      // El tiempo de espera de ping configurado en el servidor (7 segundos)

    useEffect(() => {
      const gamesData = localStorage.getItem('games');
        if(gamesData){
          const parseData = JSON.parse(gamesData);
          setGames(parseData);
        }
    },[infUser]);

    useEffect(()=>{
      // const userIndex = onlineUsers.findIndex(user => user.userId === infUser?.idOpponent);
      // if (userIndex !== -1 && isGameStart) {
      //    setPlayerDisconnected(false);
      // }else if(isGameStart){
      //    setPlayerDisconnected(true);
      // }
      console.log('onlineUsersEffect', onlineUsers);
    },[onlineUsers]);

    useEffect(() => {
        if(socket === null) return;
        const handleConnect = () => {
          console.log("Conexión al servidor establecida. room:", room);
          setIsConnected(false);
          setCounter(30);
          // setTextToast("Conexión al servidor establecida.");
          // setColor('#58d68d');
          // setShowToast(true);
          socket.emit('addNewUser', auth?.user?._id);
          socket.on('getOnlineUsers', (data) => {
            setOnlineUsers(data);
          });
          if(room) {
            socket.emit('joinRoomGamePlay', room); 
            socket.emit("reconnectMove", {room, playerColor: infUser?.color});
            console.log('se envio el reconnet')  
          } 
        };
         // Manejar el evento "connect" para detectar la conexión exitosa
        socket.on("connect", handleConnect);
        // Manejar el evento "disconnect" para detectar desconexiones
        socket.on("disconnect", () => {    
            console.log("Disconnected without a specified reason.");
            const remainingTime = getRemainingDisconnectTime(); 
            console.log('remainingTime', remainingTime)     
            setCounter(remainingTime+counter);
            setIsConnected(true); 
        });
        socket.on('ping', () => {
          lastPingTime.current = Date.now();
          if(room && isGameStart){
            socket.emit('sendPing',room);
          }
        });
        // Responder al 'pingCheck' del servidor
        socket.on('pingCheck', (callback) => {
          if (callback) callback(); // Responde al callback si se proporciona
        });

        // Escucha el evento de alta latencia del oponente
        socket.on('opponentHighLatency', (data) => {
          console.log(data.message);
          alert(data.message); // Muestra una alerta al usuario, o implementa otra UI
        });
  
         // Escuchar si el otro jugador se desconectó
        // socket.on(' userDisconnected',(data)=>{
        //   if(data.userId !== infUser?.idOpponent && isGameStart) return;
        //   setPlayerDisconnected(true);
        // })
        socket.on('opponentConnected',()=>{
          setPlayerDisconnected(false);
        });
        socket.on('userDisconnected', (data) => {
          console.log('userDisconnected', isGameStart);
          console.log(`El jugador ${infUser?.username} con Id: '${data.userId}' se ha desconectado`);
          if(data.userId === infUser?.idOpponent && isGameStart){ 
             setPlayerDisconnected(true);       
          }
        });
      
        socket.on("reconnect", (attemptNumber) => {
          setTextToast(`Reconectado en el intento ${attemptNumber}`);
          setColor('#58d68d');
          setShowToast(true);
          // Realiza cualquier lógica adicional que necesites después de la reconexión
         if(room) socket.emit('joinRoomGamePlay', room); 
        });
        socket.on("reconnect_error", (error) => {
          console.log("Error al intentar reconectar:", error);
          // Puedes implementar una lógica de manejo de errores personalizada aquí
        });
  
        socket.on("reconnect_failed", () => {
          console.log("Fallo al reconectar. No se pudo restablecer la conexión.");
        });
  
        socket.on("pawn_promotion", (data)=>{
  
          setPieces(data.pieces)
          setCurrentTurn(data.currentTurn);
          setDestinationCell({x: data.destinationCell.x, y: data.destinationCell.y});
          setSelectedPiece(null);
          setStartCell(null);
  
          const updatedPieces = data.pieces.map((p) => {
            if (p.x === data.destinationCell.x && p.y === data.destinationCell.y && p.type === PieceType.PAWN) {
                  return { ...data.promotionPiece, x: p.x, y: p.y, color: data.currentTurn === 'white' ? 'black' : 'white' };
            }
            return p;
          });
  
          setPieces(updatedPieces);
        });
        socket.on("receiveMove", handleOpponentMove);
        socket.on('gameOverEnd',()=>{
          setUserWon(prev => ({
            ...prev, 
            username: auth?.user?.username,
            nameOpponent: infUser?.username, 
            idUser: auth?.user?._id,
            idOpponent: infUser?.idOpponent,
            turn: infUser?.color === 'white' ? 'black' : 'white',
            status: '0',
            color: infUser?.color === 'white' ? 'black' : 'white',
            photo: infUser?.photo
          }));
          setFrase(`Has perdido la conexión`);
          setGameOver(true);
          isCheckMate('derrota'); 
          localStorage.removeItem('gameRoom');
          setRoom(null);
        });
        socket.on('receiveReconnectMove', (res) => {
          console.log('receiveReconnectMove')
          const gameActive = JSON.parse(localStorage.getItem('gameStart'));
          console.log('isgamestart', gameActive);
          if(gameActive){
            setPlayerDisconnected(false);
            
          const dataTurn = localStorage.getItem('chessboard');
            if (dataTurn) {
              const parseDataTurn = JSON.parse(dataTurn);
              if(res.playerColor !== parseDataTurn.currentTurn) return;
                const data = localStorage.getItem('send_move');       
                if (data) {
                  const parseData = JSON.parse(data);                      
                  
                  if(room) socket.emit("get_last_move", parseData);
                }
            }
           }else{
             if(room) socket.emit('gameDisconnect', room);
           }                
        });
        socket.on('receiveRevancha', (data) => {
          setModalTablasAceptada(false);
          setModalRendicion(false);
          setModalTiedRepetition(false);
          setAceptarRevancha(data?.revancha);    
        });
  
        socket.on('receiveStalemate', (data) => {    
          setFrase('por Rey ahogado');
          setModalTablasAceptada(data.state);
          setTied(true);
          isCheckMate('empate');
        })

        socket.on('receiveRevanchaRechazada',() => {
          setRevanchaRechazada(true);
          setSendRevancha(false);
        })

       if(room) socket.emit('joinRoomGamePlay', room);
  
        socket.on('receiveTablas',() => {     
             setSendTablas(true);      
        });
        socket.on('receiveCancelarTablas', () => {
           setSendTablas(false);
        })
        socket.on('receiveRechazarTablas', () => {
          setModalTablas(false);
        })
        socket.on('receiveAceptarTablas', () => {
          localStorage.removeItem('whiteTime');
          localStorage.removeItem('blackTime'); 
          setModalTablas(false);
          setSendTablas(false);
          setModalTablasAceptada(true);
          isCheckMate('empate');
        })
        socket.on('receiveCheckMate',(data) => {
          derrotaAudio();
          isCheckMate('derrota');
          setUserWon(prev => ({
            ...prev, 
            username: auth?.user?.username, 
            nameOpponent: data?.username, 
            idUser: auth?.user?._id,
            idOpponent: data?.idUser,
            turn: data?.color,
            status: '0',
            color: infUser?.color === 'white' ? 'black' : 'white',
            photo: infUser?.photo
          }));
          setFrase('por !!Jaque Mate!!');
          setGameOver(true);
        })
        socket.on('receiveAbandonar',(data) => {
          localStorage.removeItem('whiteTime');
          localStorage.removeItem('blackTime');
          victoryAudio();
          isCheckMate('victoria');
          setUserWon(prev => ({
            ...prev, 
            username: auth?.user?.username, 
            nameOpponent: data?.username, 
            idUser: auth?.user?._id,
            idOpponent: data?.idUser,
            turn: data?.color === 'white' ? 'black' : 'white',
            status: '1',
            color: infUser?.color === 'white' ? 'black' : 'white',
            photo: infUser?.photo
          }));
          setFrase(`por abandono de las ${data?.color === 'white' ? 'negras' : 'blancas'}`);
          setGameOver(true);
        })
        // socket.on("opponentMove", handleOpponentMove);
  
        return () => {   
            socket.off("connect", handleConnect);   
            // socket.off("opponentMove", handleOpponentMove);
            socket.off('connect');
            socket.off('disconnect');
            socket.off('playerDisconnected');
            socket.off("receiveMove", handleOpponentMove);
            socket.off('getOnlineUsers')
            // socket.off('receiveTiempo', handleReceiveTiempo);
            // socket.off('receiveTiempoTurn', handleReceiveTiempoTurn);
            clearTimeout(reconnectionTimeout);    
        };
    }, [socket, isGameStart, auth?.user?._id, auth?.user?.username, counter, derrotaAudio, handleOpponentMove, infUser?.color, infUser?.idOpponent, infUser?.photo, infUser?.username, isCheckMate, reconnectionTimeout, room, setOnlineUsers, setPieces, setRoom, victoryAudio] );

    useEffect(()=>{
        const data = localStorage.getItem('chessboard');
        if (data) {
          const parseData = JSON.parse(data);
          setUser(parseData.userChess);
          setCurrentTurn(parseData.currentTurn);
        }
        const dataMove = localStorage.getItem('move');
        if (dataMove) {
          const parseData = JSON.parse(dataMove);
          setBlackMoveLog(parseData.blackMoveLog);
          setWhiteMoveLog(parseData.whiteMoveLog);
          setMoveLog(parseData.moveLog);
        }
        const gameRoom = localStorage.getItem('gameRoom');
        if(gameRoom){
          setRoom(gameRoom)
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
   
    },[socket, setPieces, setRoom, setUser]);

    useEffect(()=>{
      const data = localStorage.getItem('chessboard');
      if (data) {
        const parseData = JSON.parse(data);
        setUser(parseData.userChess);
        setCurrentTurn(parseData.currentTurn);
      }
      const dataMove = localStorage.getItem('move');
      if (dataMove) {
        const parseData = JSON.parse(dataMove);
        setBlackMoveLog(parseData.blackMoveLog);
        setWhiteMoveLog(parseData.whiteMoveLog);
        setMoveLog(parseData.moveLog);
      }
      
        const dataTimeWhiteEnd = localStorage.getItem('whiteTimeEnd');
    
        if(!isNaN(dataTimeWhiteEnd ) && dataTimeWhiteEnd) {
          setWhiteTimeEnd(parseInt(dataTimeWhiteEnd));
        }
        const dataTimeBlackEnd = localStorage.getItem('blackTimeEnd');
        
        if(!isNaN(dataTimeBlackEnd) && dataTimeBlackEnd) {
          setBlackTimeEnd(parseInt(dataTimeBlackEnd));
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

    const gameStart = JSON.parse(localStorage.getItem('gameStart'));
    if(gameStart){
       setIsGameStart(true);
    }
  },[setPieces, setUser]);
  
  useEffect(()=>{
    
    if(countNoCapture === 100) {
      setFrase('por inactividad de captura');
      setModalTablasAceptada(true);
      setTied(true);
      isCheckMate('empate');
    }
  },[countNoCapture, isCheckMate]);

  useEffect(()=>{
    const  isInsufficientMaterial = insufficientMaterial(pieces);
    if(isInsufficientMaterial){
        setFrase('Empate por material insuficiente');
        setTied(true);
        setModalTablasAceptada(true);
        isCheckMate('empate');
    }  
  },[pieces, isCheckMate]);

useEffect(()=>{
  const tiedRepetition = handleThreefoldRepetition(moveLog);  
  if(tiedRepetition){
    setFrase('Tablas por repetición');
    setTied(true);
    setModalTablasAceptada(true);
    isCheckMate('empate');
  }
 },[moveLog, isCheckMate]);
  
  useEffect(() => {
     localStorage.setItem('whiteTime', whiteTime);
     localStorage.setItem('blackTime', blackTime);
     localStorage.setItem('whiteTimeEnd', whiteTimeEnd);
     localStorage.setItem('blackTimeEnd', blackTimeEnd);

     if( !isGameOver && !tied && whiteTime > 0 && blackTime > 0){
         if(socket) {
          
          socket.on('timerUpdate', (updateGame)=>{
             if(updateGame.currenTurn === 'white'){
                setWhiteTime(updateGame.timers.white);
                setWhiteTimeEnd(updateGame.timers.white);
             }else{
                setBlackTime(updateGame.timers.black);
                setBlackTimeEnd(updateGame.timers.black)
             }
          })
         }
      }
     if (whiteTimeEnd === 0 || blackTimeEnd === 0) {
        setIsWhiteTime(whiteTime === 0 ? 'white' : 'black');
        setModalTime(true);  
       }
    },[
        blackTimeEnd,
        currentTurn, 
        whiteTime,  
        isWhiteTime, 
        socket, 
        blackTime, 
        isGameOver,
        tied,
        whiteTimeEnd
    ]);
  
  useEffect(() => {
    if (whiteTimeEnd === 0 || blackTimeEnd === 0) {
      localStorage.removeItem('whiteTimeEnd');
      localStorage.removeItem('blackTimeEnd');
      setWhiteTimeEnd(infUser.time);
      setBlackTimeEnd(infUser.time);
      if (isWhiteTime === infUser?.color) {
        isCheckMate('derrota');
      } else {
        isCheckMate('victoria');
      }
    }
  }, [whiteTime, blackTime, blackTimeEnd, infUser.color, infUser.time, isCheckMate, isWhiteTime, whiteTimeEnd]);

  useEffect(()=>{
    if(!socket) return;
    if(room)  socket.emit('changeTurn', {gameId: room, turn: currentTurn});
  },[currentTurn, room, socket])

  useEffect(() => {
    if (isPromotionComplete) {
      setPromotionComplete(false);
    }
  }, [isPromotionComplete, startCell]);

  useEffect(()=>{
    localStorage.setItem('move',JSON.stringify({
      whiteMoveLog,
      blackMoveLog,
      moveLog,
   }));
  },[moveLog, blackMoveLog, whiteMoveLog]);

  // Función para calcular el tiempo total de espera restante antes de que el servidor considere desconectado el socket
function getRemainingDisconnectTime() {
  const timeSinceLastPing = Date.now() - lastPingTime;
  // const remainingPingInterval = pingInterval - timeSinceLastPing;
  const totalWaitTime = timeSinceLastPing + pingTimeout;
  const total = Math.ceil(totalWaitTime / 1000); // Redondeo hacia arriba

  return totalWaitTime > 0 ? total : 0;
}
      // Convierte el tiempo en segundos en un formato legible (por ejemplo, "MM:SS")
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  //     setStartCell(null)
  //     setDestinationCell(null);
      
  //     if (piece && piece.type === PieceType.PAWN) {
  //       if (piece.x !== x || piece.y !== y) {
  //         const dy = y - piece.y;
  //         if (Math.abs(dy) === 2) {
  //           //el peón avanzó dos casillas, y configura enPassantTarget.
  //           setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
  //         }      
  //       }
  //     }

  //     setStartCellRival({x: piece.x, y: piece.y});
  //     setDestinationCellRival({ x, y }); // Establece la casilla de destino
  //     // localStorage.setItem('startCell', JSON.stringify({x: piece.x, y: piece.y}));
  //     // localStorage.setItem('destinationCell', JSON.stringify({x,y}));

  //     const isCheck = isSimulatedMoveCheckOpponent(piece, x, y, pieces, enPassantTarget, turn)
  //     const king = pieces.find((p) => p.type === PieceType.KING && p.color === turn);
  //     const checkMate =  isCheckmateAfterMove(selectedPiece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
  //     if(isCheck){
       
  //       setKingCheckCell({x: king.x, y: king.y});
  //       // !checkMate && jakeAudio.play(); 
  //       // if(checkMate){
  //       //    jakeMateAudio.play();
  //       // }
  //      }  else{
  //        setKingCheckCell(null);
  //    }
   
  //   setPieces((prevPieces) => {
  //     const updatedPieces = prevPieces.map((p) => {
  //         // Verificar si el rey está en su posición inicial y va a hacer enroque corto o largo
  //         if (piece.type === PieceType.KING && piece.x === 4 && (piece.y === 0 || piece.y === 7)) {
  //             // Enroque corto
  //             if (x === 6 && (y === 0 || y === 7)) {
  //                 if (p.type === PieceType.ROOK && p.x === 7 && p.y === piece.y) {
  //                     // Mover la torre del enroque corto
  //                     return { ...p, x: 5, y: piece.y }; // La torre se mueve de (7, y) a (5, y)
  //                 }
  //             }
  //             // Enroque largo
  //             else if (x === 2 && (y === 0 || y === 7)) {
  //                 if (p.type === PieceType.ROOK && p.x === 0 && p.y === piece.y) {
  //                     // Mover la torre del enroque largo
  //                     return { ...p, x: 3, y: piece.y }; // La torre se mueve de (0, y) a (3, y)
  //                 }
  //             }
  //         }
  //         return p;
  //     });
  //     return updatedPieces;
  // });

     
  //     setPieces((prevPieces) => {
  //       let captureOccurred = false;
  //       // Crea una copia actualizada de la lista de piezas
  //       const updatedPieces = prevPieces.map((p) => {
          
  //         if (p.x === piece.x && p.y === piece.y) {
          
  //           // Encuentra la pieza que está siendo movida y actualiza su posición
  //           return { ...p, x, y };
  //         } else if (p.x === x && p.y === y && p.color !== piece.color) {
  //           // Si la casilla de destino está ocupada por una pieza enemiga, cápturala (no la incluyas en la nueva lista)
  //           captureOccurred = true;
            
  //           return null;
  //         } else {
  //           // Mantén inalteradas las otras piezas
           
  //           return p;
  //         }
  //       }).filter(Boolean); // Filtra las piezas para eliminar las null (piezas capturadas)

  //     // if(!isCheck || !checkMate){
  //     //   captureOccurred ? capturedAudio.play() : soltarAudio.play();
  //     // }
  //       moveNomenclatura(piece, captureOccurred, x, y);
             
  //       if (captureOccurred) {
  //         setCountNoCapture(0);
          
  //       } else {
  //         setCountNoCapture(prevCount => prevCount + 1);   
  //       }
  //       localStorage.setItem('pieces', JSON.stringify(updatedPieces));
  //       return updatedPieces;
  //     });

   

  //      localStorage.removeItem('userChess');
  //      localStorage.removeItem('infUser');

  //      localStorage.setItem('chessboard',
  //       JSON.stringify({
  //         room,  
  //         checkMate,
  //         userChess,
  //         infUser,
  //         currentTurn: turn
  //     }));
     
  // };

  // const handlePromotionSelection = async(promotionPiece) => {
  //   //  selección de la pieza de promoción
  //   // Reemplaza el peón con la pieza seleccionada
  //   const updatedPieces = pieces.map((p) => {
  //     if (p.x === destinationCell.x && p.y === destinationCell.y && p.type === PieceType.PAWN) {
  //       return {...promotionPiece, x: p.x, y: p.y, color: currentTurn === 'white' ? 'black' : 'white'};
  //     }
  //     return p;
  //   });

    
  //   setPieces(updatedPieces);
  //   const pieceData = {
  //     pieces,
  //     promotionPiece,
  //     destinationCell,
  //     currentTurn,
  //     author: auth?.user?.username,
  //     room
  //   }

  //   await socket.emit("promotion", pieceData);
  //   setPromotionModalOpen(false);
  // };
  
  // const handlePieceClick = (piece, x, y) => {
  //   if(tied === true) return;
  //   // if(infUser?.color !== currentTurn) return;
  //   if (piece && piece.color === infUser?.color) {
  //     if (selectedPiece && piece.x === selectedPiece.x && piece.y === selectedPiece.y) {        
  //       setDestinationCell(null);
  //     } else {
  //       // toqueAudio.play(); 
  //       setSelectedPiece(piece);
  //       setPieceAux(piece);
  //       setStartCell({ x, y }); // Establece la casilla de inicio     
  //       localStorage.setItem('startCell', JSON.stringify({x,y}));
  //     }
  //   }
  // };
  
  // const handleTileClick = async(x, y) => {
  //   if(tied === true) return;
  //   if(infUser?.color !== currentTurn) return;
  //    setStartCellRival(null);
  //    setDestinationCellRival(null);
  //   // Manejar el clic en una casilla para mover la pieza
  //   if (selectedPiece && selectedPiece.type === PieceType.PAWN) {
  //     if (selectedPiece.x !== x || selectedPiece.y !== y) {
  //       const dy = y - selectedPiece.y;
  //       if (Math.abs(dy) === 2) {
  //         // Esto significa que el peón avanzó dos casillas, y puedes configurar enPassantTarget.
  //         setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
  //       }      
  //     }
  //   }
  //   if (!selectedPiece) {
  //     return;
  //   }
    
  //   if (isMoveValid(
  //          selectedPiece.type, 
  //          selectedPiece, 
  //          x,y,pieces,
  //          enPassantTarget,
  //          currentTurn)) {

  //           const check =  isSimulatedMoveCausingCheck(selectedPiece, x, y, pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
     
  //           if (check) {
  //             // Implementar la lógica para manejar el jaque mate
  //             console.log('¡estas en jake');       
  //             return
  //           } 

  //           const isCheck = isSimulatedMoveCheckOpponent(selectedPiece, x, y, pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white')
  //           const king = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);
     
  //     if( isCheck){
        
  //       setKingCheckCell({x: king.x, y: king.y});       
  //       const checkMate = selectedPiece && isCheckmateAfterMove(selectedPiece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
  //       // !checkMate && jakeAudio.play();
  //       if(checkMate){
  //         // jakeMateAudio.play();
  //         // victoryAudio.play();
  //         setUserWon(prev => ({
  //           ...prev, 
  //           username: auth?.user?.username,
  //           nameOpponent: infUser?.username, 
  //           idUser: auth?.user?._id,
  //           idOpponent: infUser?.idOpponent,
  //           turn: infUser?.color === 'white' ? 'black' : 'white',
  //           status: '1',
  //           color: infUser?.color === 'white' ? 'black' : 'white',
  //           photo: infUser?.photo
  //         }));
        
  //        if(socket ===null) return; 
  //         isCheckMate('victoria');
  //         setFrase('por !!Jaque Mate!!');
  //         setGameOver(prevIsGameOver => {
  //           console.log("isGameOver:", !prevIsGameOver);
  //           return true;
  //         });
  //         if(socket ===null) return; 
  //         socket.emit('checkMate', {room, username: auth?.user?.username, idUser: auth?.user?._id, color: infUser?.color === 'white' ? 'black' : 'white'});
  //       }
        
  //     }else{
  //       setKingCheckCell(null);
  //     }
      
  //     const pieceData = {
  //       pieces,
  //       piece: selectedPiece,
  //       x,
  //       y,
  //       turn: currentTurn === 'white' ? 'black' : 'white',
  //       author: auth?.user?.username,
  //       room
  //     };
      
  //     movePiece(selectedPiece, x, y);    
  //     setSelectedPiece(null);
  //     setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
  //     setDestinationCell({ x, y });
  //     localStorage.setItem('destinationCell', JSON.stringify({x,y}));

  //      localStorage.setItem('chessboard',
  //       JSON.stringify({ 
  //         room,  
  //         checkMate,
  //         userChess,
  //         infUser,
  //         currentTurn: currentTurn === 'white' ? 'black' : 'white'
  //     }));
      
      
  //     if (selectedPiece.type === PieceType.PAWN && (y === 0 || y === 7)) {
  //       // Abrir el modal de promoción
  //       setPromotionModalOpen(true);
  //       return;
  //     }
      
  //     await socket.emit("send_move", pieceData);
  //     gamesUpdate(room, pieces, selectedPiece, x, y, currentTurn === 'white' ? 'black' : 'white');
      
  //     const king1 = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);
  //     console.log('king', king1.color);
  //   if (!isCheck && isStalemate(king1, pieces, selectedPiece, x, y)) {
  //     socket.emit('stalemate', {room, state : true});
  //     setModalTablasAceptada(true);
  //     setTied(true);
  //     setFrase('por Rey ahogado');
  //     isCheckMate('empate');
  //     return;
  //   }
  //   }
  // }; 
  
  // const movePiece = async (piece, x, y) => {
  //   if (piece && piece.color === currentTurn) {
  //     let captureOccurred = false;
  //     setPieces((prevPieces) => {         
  //       // Crea una copia actualizada de la lista de piezas
  //       const updatedPieces = prevPieces.map((p) => {
  //         if (p.x === piece.x && p.y === piece.y && !(p.x === x && p.y === y && p.color !== piece.color)) {
  //           // Encuentra la pieza que está siendo movida y actualiza su posición
  //           return { ...p, x, y };

  //         } else if (p.x === x && p.y === y && p.color !== piece.color) {
  //           // Si la casilla de destino está ocupada por una pieza enemiga, cápturala
  //           captureOccurred = true;
  //           return null;
  //         } else {
  //           // Mantén inalteradas las otras piezas
  //           return p;
  //         }
  //       }).filter(Boolean); // Filtra las piezas para eliminar las null (piezas capturadas)
        
  //       // captureOccurred ? capturedAudio.play() : soltarAudio.play();
  //       // Solo actualizar el registro de movimientos una vez
  //       if (piece) {
  //         moveNomenclatura(piece, captureOccurred, x, y);
  //       }
  
  //       if (captureOccurred) {
  //         setCountNoCapture(0);
  //       } else {
  //         setCountNoCapture(prevCount => prevCount + 1);
  //       }
  
  //       localStorage.setItem('pieces', JSON.stringify(updatedPieces));
  //       return updatedPieces;
  //     });
  //   }
  // };
    
      const handleOpponentMove = useCallback(async (data) => {
        const { piece, col, row, turn, room, id} = data;
          const x = col;
          const y = row;
          setModelRoom(room);
          setCurrentTurn(turn);
          if(id === auth?.user?._id) return;
          setStartCell(null)
          setDestinationCell(null);
          
          if (piece && piece.type === PieceType.PAWN) {
            if (piece.x !== x || piece.y !== y) {
              const dy = y - piece.y;
              if (Math.abs(dy) === 2) {
                //el peón avanzó dos casillas, y configura enPassantTarget.
                setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
              }      
            }
          }
    
          setStartCellRival({x: piece.x, y: piece.y});
          setDestinationCellRival({ x, y }); // Establece la casilla de destino
          // localStorage.setItem('startCell', JSON.stringify({x: piece.x, y: piece.y}));
          // localStorage.setItem('destinationCell', JSON.stringify({x,y}));
    
        //   const isCheck = isSimulatedMoveCheckOpponent(piece, x, y, pieces, enPassantTarget, turn)
        //   // const king = pieces.find((p) => p.type === PieceType.KING && p.color === turn);
        //   const checkMate =  isCheckmateAfterMove(selectedPiece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
        //   if(isCheck){
           
        //     setKingCheckCell({x: king.x, y: king.y});
        //    !checkMate && jakeAudio(); 
        //     if(checkMate){
        //        jakeMateAudio();
        //     }
        //    }  else{
        //      setKingCheckCell(null);
        //  }
       
        setPieces((prevPieces) => {
          const updatedPieces = prevPieces.map((p) => {
            
              // Verificar si el rey está en su posición inicial y va a hacer enroque corto o largo
              if (piece.type === PieceType.KING && piece.x === 4 && (piece.y === 0 || piece.y === 7)) {
                  // Enroque corto
                  if (x === 6 && (y === 0 || y === 7)) {
                      if (p.type === PieceType.ROOK && p.x === 7 && p.y === piece.y) {
                          // Mover la torre del enroque corto
                          return { ...p, x: 5, y: piece.y }; // La torre se mueve de (7, y) a (5, y)
                      }
                  }
                  // Enroque largo
                  else if (x === 2 && (y === 0 || y === 7)) {
                      if (p.type === PieceType.ROOK && p.x === 0 && p.y === piece.y) {
                          // Mover la torre del enroque largo
                          return { ...p, x: 3, y: piece.y }; // La torre se mueve de (0, y) a (3, y)
                      }
                  }
              }
              return p;
          });
          return updatedPieces;
      });
    
         
          setPieces((prevPieces) => {
            let captureOccurred = false;
            // Crea una copia actualizada de la lista de piezas
            const updatedPieces = prevPieces.map((p) => {
              
              if (p.x === piece.x && p.y === piece.y) {
              
                // Encuentra la pieza que está siendo movida y actualiza su posición
                return { ...p, x, y };
              } else if (p.x === x && p.y === y && p.color !== piece.color) {
                // Si la casilla de destino está ocupada por una pieza enemiga, cápturala (no la incluyas en la nueva lista)
                captureOccurred = true;
                
                return null;
              } else {
                // Mantén inalteradas las otras piezas
               
                return p;
              }
            }).filter(Boolean); // Filtra las piezas para eliminar las null (piezas capturadas)
    
          //  if(!isCheck || !checkMate){
          //     captureOccurred ? capturedAudio() : soltarAudio();
          //   }
            moveNomenclatura(piece, captureOccurred, x, y);
                 
            if (captureOccurred) {
              setCountNoCapture(0);
              
            } else {
              setCountNoCapture(prevCount => prevCount + 1);   
            }
            localStorage.setItem('pieces', JSON.stringify(updatedPieces));
            return updatedPieces;
          });           
          //  localStorage.removeItem('userChess');
          //  localStorage.removeItem('infUser');
    
           localStorage.setItem('chessboard',
            JSON.stringify({
              room,  
              userChess,
              currentTurn: turn
          }));
         
      },[auth?.user?._id, setPieces, userChess]);

      const moveNomenclatura = (piece, captureOccurred,x,y) => {
        const move = piece?.color === 'white' && piece?.x === 4 && piece?.y === 0 && x === 6 && y === 0 
        ? '0-0' : piece?.color === 'black' && piece?.x === 4 && piece?.y === 7 && x === 6 && y === 7 
        ? '0-0' : piece?.color === 'white' && piece?.x === 4 && piece?.y === 0 && x === 2 && y === 0 
        ? '0-0-0' : piece?.color === 'black' && piece?.x === 4 && piece?.y === 7 && x === 2 && y === 7 
        ? '0-0-0' :`${ piece?.type?.charAt(0) === 'p'
        ?  `${captureOccurred ? HORIZONTAL_AXIS[x] : ''}` 
        : (piece?.type === 'knight') ? 'N' : (piece?.type?.charAt(0).toLocaleUpperCase()) || ''
      }${captureOccurred ? 'x' : ''}${HORIZONTAL_AXIS[x]}${VERTICAL_AXIS[y]}`;
       if (piece && piece.color === "white") {
        setWhiteMoveLog((prevMoveLog) => {
          // Verifica si el último movimiento es igual al nuevo 'move'
          if (prevMoveLog.length > 0 && prevMoveLog[prevMoveLog.length - 1] === move) {
            return prevMoveLog; // Si son iguales, retorna el array sin cambios
          }      
          // Si son diferentes, añade el nuevo movimiento
          return [...prevMoveLog, move];
        });
         setMoveLog((prevMoveLog) => {
          // Verifica si el último movimiento es igual al nuevo 'move'
          if (prevMoveLog.length > 0 && prevMoveLog[prevMoveLog.length - 2] === move) {
            return prevMoveLog; // Si son iguales, retorna el array sin cambios
          }      
          // Si son diferentes, añade el nuevo movimiento
          return [...prevMoveLog, move];
         });
       } else if (piece && piece.color === 'black'){
         setBlackMoveLog((prevMoveLog) => {
          // Verifica si el último movimiento es igual al nuevo 'move'
          if (prevMoveLog.length > 0 && prevMoveLog[prevMoveLog.length - 1] === move) {
            return prevMoveLog; // Si son iguales, retorna el array sin cambios
          }      
          // Si son diferentes, añade el nuevo movimiento
          return [...prevMoveLog, move];
         });
         setMoveLog((prevMoveLog) => {
          // Verifica si el último movimiento es igual al nuevo 'move'
          if (prevMoveLog.length > 0 && prevMoveLog[prevMoveLog.length - 2] === move) {
            return prevMoveLog; // Si son iguales, retorna el array sin cambios
          }      
          // Si son diferentes, añade el nuevo movimiento
          return [...prevMoveLog, move];
         });
       }
      
      };

      const isCheckMate = useCallback(async(game) => {
        if(socket && room) socket.emit('gameEnd', room);
        localStorage.removeItem('gameStart'); 
        setIsGameStart(false);
        setCheckMate({
          userId: auth?.user?._id,
          opponentId: infUser?.idOpponent,
          name: auth?.user?.username,
          nameOpponent: infUser?.username,
          bandera: auth?.user?.imagenBandera,
          banderaOpponent: infUser?.bandera,
          country: auth?.user?.country,
          countryOpponent: infUser?.country,
          time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                   infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                   'fast' }`,
          game,
          eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
            parseInt(userChess?.eloFast)}`,
          eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
            parseInt(infUser?.fast)}`,
          elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
            parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
          color: infUser?.color,
          score: infUser?.moneda,
        });
      },[auth?.user?._id, auth?.user?.country, auth?.user?.imagenBandera, auth?.user?.username, infUser?.bandera, infUser?.blitz, infUser?.bullet, infUser?.color, infUser?.country, infUser?.fast, infUser?.idOpponent, infUser?.moneda, infUser?.time, infUser?.username, room, setCheckMate, socket, userChess?.eloBlitz, userChess?.eloBullet, userChess?.eloFast]);

      const resetBoard = () => {
        localStorage.removeItem('pieces'); 
        localStorage.removeItem('whiteTime');
        localStorage.removeItem('blackTime');
        localStorage.removeItem('whiteTimeEnd');
        localStorage.removeItem('blackTimeEnd');
        localStorage.removeItem('destinationCell');
        localStorage.removeItem('startCell');
        localStorage.removeItem('chessboard');
        localStorage.removeItem('send_move');

        setPieces(resetPieces);
        setPlayerDisconnected(false)
        setIsConnected(false);
        setFrase(null);
        setModalTiedRepetition(false);
        setTied(false);
        setModalTablasAceptada(false);
        setGameOver(false);
        setDestinationCell(null);
        setStartCell(null);
        setKingCheckCell(null);
        setSelectedPiece(null);
        setCurrentTurn('white');
        setBlackMoveLog([]);
        setWhiteMoveLog([]);
        setMoveLog([]);
        setAceptarRevancha(false);
        setModalTime(false);
        setWhiteTime(infUser?.time);
        setBlackTime(infUser?.time);
        setWhiteTimeEnd(infUser?.time);
        setBlackTimeEnd(infUser?.time);
        setModalRendicion(false);
        setIsReadTime(false);
        setCheckMate(null);
        setDestinationCellRival(null);
        setStartCellRival(null);
      };

      const handlePromotionSelection = async(promotionPiece) => {
        //  selección de la pieza de promoción
        // Reemplaza el peón con la pieza seleccionada
        const updatedPieces = pieces.map((p) => {
          if (p.x === destinationCell.x && p.y === destinationCell.y && p.type === PieceType.PAWN) {
            return {...promotionPiece, x: p.x, y: p.y, color: currentTurn === 'white' ? 'black' : 'white'};
          }
          return p;
        });
    
        
        setPieces(updatedPieces);
        const pieceData = {
          pieces,
          promotionPiece,
          destinationCell,
          currentTurn,
          author: auth?.user?.username,
          room
        }
    
        await socket.emit("promotion", pieceData);
        setPromotionModalOpen(false);
      };

      const handlePieceClick = (piece, x, y) => {
        if(tied === true) return;
        // if(infUser?.color !== currentTurn) return;
        if (piece && piece.color === player1.playerType) {
          if (selectedPiece && piece.x === selectedPiece.x && piece.y === selectedPiece.y) {        
            setDestinationCell(null);
          } else {
            // toqueAudio.play(); 
           
              toqueAudio();
           
            setSelectedPiece(piece);
            setPieceAux(piece);
            setStartCell({ x, y }); // Establece la casilla de inicio     
            localStorage.setItem('startCell', JSON.stringify({x,y}));
          }
        }
      }

      const handleTileClick = async(x, y) => {
        if(tied === true) return;
        if(player1.playerType !== modelRoom.turn) return;
         setStartCellRival(null);
         setDestinationCellRival(null);
        // Manejar el clic en una casilla para mover la pieza
        if (selectedPiece && selectedPiece.type === PieceType.PAWN) {
          if (selectedPiece.x !== x || selectedPiece.y !== y) {
            const dy = y - selectedPiece.y;
            if (Math.abs(dy) === 2) {
              // Esto significa que el peón avanzó dos casillas, y puedes configurar enPassantTarget.
              setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
            }      
          }
        }
        if (!selectedPiece) {
          return;
        }
        
        if (isMoveValid(
               selectedPiece.type, 
               selectedPiece, 
               x,y,pieces,
               enPassantTarget,
               currentTurn)) {
    
                const check =  isSimulatedMoveCausingCheck(selectedPiece, x, y, pieces, enPassantTarget, modelRoom.turn === 'white' ? 'black' : 'white');
         
                if (check) {
                  // Implementar la lógica para manejar el jaque mate
                  console.log('¡estas en jake');       
                  return
                } 
    
                const isCheck = isSimulatedMoveCheckOpponent(selectedPiece, x, y, pieces, enPassantTarget, modelRoom.turn === 'white' ? 'black' : 'white')
                const king = pieces.find((p) => p.type === PieceType.KING && p.color !== modelRoom.turn);
         
          if( isCheck){
            
            setKingCheckCell({x: king.x, y: king.y});       
            const checkMate = selectedPiece && isCheckmateAfterMove(selectedPiece,x,y,pieces, enPassantTarget, modelRoom.turn === 'white' ? 'black' : 'white');
             !checkMate && jakeAudio();
            if(checkMate){
               jakeMateAudio();
              victoryAudio();
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
            
              isCheckMate('victoria');
              setFrase('por !!Jaque Mate!!');
              setGameOver(prevIsGameOver => {
                console.log("isGameOver:", !prevIsGameOver);
                return true;
              });
              if(socket === null) return; 
             if(room) socket.emit('checkMate', {room, username: auth?.user?.username, idUser: auth?.user?._id, color: player1.playerType === 'white' ? 'black' : 'white'});
            }
            
          }else{
            setKingCheckCell(null);
          }
          
          const pieceData = {
            id: auth?.user?._id,
            piece: selectedPiece,
            row: y,
            col: x,
            initRow:selectedPiece.y,
            initCol: selectedPiece.x,
            turn: modelRoom.turn === 'white' ? 'black' : 'white',
            roomId: modelRoom._id,
          };
          
          movePiece(selectedPiece, x, y);    
          setSelectedPiece(null);
          setCurrentTurn(modelRoom.turn === 'white' ? 'black' : 'white');
          setDestinationCell({ x, y });
          localStorage.setItem('destinationCell', JSON.stringify({x,y}));
    
           localStorage.setItem('chessboard',
            JSON.stringify({ 
              room,  
              userChess,
              currentTurn: currentTurn === 'white' ? 'black' : 'white'
          }));
          
          if (selectedPiece.type === PieceType.PAWN && (y === 0 || y === 7)) {
            // Abrir el modal de promoción
            setPromotionModalOpen(true);
            return;
          }
          localStorage.setItem('send_move', JSON.stringify(pieceData));
          if(room) await socket.emit("sendMove", pieceData);
          gamesUpdate(room, pieces, selectedPiece, x, y, modelRoom.turn === 'white' ? 'black' : 'white');
          
          const king1 = pieces.find((p) => p.type === PieceType.KING && p.color !== modelRoom.turn);
        if (!isCheck && isStalemate(king1, pieces, selectedPiece, x, y)) {
         if(room) socket.emit('stalemate', {room, state : true});
          setModalTablasAceptada(true);
          setTied(true);
          setFrase('por Rey ahogado');
          isCheckMate('empate');
          return;
        }
        }
      }; 
      
      const movePiece = async (piece, x, y) => {
        if (piece && piece.color === modelRoom.turn) {
          let captureOccurred = false;
          setPieces((prevPieces) => {         
            // Crea una copia actualizada de la lista de piezas
            const updatedPieces = prevPieces.map((p) => {
              if (p.x === piece.x && p.y === piece.y && !(p.x === x && p.y === y && p.color !== piece.color)) {
                // Encuentra la pieza que está siendo movida y actualiza su posición
                return { ...p, x, y };
    
              } else if (p.x === x && p.y === y && p.color !== piece.color) {
                // Si la casilla de destino está ocupada por una pieza enemiga, cápturala
                captureOccurred = true;
                return null;
              } else {
                // Mantén inalteradas las otras piezas
                return p;
              }
            }).filter(Boolean); // Filtra las piezas para eliminar las null (piezas capturadas)
            
             if(captureOccurred) { 
             
                capturedAudio();
             
              }else{ 
                
                  soltarAudio();
                
              }
            // Solo actualizar el registro de movimientos una vez
            if (piece) {
              moveNomenclatura(piece, captureOccurred, x, y);
            }
      
            if (captureOccurred) {
              setCountNoCapture(0);
            } else {
              setCountNoCapture(prevCount => prevCount + 1);
            }
      
            localStorage.setItem('pieces', JSON.stringify(updatedPieces));
            return updatedPieces;
          });
        }
      };

      // const AceptarRevancha = async() => {
      //   resetBoard();
      //   const color = infUser?.color === 'white' ? 'black' : 'white';
      //   if(socket === null) return;
      //   setInfUser((prevInfUser) => ({
      //     ...prevInfUser,
      //     color: color,
      //   }));
      //   setUser((prevInfUser) => ({
      //     ...prevInfUser,
      //     color: color,
      //   }));
      //   socket.emit('aceptarRevancha', {revancha: true, room, color});
      //   const time = parseInt(localStorage.getItem('time')) || infUser?.time;
      //   socket.emit('initPlay', {gameId: room, time}); 
      //   localStorage.setItem('infUser', JSON.stringify(infUser));
      // };

      const revanchaHandle = () => {
        if(socket === null) return;
       if(room){
        socket.emit("send_revancha", {
          revancha: true, 
          room, 
        });
       }
        setSendRevancha(true);
      }

      const yesHandle = () => {
        if(socket === null) return;
        derrotaAudio();
        setModalAbandonar(false);
        setGameOver(true)
        isCheckMate('derrota');
        setUserWon(prev => ({
          ...prev, 
          username: auth?.user?.username,
          nameOpponent: infUser?.username, 
          idUser: auth?.user?._id,
          idOpponent: infUser?.idOpponent,
          turn: infUser?.color === 'white' ? 'white' : 'black',
          status: '0',
          color: infUser?.color === 'white' ? 'black' : 'white',
          photo: infUser?.photo
        }));
        setFrase(`por abandono de las ${infUser?.color === 'white' ? 'blancas' : 'negras'}`);
        if(room){
          socket.emit('sendAbandonar', {room, username: auth?.user?.username, idUser: auth?.user?._id, color: infUser?.color === 'white' ? 'black' : 'white'});
          socket.emit('gameEnd', room);
        }
      }

      const ofrecerTablas = () => {
        setLoadingTablas(true);
        setModalTablas(true);
        if(socket === null) return;
       if(room) socket.emit('sendTablas', {Tablas: true, room});
     }
     
     const aceptarTablas = () => {
       localStorage.removeItem('whiteTime');
       localStorage.removeItem('blackTime');
       localStorage.removeItem('whiteTimeEnd');
       localStorage.removeItem('blackTimeEnd');
       setFrase('por tablas aceptada');
       if(socket && room){
        socket.emit('aceptarTablas',room );
        socket.emit('gameEnd', room);
       }
       isCheckMate('empate');
       setModalTablas(false);
       setSendTablas(false);
       setModalTablasAceptada(true);
     }
   
     const cancelarTablas = () => {
       setLoadingTablas(false);
       setModalTablas(false);
       if(socket && room) socket.emit('cancelarTablas', room);   
     }

     const rechazarTablas = () => {
        setSendTablas(false);
        if(socket && room)  socket.emit('rechazarTablas', room);
      }
    
      const abandonarHandle = () => {
         setModalAbandonar(true);
      }
    
      const notHandle = () => {
        setModalAbandonar(false);
      }

      const postGames = useCallback(async (roomGame, resetPieces) => {
        try {
            await postRequest(`${baseUrl}/partida/user/games/create`, 
             JSON.stringify({
                gamesId: roomGame,
                pieces: resetPieces,
                piece: {},
                x: 0,
                y: 0,
                turn: 'white'
              })
            );
        } catch (error) {
            console.error('Error posting game:', error);
        }
      },[]);
      
      const gamesUpdate = useCallback(async (roomGame, pieces, piece, x, y, turn) => {
          try {
           
           await axios.put(`${baseUrl}/partida/user/games/update/${roomGame}`, {
              pieces,
              piece,
              x,
              y,
              turn,
            });
          } catch (error) {
            console.log('error', error);
          }
      },[]);     
    return <GameContext.Provider 
         value={{
            moveNomenclatura,
            whiteMoveLog, setWhiteMoveLog,
            blackMoveLog, setBlackMoveLog,
            moveLog, setMoveLog,
            countNoCapture, setCountNoCapture,
            currentTurn, setCurrentTurn,
            selectedPiece, setSelectedPiece,
            startCell, setStartCell,
            startCellRival, setStartCellRival,
            destinationCell, setDestinationCell,
            destinationCellRival, setDestinationCellRival,
            kingCheckCell, setKingCheckCell,
            enPassantTarget, setEnPassantTarget,
            pieceAux, setPieceAux,
            userWon, setUserWon,
            isPromotionModalOpen, setPromotionModalOpen,
            isPromotionComplete, setPromotionComplete,
            isModaltime, setModalTime,
            isGameOver, setGameOver,
            whiteTime, setWhiteTime,
            blackTime, setBlackTime,
            isWhiteTime, setIsWhiteTime, 
            modalTablas, setModalTablas,
            modalSendTablas, setSendTablas,
            aceptarRevancha, setAceptarRevancha,
            modalAbandonar, setModalAbandonar,
            modalRendicion, setModalRendicion, 
            sendRevancha, setSendRevancha,
            sendRevanchaRechada, setRevanchaRechazada,  
            tied, setTied,
            modalTiedRepetition, setModalTiedRepetition,
            frase, setFrase,
            showToast, setShowToast,
            color, setColor,
            textToast, setTextToast,
            isConnected, setIsConnected,
            playerDisconnected, setPlayerDisconnected,
            reconnectionTimeout, setReconnectionTimeout,
            modalTablasAceptada, setModalTablasAceptada,
            loadingTablas, setLoadingTablas,
            isRedTime, setIsReadTime,
            isCheckMate,
            resetBoard,
            handlePromotionSelection,
            handlePieceClick,
            handleTileClick,
            // AceptarRevancha,
            revanchaHandle,
            yesHandle,
            movePiece,
            ofrecerTablas,
            aceptarTablas,
            cancelarTablas,
            rechazarTablas,
            abandonarHandle,
            notHandle,
            formatTime,
            setWhiteTimeEnd,
            setBlackTimeEnd,
            postGames,
            gamesUpdate,
            infUser,
            setInfUser,
            games,
            isGameStart, setIsGameStart,
            counter, setCounter,
            modelRoom, setModelRoom,
            player1, player2, setPlayer1, setPlayer2
         }}
      >
         {children}
      </GameContext.Provider>
    
}