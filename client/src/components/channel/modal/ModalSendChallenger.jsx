import React, { useEffect, useState } from 'react'
import style from './Modal.module.css';
import { Spinner } from 'react-bootstrap';
import { useLanguagesContext } from '@/context/languagesContext/languagesContext';
import { useAuth } from '@/context/authContext/authContext';
import { useSocketContext } from '@/context/socketContext/socketContext';
import { CircleClose, CircleInf } from '@/svg';
import { valors } from '@/Constants';


export default function ModalSendChallenger({
    isOffGame,
    userModal,
    showModal,
    aceptarDesafio,
    showModalMin,
    mensajeChat,
    createGame,
    next,
    setNext,
    modalLoading,
    handleModalInf,
    handleModalClose,
}) {
    const {language} = useLanguagesContext();
    const {auth, user} = useAuth();
  
    const {onlineUsersRoom} = useSocketContext();
    const [selectedUser, setSelectedUser] = useState({})

    // console.log('usermodal',userModal);
    const roomKey = localStorage.getItem('typeRoom');

    useEffect(() => {
        
        const updatedUser = onlineUsersRoom 
           && onlineUsersRoom[roomKey] 
             &&  Array.isArray(onlineUsersRoom[roomKey])
               ? onlineUsersRoom[roomKey].find(user => user.userId === userModal?.userId)
               : {};
        if (updatedUser) {
          setSelectedUser(updatedUser); // Asegúrate de actualizar el estado con el usuario actualizado
        }
      }, [onlineUsersRoom,roomKey,userModal?.userId]);

   

    const handlePreviou = (e) =>{
        e.preventDefault()
   
       if(next > 0) {
         setNext(next - 1);
         localStorage.setItem('next', next - 1)
       }
     }
   
     const handleNext = (e) =>{
       e.preventDefault()
       if(next < 10){ 
         setNext(next + 1)
         localStorage.setItem('next', next + 1)
       }
     }
     
  return (
    <div className={`${style.modal} ${showModal ? style.show : ''}`}>
        <div className={style.header}>
            <div className={style.circle}>
                <a 
                    className={style.inf}
                    title={language?.information} 
                    onClick={() => handleModalInf(userModal?.userId)}
                >
                    <CircleInf />
                </a>
                <a  
                    className={style.close} 
                    onClick={() => handleModalClose()}
                >
                    <CircleClose />
                </a>
            </div>
            <div className={style.username}>
                <span>
                    {userModal.username.charAt(0).toUpperCase()}{userModal.username.slice(1)}
                </span>
            </div>
            <div className={style.containerMoneda}>                
            <img src="/icon/moneda.png" alt="" />
            <div className={style.dinero}>
                {userModal?.score
                    ?  
                    <span>{userModal?.score}</span>
                    :
                    <div className='text-white'>
                        <Spinner animation="grow" size="sm" />
                        <Spinner animation="grow" />
                    </div>
                }
            </div>               
          </div>        
        </div>
        <div className={style.modalContent}>      
            <div className={`${modalLoading ? `${style.userprofileLoading}` : `${style.userprofile}`}`}>
                <div className={style.imageContainerModal} >
                    <img className={style.photoImage} src={userModal?.photo} alt="User Photo" />                  
                    <img className={style.marco} src={userModal?.marco} alt="Marco"/>
                </div>                  
                
                {aceptarDesafio && !isOffGame &&
                <>
                    <span className={style.text}>
                    {userModal?.username && `${language?.You_have_sent_a_challenge}`}
                    </span>
                    <Spinner animation="grow" style={{color: '#154360'}}/>
                </> 
                }
                {!aceptarDesafio && isOffGame && <h3>{language.Challenge_rejected}</h3>}
            </div>  
            {
                selectedUser.busy && !aceptarDesafio &&
                <><Spinner animation="grow" style={{color: '#154360'}}/>
                <p>esta ocupado</p></>
                
            }   
            { auth?.user?._id  !== userModal.userId && !aceptarDesafio && !showModalMin &&
                !selectedUser.busy &&
                <div className={style.valor} >
                {next > 0 && 
                <button 
                    className={style.polygon} 
                    onClick={(e)=>handlePreviou(e)}
                    
                    >
                    <svg  viewBox="0 0 24 24">
                    <polygon points="14,2 14,22 4,12" fill="#154360" />
                    </svg>
                </button>}
                <div className={style.moneda}
                    style={next === 0 ?
                    {marginLeft: '40px'} : 
                        next === 10 || parseInt(userModal?.score) < valors[next+1]?.moneda 
                        || user?.score < valors[next+1]?.moneda
                        ? {marginRight: '40px'} : {}}
                >
                    <img src="/icon/moneda.png" alt="" />
                    <span>{valors[next]?.valor}</span>
                </div>
                {(next !== 10 
                    && valors[next+1]?.moneda < parseInt(userModal?.score) 
                    && valors[next+1]?.moneda < user?.score ) 
                    && 
                    <button className={style.polygon} onClick={(e)=>handleNext(e)}  >
                    <svg viewBox="0 0 24 24">
                        <polygon points="10,2 10,22 20,12" fill="#154360 " />
                    </svg>
                    </button>
                }
                </div>
                        }                    
            <div className={style.modalButtons}>
                {auth?.user?._id  !== userModal?._id && !aceptarDesafio && !showModalMin &&
                !selectedUser.busy &&
                
                <>
                <button 
                    className={style.button} 
                    onClick={()=>createGame(userModal)}
                >
                    {language.Challenge} 
                </button>
                <button 
                    className={style.button} 
                    onClick={() => mensajeChat(auth?.user?._id, userModal?._id, )}
                >
                    {language.message}
                </button>
                </>}                  
                {
                aceptarDesafio && 
                <button 
                    className={style.button} 
                    style={{width:'90%'}} 
                    onClick={() => handleModalClose()}>
                    {language.Cancel}
                </button>
                }
            </div>
        </div>
    </div>
  )
}
