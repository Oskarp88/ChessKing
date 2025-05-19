import React, { useContext } from 'react';
import style from './ModalTablas.module.css'; // Asegúrate de importar correctamente el archivo CSS
import { GameContext } from '../../context/gameContext/gameContext';

const ModalTablas = ({infUser}) => {
  const {cancelarTablas} = useContext(GameContext);
  
  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <div className={style.header}>
          <h2>Ofreciendo tablas</h2> 
        </div>
        <div className={style.body}>
          <img className={style.profileChekMate} src={infUser?.photo} alt='assets/avatar/user.png'  />
          <p>Esperando respuesta de {infUser?.username}</p>
          
            <div className={style.ldsring}><div></div><div></div><div></div><div></div></div>
          
          <button onClick={cancelarTablas}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalTablas;