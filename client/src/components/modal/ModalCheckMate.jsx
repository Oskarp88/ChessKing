import React, { useState, useEffect, useContext } from 'react';
import style from './ModalCheckMate.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authContext';
import { useSocketContext } from '../../context/socketContext/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext/checkMateContext';
import FastSvg from '../../svg/fastSvg';
import { BlitzSvg, BulletSvg } from '../../svg';
import { GameContext } from '../../context/gameContext/gameContext';
import { Spinner } from 'react-bootstrap';

export default function ModalCheckMate({ infUser, time, frase }) {
  
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { socket, room } = useSocketContext();
  const { setCheckMate } = useCheckMateContext();
  const {revanchaHandle} = useContext(GameContext);
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let interval;
    if (redirecting) {
      interval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [redirecting]);

  useEffect(() => {
    if (redirecting && countdown === 0) {
      if (auth?.user) {
        setCheckMate(null);
        if(socket){
          socket.emit('join-room', time);
          socket.emit('userAvailable', auth?.user?._id);
          socket.emit('deletePartida', { room: infUser?.time, roomPartida: room });
        }
        navigate('/auth/channel');
      } else {
        navigate('/login');
      }
    }
  }, [redirecting, countdown, auth?.user, infUser?.time, navigate, room, setCheckMate, socket, time]);

  const regresarHandle = () => {
    
    setRedirecting(true);
  };

  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <div className={style.container}>
          <h3>{infUser?.turn === 'white' ? 'Negras' : 'Blancas'} ganan</h3>
          <p>{frase}</p>
        </div>
        <div className={style.body}>
          <div className={style.image}>
          <img 
             className={style.profileChekMate}
             style={infUser && infUser?.color === 'white' ? infUser?.status === '1' ? {border: 'solid 7px #D32F2F'} : {border: 'solid 7px #388E3C '} :  infUser?.status === '1' ?  {border: 'solid 7px #388E3C '} : {border: 'solid 7px #D32F2F'} } 
             src={infUser && infUser?.color === 'white' ?  infUser?.photo : auth?.user?.photo}
             alt='' />
          <div className={style.time}>
            {time === 60 || time === 120 ? <BulletSvg/> : time === 180 || time === 300 ? <BlitzSvg/> : <FastSvg/>}
          </div>
          <img 
             className={style.profileChekMate} 
             style={infUser && infUser?.color === 'black' ? infUser?.status === '1' ? {border: 'solid 7px #D32F2F'} : {border: 'solid 7px #388E3C '} :  infUser?.status === '1' ?  {border: 'solid 7px #388E3C '} : {border: 'solid 7px #D32F2F'} } 

             src={infUser && infUser?.color === 'black' ? infUser?.photo : auth?.user?.photo} 
            alt='' />
          </div>
          <div className={style.tittle}> 
            {`${infUser?.color === 'white' ? 
                 `${infUser?.nameOpponent} ${infUser?.status === '1' ? '| 0' : '| 1'}`: 
                 `${infUser?.username} ${infUser?.status === '1' ? '| 1' : '| 0'} -`} 
              ${infUser.color === 'black' ? 
                 `${infUser?.status === '1' ? '0 |' : '1 |'} ${infUser?.nameOpponent} `: 
                 `- ${infUser?.status === '1' ? '1 |': '0 |'} ${infUser?.username} `}
              `} 
          </div>
          {redirecting ? (
            <div className={style.redirecting}>
              <Spinner animation="border" variant="primary" />
              <p className={style.dirigiendo}>Dirigiendo a sala de juego en {countdown} segundos...</p>
            </div>
          
          ) : (
            <div className={style.button}>
              <button onClick={regresarHandle}><p>Regresar</p></button>
              <button onClick={revanchaHandle}><p>Revancha</p></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
