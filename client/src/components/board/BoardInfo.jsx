import { useContext } from 'react';
import { useAuth } from '../../context/authContext/authContext';
import { useChessboardContext } from '../../context/boardContext/boardContext';
import { useLanguagesContext } from '../../context/languagesContext/languagesContext';
import style from './BoardInfo.module.css';
import { GameContext } from '../../context/gameContext/gameContext';

function BoardInfo() {
  
    const {auth} = useAuth();
    const {ofrecerTablas, abandonarHandle} = useContext(GameContext);
    const {boardColor} = useChessboardContext();
    const {language} = useLanguagesContext();

  return (
    <div className={style.containerInf} style={{background: boardColor?.register || 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' }}>
          <div className={style.containerDatos} >
            <button className={style.tablas1} onClick={ofrecerTablas}>
                <img src={'fondos/pngwing.png'}/>
                <img src={'fondos/pngwing.png'}/>
                <div className={style.a}>{language.Offer_tables}</div>
            </button>
            <div className={style.containerAbandonar}>
              <div className={style.abandonar} onClick={abandonarHandle}>
                <div className={style.iconFlag}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-flag-fill" viewBox="0 0 16 16">
                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                  </svg> 
                </div>
                <div className={style.a}>{language.Abandon}</div> 
              </div>
            </div>
          </div>
          <div className={style.partida}>
              <h3>{language.New_GAME}</h3>
              <a><b>{auth?.user?.username}</b> contra <b>{'botIa'}</b></a>
          </div>
        </div>
  )
}

export default BoardInfo