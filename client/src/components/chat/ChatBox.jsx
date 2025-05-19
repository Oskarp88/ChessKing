import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/authContext/authContext';
import { ChatContext } from '../../context/chatContext/ChatContext';
import { useFetchRecipient } from '../../hooks/useFetchRecipient';
import { Stack } from 'react-bootstrap';
import style from './ChatBox.module.css';
import moment from 'moment';

function ChatBox() {
    const {auth} = useAuth();
    const {user} = auth;
    const {currentChat, messages, isMessagesLoading, sendTextMessage } = useContext(ChatContext);
    const [textMessage, setTextMessage] = useState('');
    const {recipientUser} = useFetchRecipient(currentChat, user);
    const scroll = useRef();
    
    useEffect(()=>{
      scroll?.current?.scrollIntoView({behavior: 'smooth'})
    },[messages]);

    if(!recipientUser) {return(
        <p style={{ textAlign: 'center', width: '100%'}}>
            No conversation selected yet
        </p>
    )}

    if(isMessagesLoading) {return(
        <p style={{ textAlign: 'center', width: '100%'}}>
            Loading Chat...
        </p>
    )}

  return (
    <Stack gap={4} className={style.chatBox}>
      <div className={style.chatHeader}>
        <strong>{recipientUser?.username}</strong>
      </div>
      <Stack gap={3} className={style.messages}>
         {messages && messages.map((m, index)=>(
            <Stack 
               key={index} 
               className={`${m?.senderId === user?._id 
                   ? `${style.message} ${style.self} align-self-end flex-grow-0 ` 
                   : `${style.message} align-self-start flex-grow-0 `}`}
               ref={scroll}
            >
               <span>{m.text}</span>
               <span className={style.messageFooter}>
                {moment(m.createdAt).calendar()}
               </span>
            </Stack>
         ))}
      </Stack>
      <Stack direction='horizontal' gap={3} className={`${style.chatInput}  flex-grow-0`}>
      <input
        type="text"
        value={textMessage}
        onChange={(e) => setTextMessage(e.target.value)}
        placeholder="Type a message"
        className={style.inputMessage} 
      />
        <button className={style.sendBtn} onClick={() => sendTextMessage(textMessage, user?._id, currentChat?._id, sendTextMessage)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
          </svg>
        </button>
      </Stack>
    </Stack>
  )
}

export default ChatBox;