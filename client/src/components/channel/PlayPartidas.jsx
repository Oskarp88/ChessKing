import React from 'react';
import style from './PlayPartidas.module.css';
import { useSocketContext } from '../../context/socketContext/socketContext';

export const PlayPartidas = () => {
 
 const {partidas} = useSocketContext();
 
  return (
    <div className={style.tercerdiv}>
        <div className={style.title}>            
            <h4>Jugadores en partidas</h4>
        </div>
        <ul className={style.item}>
            {partidas.length === 0 ? <h5>No hay partidas activas</h5> :
               partidas?.map((p, index) => (
                <>
                    <li 
                        key={index} 
                        className={`${style.frienditem}`}              
                    > 
                        <div className={style.name}>
                            {/* <img className={style.userIcon} src={`http://localhost:8080/api/user-photo/${p?.idOpponent}`} alt='assets/avatar/user.png' />                   */}
                            <span className={style.friendName}>{p?.username}</span>
                            <span> vs </span>
                            {/* <img className={style.userIcon} src={`http://localhost:8080/api/user-photo/${p?.idUser}`} alt='assets/avatar/user.png' />                   */}
                            <span className={style.friendName}>{p?.username2}</span>
                        </div>                
                    </li>
                </>
            ))
            }
        </ul>                    
    </div>
  );
};


