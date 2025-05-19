import React, { useContext } from 'react';
import { ChatContext } from '../../context/chatContext/ChatContext';
import style from './PotentialChats.module.css';
import { useAuth } from '../../context/authContext/authContext';

function PotentialChats() {
  const {auth} = useAuth();
  const {user} = auth;
  const {potentialChats, createChat, onlineUsers} = useContext(ChatContext);
  
  return (
    <div className={style.allUsers}>
       <a>potencial</a>
       {potentialChats && potentialChats.map((u, index) =>(
          <div className={style.singleUser} key={index} onClick={() => createChat(user._id, u._id)}>
            {u.name}
            <span className={`${
              onlineUsers?.some((userOnline) => userOnline?.userId === u?._id) ?
              `${style.userOnline}` : ''
            }`}></span>
          </div>
       ))}
    </div>
  )
}

export default PotentialChats;