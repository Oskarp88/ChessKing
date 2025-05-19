import React, { useContext, useEffect, useState } from 'react';
import style from './Modal.module.css'; // Asegúrate de importar correctamente el archivo CSS
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authContext';
import { useSocketContext } from '../../context/socketContext/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext/checkMateContext';
import { BlitzSvg, BulletSvg, FastSvg } from '../../svg';
import { GameContext } from '../../context/gameContext/gameContext';
import { Spinner } from 'react-bootstrap';

const Modal = ({infUser, user}) => {
  const navigate = useNavigate();
  const {auth} = useAuth();
  const {socket, room} = useSocketContext();
  const {setCheckMate} = useCheckMateContext();
  const {isWhiteTime, revanchaHandle} = useContext(GameContext);

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
          socket.emit('join-room', infUser?.time);
          socket.emit('userAvailable', auth?.user?._id);
          socket.emit('deletePartida', {room: infUser?.time, roomPartida: room});
        }
        navigate('/auth/channel');
      } else {
        navigate('/login');
      }
    }
  }, [redirecting, countdown, auth?.user, infUser?.time, navigate, room, setCheckMate, socket]);

  const regresarHandle = () => {
   setRedirecting(true)
  }

  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <div className={style.header}>
        <h2>{isWhiteTime === 'white' ? 'Negras' : 'Blancas'} ganan</h2>
        <p>por tiempo agotado de las {isWhiteTime === 'white' ? 'Blancas' : 'Negras'}</p>
        </div>
       <div className={style.body}>
           <div className={style.image}>
           {infUser.color === 'white'? 
            <img 
              className={style.profileChekMate} 
              style={isWhiteTime === 'white' ? {border: 'solid 7px #D32F2F' } : {border: 'solid 7px #388E3C' }} 
              src={auth?.user?.photo} 
              alt='assets/avatar/user.png'  />
            : <img 
              className={style.profileChekMate} 
              style={isWhiteTime === 'white' ? {border: 'solid 7px #D32F2F' } : {border: 'solid 7px #388E3C' }} 
              src={infUser?.photo} 
              alt='assets/avatar/user.png'/>}
                <div className={style.time}>
                  {infUser?.time === 1 || infUser?.time === 2 ? <BulletSvg/> : infUser?.time === 3 || infUser?.time === 5 ? <BlitzSvg/> : <FastSvg/>}
                </div>
            {
              infUser.color === 'black'? 
              <img 
                className={style.profileChekMate}
                style={isWhiteTime !== 'white' ? {border: 'solid 7px #D32F2F' } : {border: 'solid 7px #388E3C' }}  
                src={auth?.user?.photo}
                alt='assets/avatar/user.png'  />
              : <img 
                  className={style.profileChekMate}
                  style={isWhiteTime !== 'white' ? {border: 'solid 7px #D32F2F' } : {border: 'solid 7px #388E3C' }}  
                  src={infUser?.photo} 
                  alt='assets/avatar/user.png'/>
            }
           </div>
           <div className={style.tittle}> 
            {`${infUser.color === 'white' ? 
                 `${user?.username} ${isWhiteTime === 'white' ? '| 0' : '| 1'}`: 
                 `${infUser?.username} ${isWhiteTime !== 'white' ? '| 1' : '| 0'} -`} 
              ${infUser.color === 'black' ? 
                 `${isWhiteTime === 'white' ? '1 |' : '0 |'} ${user?.username} `: 
                 `- ${isWhiteTime !== 'white' ? '0 |': '1 |'} ${infUser?.username}`}
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
};

export default Modal;
