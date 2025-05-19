import React, { useContext } from 'react'
import { Spinner } from 'react-bootstrap'
import style from './Modal.module.css';
import { GameContext } from '@/context/gameContext/gameContext';
import { useLanguagesContext } from '@/context/languagesContext/languagesContext';
import { CircleClose, CircleInf } from '@/svg';

export default function ModalReceiveChallenger({
    showModalOpponent,
    userModal,
    handleModalInf,
    handleModalOpponentClose,
    playGame,
    offGame, 
    next,
    userOpponentModal,
    modalLoading
}) {
    const {infUser} = useContext(GameContext);
    const {language} = useLanguagesContext();

  return (
    <div className={`${style.modal} ${showModalOpponent ? style.show : ''}`}>
        <div className={style.header}>
            <div className={style.circle}>
                <a 
                className={style.inf} 
                title={language.information}
                onClick={() => handleModalInf(userModal?._id)}
                >
                <CircleInf />
                </a>
                <a  className={style.close} onClick={handleModalOpponentClose}>
                <CircleClose/>
                </a>
            </div>
            <div className={style.username}>
                <span>
                { `${language.game_of} ${infUser?.time === 60 ? '1 mn' : 
                    infUser?.time === 120 ?  '2 mn' : 
                    infUser?.time === 180 ? '3 mn' : 
                    infUser?.time === 300 ? '5 mn' : 
                    infUser.time === 600 ? '10 mn' : '20 mn'}`
                }
                </span>
            </div>
        </div>
        <div className={style.modalContent}>                  
            <div className={`${modalLoading ? `${style.userprofileLoading}` : `${style.userprofile}`}`}>
                <div className={style.imageContainerModal} >
                <img className={style.photoImage} src={userOpponentModal?.photo} alt="User Photo" />                  
                <img className={style.marco} src={userOpponentModal?.marco} alt="Marco"/>
                </div>                   
                <span className={style.text}>{userOpponentModal?.username && 
                    `${userOpponentModal.username.charAt(0)
                        .toUpperCase()}${userOpponentModal.username.slice(1)} ${language.has_challenged_you}`} 
                </span>
                <Spinner animation="grow" style={{color: '#154360'}}/>
            </div>  
            <div className={style.valor}>
            <div className={style.moneda}
                style={next === 0 ? {marginLeft: '40px'} : next === 10 ? {marginRight: '40px'} : {}}
                >
                <img src="/icon/moneda.png" alt="" />
                    <span>{infUser?.valor}</span>
                </div>  
            </div>                                
            <div className={style.modalButtons}>
            <button className={style.button} onClick={playGame}>
                {language.Accept}
            </button>
            <button className={style.button} onClick={offGame}>
                {language.Cancel}
            </button>
            </div>
        </div>
    </div>
  )
}
