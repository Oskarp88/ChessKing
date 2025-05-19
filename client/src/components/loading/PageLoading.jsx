import React, { useContext, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import style from './PageLoading.module.css'
import { useSocketContext } from '../../context/socketContext/socketContext'
import { GameContext } from '../../context/gameContext/gameContext';
import { useAuth } from '../../context/authContext/authContext';
import { useNavigate } from 'react-router-dom';

function PageLoading() {
    const {socket} = useSocketContext();
    const {setModelRoom, setPlayer1, setPlayer2} = useContext(GameContext);
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
      if(!socket) return;
      socket.on('updateRoom',(room)=>{
        setModelRoom(room);
      });
      socket.on('updatePlayers', (players)=>{
         if(user?.username === players[0].username) {
            setPlayer1(players[0]);
            setPlayer2(players[1]);
            navigate('/chess');
         }else{
            setPlayer1(players[1]);
            setPlayer2(players[0]);
            navigate('/chess');
         }        
      })
    },[socket]);
  return (
    <div className={style.loading}>
     <p className={style.text}>Cargando Partida...</p>
     <Spinner animation="grow" style={{color: '#154360'}}/>
    </div>
  )
}

export default PageLoading