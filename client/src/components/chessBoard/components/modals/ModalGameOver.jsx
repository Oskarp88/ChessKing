import React, { useState, useEffect, useContext } from 'react';
import style from './ModalGameOver.module.css';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../../../../context/gameContext/gameContext';
import { useSocketContext } from '../../../../context/socketContext/socketContext';
import { useCheckMateContext } from '../../../../context/checkMateContext/checkMateContext';
import { useAuth } from '../../../../context/authContext/authContext';
import { assetsManager } from '../../../../utils/constants/assetsManager';
import BulletSvg from '../../../../svg/bulletSvg';
import BlitzSvg from '../../../../svg/blitzSvg';
import FastSvg from '../../../../svg/fastSvg';
import { Spinner } from 'react-bootstrap';
import { useWindowHeight, useWindowWidth } from '../../../../hooks/useWindowWidth';


export default function ModalGameOver({timeType, frase, textSpinner, scoreMePlayer, scoreOtherPlayer, colorType, turn }) {
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket} = useSocketContext();
  const { setCheckMate } = useCheckMateContext();
  const {revanchaHandle} = useContext(GameContext);
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const width = useWindowWidth();
  const height = useWindowHeight();

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
      if (user) {
        setCheckMate(null);
        // if(socket){
        // }
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [redirecting, countdown, navigate, setCheckMate, socket, user]);

  const regresarHandle = () => {
    
    setRedirecting(true);
  };

  return (
    <div className={style.overlay}>
      <div 
        className={style.gameOverModal}
        style={{
            height: height > 450 ?'28rem': height *0.5,
            width: height > 450 ? '19rem' : width * 0.8
        }}
      >
        <div className={style.container}>
          <h3>{turn === 'w' ? 'Negras' : 'Blancas'} ganan</h3>
          
        </div>
        <div className={style.body}>
          <p className={style.frase}>{frase}</p>
          <div className={style.image}>
          <img 
             className={style.profileChekMate}
             style={colorType === 'w' 
                ? scoreMePlayer === '0' 
                   ? {border: 'solid 7px #D32F2F'} 
                   : scoreMePlayer === '1' 
                     ? {border: 'solid 7px #388E3C'} 
                     : {border: 'solid 7px #9e9e9e'} 
                : scoreOtherPlayer === '0' 
                   ? {border: 'solid 7px #D32F2F'} 
                   : scoreMePlayer === '1'
                     ? {border: 'solid 7px #388E3C'} 
                     : {border: 'solid 7px #9e9e9e'} 
            } 
             src={colorType === 'w' ?  user?.photo : assetsManager.imagebots[0]}
             alt='' />
          <div className={style.time}>
            {timeType === "Bullet" 
              ? <BulletSvg/> 
              : timeType === 'Blitz' 
                ? <BlitzSvg/> 
                : <FastSvg/>}
          </div>
          <img 
             className={style.profileChekMate} 
             style={colorType === 'b' 
                ? scoreMePlayer === '0' 
                ? {border: 'solid 7px #D32F2F'} 
                : scoreMePlayer === '0' 
                  ? {border: 'solid 7px #388E3C'} 
                  : {border: 'solid 7px #9e9e9e'} 
             : scoreOtherPlayer === '0' 
                ? {border: 'solid 7px #D32F2F'} 
                : scoreMePlayer === '1'
                  ? {border: 'solid 7px #388E3C'} 
                  : {border: 'solid 7px #9e9e9e'}
             } 

             src={colorType === 'b' ?  user?.photo : assetsManager.imagebots[0]} 
            alt='' />
          </div>
          <div className={style.tittle}> 
             {colorType === 'w' 
                 ? `| ${scoreMePlayer} - ${scoreOtherPlayer} |`
                 : `| ${scoreOtherPlayer} - ${scoreMePlayer} |`
            } 
          </div>
          {redirecting ? (
            <div className={style.redirecting}>
              <Spinner animation="border" variant="primary" />
              <p className={style.dirigiendo}>Dirigiendo {textSpinner} en {countdown} segundos...</p>
            </div>
          
          ) : (
            <div className={style.button}>
              <button onClick={regresarHandle}><p>Salir</p></button>
              <button onClick={revanchaHandle}><p>Nuevo Juego</p></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
