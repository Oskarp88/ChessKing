import React, { useContext, useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import style from './MinNabvar.module.css';
import { useChessboardContext } from '../../context/boardContext/boardContext';
import { GameContext } from '../../context/gameContext/gameContext';
import ChatChess from '../ChatChess';
import { FaTimes } from 'react-icons/fa';
import { useSocketContext } from '../../context/socketContext/socketContext';



function MinNabvar() {
    const {boardColor} = useChessboardContext();
    const {countMessage, setCountMessage} = useSocketContext();

    const [isShowModal, setIsShowModal] = useState(false);
    const {ofrecerTablas, abandonarHandle} = useContext(GameContext);
    const [isChat, setIsChat] = useState(false);

    useEffect(()=>{
      if(isChat) setCountMessage(0);
    },[isChat, setCountMessage])

    const sendTied = () => {
        setIsShowModal(false);
       ofrecerTablas();
    }

    const sendAbandon = () => {
        setIsShowModal(false);
        abandonarHandle();
    }

    const handleChat = () => {
        setIsShowModal(false);
        setIsChat(true);
    }

  return (
    <>
       <div className={style.navbar} style={{background: boardColor?.register}}>
        <FaBars 
         className={style.faBars} 
         color={boardColor?.whiteRow} 
         onClick={()=>setIsShowModal(!isShowModal)}
        /> 
        <div>
          { countMessage !== 0 &&
             <div className={style.notificacion}><p>{countMessage}</p></div>
          }
          <img src={'/icon/chatChess.png'} alt="" onClick={handleChat}/>
        </div>
       </div>
       {
        isShowModal && 
          <div className={style.modal} style={{background: boardColor?.register}}>
             <div className={style.faTimes}>  
                <FaTimes 
                  size={24} 
                  color={boardColor?.whiteRow} 
                  className={style.fa}
                  onClick={()=>setIsShowModal(false)}
                />
            </div>
             <span onClick={sendTied}>Ofrecer tablas</span>
             <span onClick={sendAbandon}>Rendirse</span>
          </div>
       }

       {
        isChat && 
         <div className={style.chat}>
              <FaTimes 
                  size={24} 
                  color={boardColor?.whiteRow} 
                  className={style.faChat}
                  onClick={()=>setIsChat(false)}
                />
            <ChatChess/>
         </div>        
       }
    </>
  )
}

export default MinNabvar;