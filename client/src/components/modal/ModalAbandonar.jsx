import React, { useContext } from 'react';
import style from './ModalAbandonar.module.css';
import { GameContext } from '../../context/gameContext/gameContext';

export default function ModalAbandonar() {
  
  const{yesHandle, notHandle} = useContext(GameContext);

  return (
    <div className={style.overlay}>
        <div className={style.gameOverModal}>
          <h2>¿Estas seguro que quieres abandonar?</h2>
          <div className={style.button}>
            <button onClick={yesHandle}><p>Si</p></button>
            <button onClick={notHandle}><p>No</p></button>
          </div>
        </div>
  </div>

  )
}
