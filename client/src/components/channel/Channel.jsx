import React, { useContext, useEffect, useState } from 'react';
import style from './Channel.module.css';
import Chat from './Chat';
import { useSocketContext } from '../../context/socketContext/socketContext';
import { ChatContext } from '../../context/chatContext/ChatContext';
import { useAuth } from '../../context/authContext/authContext';
import { baseUrl, getRequest } from '../../utils/services';
import Row from 'react-bootstrap/Row';
import { useChessboardContext } from '../../context/boardContext/boardContext';
import { Alert } from 'react-bootstrap';
import { GameContext } from '../../context/gameContext/gameContext';
import Friends from './rooms/Friends';

const Channel = () => {

    const {auth} = useAuth();
    const {socket,  setAllUsers, setUser, allUsers} = useSocketContext(); 
    const [isRoom, setIsRoom] = useState(0);
    const [toggle, setToggle] = useState('Jugadores');
    const {chessColor} = useChessboardContext();
    const {infUser,setInfUser} = useContext(GameContext)

    let room = infUser.time ? parseInt(infUser.time) : isRoom;

    useEffect(()=>{
      const dataTime = localStorage.getItem('time');
      localStorage.removeItem('chessboard');
    
    if(!isNaN(dataTime) && dataTime) {
      setIsRoom(parseInt(dataTime));
      setInfUser((prevInfUser) => ({
        ...prevInfUser,
        time: parseInt(dataTime)
      }));
      socket.emit('userTime', {userId: auth?.user?._id, time: parseInt(dataTime)});
      socket.emit('join-room', isRoom);
    }
  },[auth?.user?._id, isRoom, setInfUser, socket]);
  
    useEffect(()=>{
      const User = async() => {
        const response = await getRequest(`${baseUrl}/user/${auth?.user?._id}`);
        if(response.error){
           return console.log('Error fetching users', response);
        }
        
        setUser((prev) => ({
         ...prev,
          _id: response?._id,
          username: response?.username,
          imagenBandera: response?.imagenBandera,
          photo: response?.photo,
          games: response?.games,
          gamesWon: response?.gamesWon,
          gamesLost: response?.gamesLost,
          gamesTied: response?.gamesTied,
          gamesBullet: response?.gamesBullet,
          gamesWonBullet: response?.gamesWonBullet,
          gamesLostBullet: response?.gamesLostBullet,
          gamesTiedBullet: response?.gamesTiedBullet,
          gamesBlitz: response?.gamesBlitz,
          gamesWonBlitz: response?.gamesWonBlitz,
          gamesLostBlitz: response?.gamesLostBlitz,
          gamesTiedBlitz: response?.gamesTiedBlitz,
          gamesFast: response?.gamesFast,
          gamesWonFast: response?.gamesWonFast ,
          gamesLostFast: response?.gamesLostFast,
          gamesTiedFast: response?.gamesTiedFast,
          rachaBullet: response?.rachaBullet,
          rachaBlitz: response?.rachaBlitz,
          rachaFast: response?.rachaFast,
          eloBullet: response?.eloBullet,
          eloBlitz: response?.eloBlitz,
          eloFast: response?.eloFast,
          country: response?.country,
        }));
        localStorage.setItem('userChess',
        JSON.stringify({
          _id: response?._id,
          username: response?.username,
          imagenBandera: response?.imagenBandera,
          photo: response?.photo,
          games: response?.games,
          gamesWon: response?.gamesWon,
          gamesLost: response?.gamesLost,
          gamesTied: response?.gamesTied,
          gamesBullet: response?.gamesBullet,
          gamesWonBullet: response?.gamesWonBullet,
          gamesLostBullet: response?.gamesLostBullet,
          gamesTiedBullet: response?.gamesTiedBullet,
          gamesBlitz: response?.gamesBlitz,
          gamesWonBlitz: response?.gamesWonBlitz,
          gamesLostBlitz: response?.gamesLostBlitz,
          gamesTiedBlitz: response?.gamesTiedBlitz,
          gamesFast: response?.gamesFast,
          gamesWonFast: response?.gamesWonFast ,
          gamesLostFast: response?.gamesLostFast,
          gamesTiedFast: response?.gamesTiedFast,
          rachaBullet: response?.rachaBullet,
          rachaBlitz: response?.rachaBlitz,
          rachaFast: response?.rachaFast,
          eloBullet: response?.eloBullet,
          eloBlitz: response?.eloBlitz,
          eloFast: response?.eloFast,
          country: response?.country,
        }
       ));
      }   
      User();
    },[auth?.user?._id, setUser]);

    useEffect(() => {
      localStorage.removeItem('destinationCell');
      localStorage.removeItem('startCell');
      localStorage.removeItem('pieces'); 
      localStorage.removeItem('whiteTime');
      localStorage.removeItem('blackTime');
      const getUsers = async() =>{
       
        const response = await getRequest(`${baseUrl}/users`);

         if(response.error){
            return console.log('Error fetching users', response);
         }
          setAllUsers(response);
       }
    
      getUsers();
    
    }, [setAllUsers]);

    const toggleTab = (text) => {
       setToggle(text)
    }
  return (
    <div className={style.contenedor} style={{background: chessColor?.fondo}}> 
       <div className={style.imageBackground}>
       {!socket && <div>
        <Alert variant='warning'>
          has perdido la conexion, !vuelve a recargar la pagina!
        </Alert> 
        </div>}   
      <div className={style.flex}>
        <Row 
          className={style.div2}       
        >
          <Chat 
            room={room}
            username={auth?.user?.username}
            socket={socket}         
          />
        </Row>
        <Row className={style.div3}>
          <Friends friends={allUsers} room={room}/>
        </Row>
      </div>
      <div 
        className={style.tabsContainer}
        style={toggle === 'Jugadores' ? {backgroundImage: `url(/fondos/fondoFriends01.png)`} : {backgroundImage: `url(/fondos/fondoChat1.png)`}}
      >
          <div className={style.blocTabs}>
             <div 
               className={toggle === 'Chat' ? `${style.tabs} ${style.activeTabs} ` : `${style.tabs}`}
               style={toggle === 'Chat' ? {background: 'rgba(0,0,0,.5)'} : {background: 'rgba(0,0,0,.15)'}}
               onClick={()=>toggleTab('Chat')}
             >
                <img src="/icon/chat.png" style={{width: '40px', marginRight: '10px'}} alt="" />
                Chat Live
             </div>
             <div 
               className={toggle === 'Jugadores' ? `${style.tabs} ${style.activeTabs} ` : `${style.tabs}`}
               style={toggle === 'Jugadores' ? {color:'#fff', background: 'rgba(0,0,0,.5)'} : {background: 'rgba(0,0,0,.15)'}}
               onClick={()=>toggleTab('Jugadores')}
             >
              <img src={chessColor.fondoUsers} style={{width: '40px', marginRight: '10px'}} alt="" />
                Jugadores
              
              </div>
          </div>
          <div className={style.contentTabs}>
             <div className={toggle === 'Chat' ? `${style.activeContent}` : `${style.content}`}>
                <Chat 
                  room={room}
                  username={auth?.user?.username}
                  socket={socket}         
                />
             </div>
             <div className={toggle === 'Jugadores' ? `${style.activeContent}` : `${style.content}`}>
               <Friends friends={allUsers} room={room}/>
             </div>
          </div>
      </div>
       </div>
    </div>
  );
};

export default Channel;