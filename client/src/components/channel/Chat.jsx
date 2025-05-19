import React, { useEffect, useRef, useState } from 'react';
import style from './Chat.module.css';
import { useChessboardContext } from '../../context/boardContext/boardContext';
import Picker from 'emoji-picker-react';
import { useAuth } from '../../context/authContext/authContext';
import {Container, Stack} from 'react-bootstrap';
import { useSocketContext } from '../../context/socketContext/socketContext';

function Chat({ socket, username, room }) {
  const {currentMessage, setCurrentMessage, messageList, setMessageList} = useSocketContext();
  const [showEmoji, setShowEmoji] = useState(false);
  const {chessColor} = useChessboardContext();
  const {auth} = useAuth();
  const chatAudio = useRef(new Audio('/to/sonicChat.mp3'));
  const scroll = useRef();

  useEffect(()=>{
    scroll?.current?.scrollIntoView({behavior: 'smooth'})
  },[currentMessage]);
  
  const sendMessage = async () => {
    if(socket === null) return;
    if (currentMessage !== '' ) {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        photo: auth?.user?.photo,
        times: new Date().getTime(),
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };


  useEffect(() => {
    if (socket === null) return;
  
    socket.on("receive_message", (response) => {
      setMessageList((list) => {
        // Verificar si el mensaje ya existe en la lista
        const messageExists = list.some(
          (msg) =>
            msg.author === response.author &&
            msg.message === response.message &&
            msg.times === response.times
        );
  
        // Solo añadir el mensaje si no existe
        if (!messageExists) {
          return [...list, response];
        }
  
        return list;
      });
      chatAudio.current.play();
      console.log("receive_message", response);
    });
  
    // Limpiar el evento al desmontar el componente
    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [socket, setMessageList]);
  

  return (
    <div gap={4} className={style.chatBox}  >
      <div 
        className={style.chatHeader}
        style={{
            boxShadow: '0px 0px 0px 1px #4e5883 inset, 0px 0px 0px 2px #748ab6 inset, 0px 4px 0px 0px #4a617c, 0px 5px 0px 0px #354256, 0px 8px 0px 0px rgba(0,0,0,.15)',
        }}

      >
        <strong>Live Chat</strong>
      </div>
      <div
        className={style.messages} 
      >
          {messageList.map((messageContent, index) => {
            return (
              <div
                className={style.message}
                id={username === messageContent.author ? style.you: style.other}
                key={index} // Agregar una clave única
                ref={scroll}
              >
                <div className={style.containerContentMeta}>
                  <div className={style.containerProfileMessage}>
                  { username !== messageContent.author && 
                      <div className={style.containerPhoto}>
                          <img className={style.profile} src={messageContent?.photo} alt='' />
                      </div>
                    }                
                    <div className={style.messagecontent}>
                      <p>{messageContent.message}</p>
                      <div className={style.messagemeta} >
                        <span className={style.time} >{messageContent.time}</span>
                        <span className={style.author} >{messageContent.author}</span>
                      </div>
                    </div>  
                     { username === messageContent.author && 
                      <div className={style.containerPhoto}>
                          <img className={style.profile} src={messageContent?.photo} alt='' />
                      </div>
                    }               

                  </div>
                  
                </div>
              </div>
            );
          })}
      </div>
      <Stack 
         direction='horizontal' 
         gap={3} 
         className={`${style.chatInput} `} 
         style={{borderTop: `1px solid ${chessColor.color}`, color: chessColor.color}}
      >
        <button
            className={style.emojibutton}
            onClick={() => setShowEmoji(!showEmoji)}
        >
          <div className={style.icon}>
           😀
          </div>
        </button>
        <input
          className={style.inputMessage} 
          type="text"
          value={currentMessage}
          placeholder="Message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
            
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />

        <button onClick={sendMessage} className={style.sendBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
          </svg>
        </button>
      </Stack>
      <div>
      <div>
     { showEmoji && 
       <div className={style.emojipicker }>
           <Picker onEmojiClick={(emojiObject) => {
            setCurrentMessage(prev =>  prev + emojiObject.emoji);
            setShowEmoji(false);
          }} />
       </div>
     }
    </div>

      </div>
    </div>
  );
}

export default Chat;
