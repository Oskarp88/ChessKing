import React, { useContext, useEffect, useState } from 'react';
import style from'./Friends.module.css';
import { useNavigate } from 'react-router-dom';
import ModalProfile from '../modal/ModalProfile';
import { useChessboardContext } from '../../../context/boardContext/boardContext';
import { GameContext } from '../../../context/gameContext/gameContext';
import { ChatContext } from '../../../context/chatContext/ChatContext';
import { useSocketContext } from '../../../context/socketContext/socketContext';
import JoinRoom from '../../modal/JoinRoom';
import SettingsModal from '../../modal/SettingsModal';
import { valors } from "@/Constants";
import SpinnerDowloand from '../../spinner/SpinnerDowloand';
import { baseUrl, getRequest } from '../../../utils/services';
import { useLanguagesContext } from '../../../context/languagesContext/languagesContext';
import { useAuth } from '../../../context/authContext/authContext';
import HeaderRooms from './components/headerRooms';
import ListPlayers from './components/ListPlayers';
import ModalSendChallenger from '../modal/ModalSendChallenger';
import ModalReceiveChallenger from '../modal/modalReceiveChallenger';
import { useModalContext } from '../../../context/modalContext/modalContext';


const Friends = () => {
  
  const {setPieces, resetPieces} = useChessboardContext();
  const{resetBoard, infUser, setIsGameStart, modelRoom, setModelRoom, setPlayer2} = useContext(GameContext);
  const { createChat, userChats, updateCurrentChat, onlineUsers} = useContext(ChatContext);
  const [showModalSettings, setShowSettings] = useState();
  const {showModalMin, setShowModalMin} = useModalContext();
  const [hoveredFriend, setHoveredFriend] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalInf, setShowModalInf] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [next, setNext] = useState(0);
  const [showModalOpponent, setShowModalOpponent] = useState(false);
  const [aceptarDesafio, setAceptarDesafio] = useState(false)
  const [userModal, setUserModal] = useState(null);
  const [userOpponentModal, setUserOpponentModal] = useState(null);
  const [isOffGame, setOffGame] = useState(false);
  const [photo, setPhoto] = useState('');
  const [isExisteUser, setIsExisteUser] = useState(false);
  const [userInf, setUserInf] = useState({});
  const {auth, user} = useAuth();
  const navigate = useNavigate();
  const {socket, setRoom, userChess,  setOnline, onlineUsersRoom,  setOnlineUsersRoom }= useSocketContext();
  const {language} = useLanguagesContext();
  const [idOponnent, setIdOponnent] = useState('');
  // const desafiadoAudio = new Audio('/to/ding.mp3'');
  // desafiadoAudio.volume = 0.1;
  // const rechazadoAudio = new Audio('/path/to/Splat.mp3');
  // rechazadoAudio.volume = 0.1;

console.log('modelRoom',modelRoom);

 const typeRoom = localStorage.getItem('typeRoom');
 console.log('typeRoom', typeRoom)
//  console.log('onlineUsersRoom', onlineUsersRoom);
 const sortedUsers = 
  onlineUsersRoom && 
  onlineUsersRoom[typeRoom] && 
  Array.isArray(onlineUsersRoom[typeRoom])
    ? onlineUsersRoom[typeRoom].slice().sort((a, b) => b.elo - a.elo)
    : [];

//  console.log('sortedUsers', sortedUsers);
 useEffect(()=>{
  const existeUser = onlineUsersRoom 
    &&  onlineUsersRoom[typeRoom]?.some(user => user.userId === auth?.user?._id);

  if (existeUser) {
    setIsExisteUser(true);
  } else {
    setIsExisteUser(false);
  } 
},[onlineUsersRoom, isExisteUser, typeRoom, auth?.user?._id]);

  const handleModalOpen = (friend) => {
    setUserModal(friend);
    setShowModal(true);
    setOffGame(false);
  };

  const handleModalClose = () => {
    setShowModal(false);  
    setAceptarDesafio(false);
    setIsShowModal(false);
    if(socket === null) return;
    const roomKey = localStorage.getItem('typeRoom');
    socket.emit('cancelChallenge', {isCancel: true, roomId: modelRoom._id, idOponnent: userModal.userId});
    socket.emit('userNotBusy',{userId: auth?.user?._id, roomKey });
    setUserModal(null);
  };

  const handleModalOpponentOpen = (friend) => {
    setUserOpponentModal(friend)
    setShowModalOpponent(true);
  };

  const handleModalOpponentClose = () => {
    setShowModalOpponent(false);
    setUserOpponentModal(null);
    if(socket === null) return;
    const roomKey = localStorage.getItem('typeRoom');
     socket.emit('rejectChallenge', {isCancel: true, roomId: modelRoom._id});
     socket.emit('userNotBusy',{userId: auth?.user?._id, roomKey });
  };

  //cuando se rechaza el desafio
  const offGame = () => {
    setShowModalOpponent(false);
    if(socket === null) return;
     const roomKey = localStorage.getItem('typeRoom');
     socket.emit('rejectChallenge', {isCancel: true, roomId: modelRoom._id}); 
     socket.emit('userNotBusy',{userId: auth?.user?._id, roomKey });
  };

  useEffect(() => {
    if(socket === null) return;
     //reicibiendo el desafio
     const roomKey = localStorage.getItem('typeRoom');

     socket.on('createRoomSuccess', (data)=> {
      console.log('createRoomSuccess', data);
       if(data.id === auth?.user?._id || data.idOponnent === auth?.user?._id){
           setModelRoom(data.room);
          if(data.idOponnent === auth?.user?._id){
            handleModalOpponentOpen(data.room.players[0]);
            setPlayer2(data.room.players[0]);
            const player2 = data.room.players[0]; // Supongamos que esto es un objeto
            localStorage.setItem('player2', JSON.stringify(player2));         
            localStorage.setItem('idOponnent', data.id);
            setIdOponnent(data.id);
            console.log(`te ha desafiado el id: ${data.id}`);
          }
       }
     });
   socket.on("connect", () => {
      console.log("Conexión al servidor establecida.");
      const dataTime = localStorage.getItem('time');
    
    if(!isNaN(dataTime) && dataTime) {
      socket.emit('userTime', {userId: auth?.user?._id, time: parseInt(dataTime)});
      socket.emit('join-room', parseInt(dataTime));
    } 
    });
     // Manejar el evento "disconnect" para detectar desconexiones
     socket.on("disconnect", () => {   
        console.log("Disconnected without a specified reason.");      
      //medidas específicas en caso de desconexión aquí, volver a conectar automáticamente o mostrar un mensaje de error al usuario.
    });
    socket.on("reconnect", (attemptNumber) => {
      console.log(`Reconectado en el intento ${attemptNumber}`);
      // Realiza cualquier lógica adicional que necesites después de la reconexión
    });

    
     
    socket.on('receivePlayGame',(data) => {
      //datos recibidos de quien acepto el desafio 
      setIsGameStart(true);
      localStorage.setItem('gameStart', JSON.stringify(true));
      setPieces(resetPieces);
      localStorage.setItem('bandera', data?.bandera);
      setRoom(data?.roomGame);
      socket.emit('joinRoomGamePlay', data?.roomGame);
      socket.emit('oponnetConnect', {gameId: data?.roomGame, idUser: auth?.user?._id, idOponnent: data?.idOponnent});
      const time = parseInt(localStorage.getItem('time')) || infUser?.time; 
      socket.emit('initPlay', {gameId: data?.roomGame, time}); 
      socket.emit('partida', 
        {
           idUser: auth?.user?._id,
           idOpponent: data?.idOpponent,
           roomPartida: data?.roomGame,
           room: infUser?.time,
           username: data?.username,
           username2: auth?.user?.username || auth?.user?.name,
        });
      if(data?.showModalOpponent){
        socket.emit('userBusy', auth?.user?._id); 
        localStorage.setItem('infUser', JSON.stringify(infUser));
        navigate('/chess');
      }  
    });

    socket.on('rejectChallengeReceive',(data) => {

      if(data){
        //  rechazadoAudio.play();
         setOffGame(data);
         setAceptarDesafio(false);
         socket.emit('userNotBusy', {userId: auth?.user?._id, roomKey });
      }    
    });

    socket.on('cancelChallengeReceive',(data) => {
      // const idOponnent = localStorage.getItem('idOponnent');
      // console.log('idOponnent:', idOponnent)
      // console.log('cancelChallengeReceive', data );
      if(data?.isCancel){
        if(data.idOponnent === auth?.user?._id){
           localStorage.removeItem('idOponnent');
           setShowModalOpponent(false);
           socket.emit('userNotBusy',{userId: auth?.user?._id, roomKey });
        }
      }
    });
    socket.on(`getRoom_${roomKey}`, (data) => {
      setOnlineUsersRoom(data);
    });
     
    return () => {
      if (socket === null) return;
      socket.off('createRoomSuccess');
    };
    
  }, [
       socket, 
       isOffGame, 
       aceptarDesafio, 
       auth.user, 
       onlineUsersRoom, 
       idOponnent,
       resetPieces,
       infUser,
       navigate,
       setIsGameStart,
       setModelRoom,
       setOnlineUsersRoom,
       setPieces,
       setRoom, 
       setPlayer2
    ]);

  //enviar desafio
  const createGame = (userOpponent) =>{
    resetBoard();
    let colorRamdon = Math.random() < 0.5 ? 'white' : 'black';
    if(socket === null) return;
     setAceptarDesafio(true);
     setOffGame(false);
     setIsShowModal(false);
     const roomKey = localStorage.getItem('typeRoom');
     socket.emit('busyUser', {userId: auth?.user?._id, roomKey});   
     const time = localStorage.getItem('time');
     socket.emit('createRoom', {     
       id: auth?.user?._id,
       idOponnent: userOpponent.userId,
       username: user?.username,
       photo: user?.photo,
       marco: user?.marco,
       flags: userChess?.imagenBandera,
       timeType: time,
       elo: time === 'fast' 
         ? user.eloFast
         : time === 'blitz'
           ? user.eloBlitz 
           : user.eloBullet,
       score: user.score,
       playerType: colorRamdon,
       money: parseInt(valors[next].moneda),
       shortNumberMoney: valors[next].valor,           
     });   
  }
  
  //cuando el desafiado acepta
  const acceptChallenge = () => {
    resetBoard();
    setPieces(resetPieces);
    setShowModalOpponent(false); 
    const time = localStorage.getItem('time');
    if(socket === null) return;
     socket.emit('acceptChallenge', {
       id: auth?.user?._id,
       roomId: modelRoom._id,
       username: user?.username,
       photo: user?.photo,
       marco: user?.marco,
       flags: user.imagenBandera,
       timeType: time,
       elo: time === 'fast' 
              ? user.eloFast
              : time === 'blitz'
                ? user.eloBlitz 
                : user.eloBullet,
      score: user.score,

     });
     const roomKey = localStorage.getItem('typeRoom');
     socket.emit('userNotAvailable',{userId: auth?.user?._id, roomKey});
     localStorage.setItem('infUser', JSON.stringify(infUser));
     setIsGameStart(true);
     localStorage.setItem('gameStart', JSON.stringify(true));
     socket.emit('userNotBusy', {userId: auth?.user?._id, roomKey });
     navigate('/loading');    
  };

  const handleModalInf = async(userId) => {
    const response = await getRequest(`${baseUrl}/user/${userId}`);
    if(response.error){
       return console.log('Error fetching users', response);
    }

    setUserInf(response);
    setPhoto(userId);
    setShowModalInf(true);
  }

  const handleModalCloseInf = () => {
    setShowModalInf(false)
  }

  const mensajeChat = async(idFirst, idSecond) => {
     //buscamos en userChats el chat
     const chat = userChats.find(chat => 
      (chat.members.includes(idFirst) && chat.members.includes(idSecond))
    );
     
    if(!chat){
      //si no existe el chat ps se crea
      await createChat(idFirst, idSecond);
      updateCurrentChat(chat); //accder al chat
    }else{
      //si ya existe ps accedemos al chat
     updateCurrentChat(chat);
    }

          updateCurrentChat(chat);

     navigate('/auth/chat');
  }

  const handleSignOut = ()=>{
    setOnline(onlineUsers);
    setShowModalMin(true);
  }
  return (
   <>
      <div className={style.tercerdiv}> 
         <div className={style.container}>
            <HeaderRooms 
              handleSignOut={handleSignOut}
              setShowSettings={setShowSettings}
            />      
            <div>  
            </div>      
            {sortedUsers.length === 0 ?          
              <SpinnerDowloand text={`${language.Loading_Players} . . .`} color={'#fff'}/>         
            : sortedUsers.map((o, index) => (
              <React.Fragment key={index}>
              { isExisteUser ?
                <ListPlayers 
                  handleModalOpen={handleModalOpen}
                  hoveredFriend={hoveredFriend}
                  setHoveredFriend={setHoveredFriend}
                  user={o}
                /> :
                <p className={style.reconnect}>Recarga la pagina para reconectarte a la sala</p>
              }
              {showModal && (
                 <ModalSendChallenger 
                   aceptarDesafio={aceptarDesafio}
                   isOffGame={isOffGame}
                   showModal={o}
                   showModalMin={isShowModal}
                   userModal={userModal}
                   createGame={createGame}
                   mensajeChat={mensajeChat}
                   next={next}
                   setNext={setNext}
                   handleModalClose={handleModalClose}
                   handleModalInf={handleModalInf}
                 />
                )}
                {showModalOpponent && (
                  <ModalReceiveChallenger 
                    handleModalInf={handleModalInf}
                    handleModalOpponentClose={handleModalOpponentClose}
                    next={next}
                    offGame={offGame}
                    playGame={acceptChallenge}
                    showModalOpponent={showModalOpponent}
                    userModal={userModal}
                    userOpponentModal={userOpponentModal}
                  />
                )}
                 { 
                    showModalInf && 
                      <ModalProfile 
                        user={userInf}
                        nivel={`${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                        infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                        'fast' }`}
                        handleModalClose={handleModalCloseInf}
                        photo={photo}
                        elo={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.eloBullet :
                        infUser?.time === 180 || infUser?.time === 300 ? userInf.eloBlitz :
                        userInf.eloFast}`}
                        games={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.gamesBullet :
                          infUser?.time === 180 || infUser?.time === 300 ? userInf.gamesBlitz :
                          userInf.gamesFast}`}
                        gamesWon={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.gamesWonBullet :
                          infUser?.time === 180 || infUser?.time === 300 ? userInf.gamesWonBlitz :
                          userInf.gamesWonFast}`}
                        gamesTied={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.gamesTiedBullet :
                          infUser?.time === 180 || infUser?.time === 300 ? userInf.gamesTiedBlitz :
                          userInf.gamesTiedFast}`}
                        gamesLost={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.gamesLostBullet :
                          infUser?.time === 180 || infUser?.time === 300 ? userInf.gamesLostBlitz :
                          userInf.gamesLostFast}`}
                          racha={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.rachaBullet :
                            infUser?.time === 180 || infUser?.time === 300 ? userInf.rachaBlitz :
                            userInf.rachaFast}`}
                      /> 
                  } 
          </React.Fragment>
        ))}
         </div>     
    </div>
    <SettingsModal 
      show={showModalSettings}
      handleClose={()=> setShowSettings(false)}
    />
    { showModalMin &&
        <JoinRoom/>
      }
   </>
  );
};

export default Friends;