import React, { useContext } from 'react';
import style from './ModalsendTablas.module.css'; // Asegúrate de importar correctamente el archivo CSS
import { GameContext } from '../../context/gameContext/gameContext';

const ModalSendTablas = ({infUser}) => {
  const {rechazarTablas, aceptarTablas} = useContext(GameContext);
  
  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <div className={style.header}>
          <h2>TABLAS</h2> 
        </div> 
        <div className={style.body}>
          <img className={style.profileChekMate} src={infUser?.photo} alt='assets/avatar/user.png'  />
          <p>{infUser?.username} te ofrece tablas</p>
          <button onClick={aceptarTablas}>Aceptar</button>
          <button onClick={rechazarTablas}>Rechazar</button>
          </div>
      </div>
    </div>
  );
};

export default ModalSendTablas;