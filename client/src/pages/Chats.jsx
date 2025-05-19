import React, { useContext } from 'react'
import { ChatContext } from '../context/chatContext/ChatContext'
import {Container, Stack} from 'react-bootstrap';
import style from './Chats.module.css';
import UserChat from '../components/chat/UserChat';
import { useAuth } from '../context/authContext/authContext';
import PotentialChats from '../components/chat/PotentialChats';
import ChatBox from '../components/chat/ChatBox';


function Chats() {

    const {
        userChats, 
        isUserChatsLoading,
        updateCurrentChat
    } = useContext(ChatContext);
    const {auth} = useAuth();
    const {user} = auth;

    console.log('chats', userChats);

  return (
    <Container className={style.container}>
        <PotentialChats />
        {userChats?.length < 1 ? null : (
            <Stack 
              direction='horizontal' 
              gap={4}
              className='align-items-start'
            >
                <Stack 
                  className='messages-box flex-grow-0'
                  gap={3}
                >
                   {isUserChatsLoading && <p>Loading chats...</p>}
                   {userChats?.map((chat,index)=>{
                      return(
                        <div key={index} onClick={() => updateCurrentChat(chat)}>
                          <UserChat
                            chat={chat}
                            user={user}
                          />
                        </div>
                      )
                   })}
                </Stack>
                <ChatBox/>
            </Stack>
        )}
    </Container>
  )
}

export default Chats;