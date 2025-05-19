import React from 'react';
import style from './ModalTablasAceptada.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authContext';
import { useSocketContext } from '../../context/socketContext/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext/checkMateContext';

export default function ModalTiedRepetition({infUser, revanchaHandle, frase}) {

    const navigate = useNavigate();
    const {auth} = useAuth();
    const {socket, room} = useSocketContext();
    const {setCheckMate} = useCheckMateContext();

    const regresarHandle = () => {
        if(socket === null) 
        if (auth?.user) {  
          setCheckMate(null);   
           socket.emit('join-room', infUser?.time);
           socket.emit('userAvailable', auth?.user?._id);
           socket.emit('deletePartida', {room: infUser?.time, roomPartida: room});
          navigate('/auth/channel');
        }else{
          navigate('/login');
        }
      }

  return (
    <div className={style.overlay}>
        <div className={style.gameOverModal}>
          <h2>{frase ? frase : 'tablas'}</h2> 
          <img className={style.profileChekMate} src={infUser?.photo} alt='assets/avatar/user.png'  />
          <img className={style.profileChekMate} src={auth?.user?.photo} alt='assets/avatar/user.png'  />
          <div className={style.button}>
          <button onClick={regresarHandle}>Regresar</button>
          <button onClick={revanchaHandle}>Revancha</button>
        </div>
        </div>
      </div>
  )
}