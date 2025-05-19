import React, { useEffect, useRef, useState } from 'react';
import style from './ChatChess.module.css';
import Picker from 'emoji-picker-react';
import { Stack} from 'react-bootstrap';
import { useChessboardContext } from '../context/boardContext/boardContext';
import { useSocketContext } from '../context/socketContext/socketContext';
import { useAuth } from '../context/authContext/authContext';
// import useSound from 'use-sound';

function ChatChess() {
  const {
     socket,
     room,
     currentMessageChess, 
     setCurrentMessageChess, 
     messageListChess, 
     setMessageListChess, 
    } = useSocketContext();
  const [showEmoji, setShowEmoji] = useState(false);
  const {chessColor, boardColor} = useChessboardContext();
  const {auth} = useAuth();
  
  const scroll = useRef();

  
  

  useEffect(()=>{
    scroll?.current?.scrollIntoView({behavior: 'smooth'})
  },[currentMessageChess]);
  
  const sendMessage = async () => {
    if(socket === null) return;
    if (currentMessageChess !== '' ) {
      const messageData = {
        room,
        author: auth?.user?.username,
        message: currentMessageChess,
        photo: auth?.user?.photo,
        times: new Date().getTime(),
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_messageChess", messageData);
      setMessageListChess((list) => [...list, messageData]);
      setCurrentMessageChess("");
    }
  };

  

  return (
    <div 
      gap={4} 
      className={style.chatBox} 
      style={{background: boardColor.register}} 
    >
      <div className={style.chatHeader}>
        <strong>Live Chat</strong>
      </div>
      <div
        className={style.messages} 
      >
          {messageListChess.map((messageContent, index) => {
            return (
              <div
                className={style.message}
                id={auth?.user?.username === messageContent.author ? style.you: style.other}
                key={index} // Agregar una clave única
                ref={scroll}
              >
                <div className={style.containerContentMeta}>
                  <div className={style.containerProfileMessage}>
                  { auth?.user?.username !== messageContent.author && 
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
                     { auth?.user?.username === messageContent.author && 
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
          value={currentMessageChess}
          placeholder="Message..."
          onChange={(event) => {
            setCurrentMessageChess(event.target.value);
            
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
            setCurrentMessageChess(prev =>  prev + emojiObject.emoji);
            setShowEmoji(false);
          }} />
       </div>
     }
    </div>

      </div>
    </div>
  );
}

export default ChatChess;
