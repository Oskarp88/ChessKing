import React, { useContext } from 'react'
import { useAuth } from '../../context/authContext/authContext'
import style from './ButtonModal.module.css'
import { useSocketContext } from '../../context/socketContext/socketContext';
import { useNavigate } from 'react-router-dom';
import { useCheckMateContext } from '../../context/checkMateContext/checkMateContext';
import { useModalContext } from '../../context/modalContext/modalContext';
import { GameContext } from '@/context/gameContext/gameContext';


function ButtonModal({time, onSocket, emitSocket, text, elo}) {
    const {setShowModalMin} = useModalContext();    
    const {auth, user} = useAuth();
    const {socket, setOnlineUsersRoom} = useSocketContext();
    const {setInfUser} = useContext(GameContext);
    const navigate = useNavigate();
    const {setCheckMate} = useCheckMateContext();

     const createRoom = () => {
        if(socket === null) return;
        if (auth?.user) {  
            setCheckMate(null); 
            setInfUser((prevInfUser) => ({
            ...prevInfUser,
            time: parseInt(time)
            }));
            localStorage.setItem('time', time);
            localStorage.setItem('typeRoom', onSocket);
            socket.emit(emitSocket, {
                Id: user._id,
                username: user.username,
                flags: user.imagenBandera,
                elo,
                photo: user.photo,
                marco: user.marco,
                score: user.score,
            });
            socket.on(`getRoom_${onSocket}`, (data) => {
              setOnlineUsersRoom(data);
            });
            navigate('/auth/channel');            
            setShowModalMin(false);
            return () => {
               socket.off('getOnlineUsers');
            }           
        }else{
            navigate('/login');
            setShowModalMin(false);
        }
    };

  return (
    <div className={style.containerButtons}>
        <a 
            className={style.a} 
            onClick={() => createRoom()}
        >
            {text}
            <div className={style.icon}>
            <div className={style.arrow}></div>
            </div>
        </a>
        {/* <p className={style.playersTotal}>{ `(${playersTotal.uno} players)`}</p> */}
    </div>
  )
}

export default ButtonModal