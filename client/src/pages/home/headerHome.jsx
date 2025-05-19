import React from 'react';
import style from './Home.module.css';
import { useAuth } from '../../context/authContext/authContext';
import { useChessboardContext } from '../../context/boardContext/boardContext';
import { useLanguagesContext } from '../../context/languagesContext/languagesContext';
import { useNavigate } from 'react-router-dom';

function HeaderHome({joinRoom, miContaineHistorial}) {
    const {auth} = useAuth();
    const {chessColor} = useChessboardContext();
    const {language} = useLanguagesContext();
    const navigate = useNavigate();

    const vsComputer = () => {
      navigate('/games-time');
    }

  return (
    <div className={style.homestyle}>
            <img src={'logo/chessfiveLogo.png'} className={style.logo} alt="" />
            <div className={style.containerWelcome}>
              <h1 
                className={style.titulo} 
              >           
                {language?.welcome_to} 
                {' '}
                {auth?.user?.name 
                    ? auth.user.name.length > 8 
                        ? auth.user.name.charAt(0).toUpperCase() + auth.user.name.substring(1, 8) + '...' 
                        : auth.user.name.charAt(0).toUpperCase() + auth.user.name.slice(1)
                    : ''
                }

              </h1>
              <p style={{color: chessColor?.color}}>
                {language?.play_chess_online_and_improve_your_skills}
              </p>
            </div>
                        
              <button 
                className={style.wrapper}
                onClick={vsComputer}
              >
                {'play vs computer'} 
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button> 
              <button 
                className={style.wrapper}
                onClick={joinRoom}
                ref={miContaineHistorial}
              >
                {language?.join_a_room} 
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>             
          </div> 
  )
}

export default HeaderHome;