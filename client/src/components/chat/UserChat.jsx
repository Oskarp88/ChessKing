import React, { useContext } from 'react'
import { useFetchRecipient } from '../../hooks/useFetchRecipient';
import { Stack } from 'react-bootstrap';
import style from './UserChat.module.css';
import { ChatContext } from '../../context/chatContext/ChatContext';
import { unReadNotifications } from '../../utils/unReadNotifications';
import { useFetchLatesMessage } from '../../hooks/useFetchLatesMessage';
import moment from 'moment';

function UserChat({chat, user}) {
    const {onlineUsers,  notifications, markThisUserNotificationsAsRead} = useContext(ChatContext);
    const {recipientUser} = useFetchRecipient(chat, user);
    const {latestMessage} = useFetchLatesMessage(chat)
    const unreadNotifications = unReadNotifications(notifications);
    const thisUserNotifications = unreadNotifications?.filter((n) => n.senderId === recipientUser?._id);
    const isOnline = onlineUsers?.some((u) => u?.userId === recipientUser?._id);

    const CountNotifications = thisUserNotifications?.length;
    
    const truncateText = (text) => {
      let shortText = text.substring(0,20);

      if(text.length > 20){
        shortText = shortText + '...';
      }
      return shortText;
    }
  return (
    <Stack 
      direction='horizontal'
      gat={3}
      className={`${style.userCard} aling-items-center p-2 justify-content-betewen`}
      role='button'
      onClick={() => {
        if(thisUserNotifications?.length !== 0){
        markThisUserNotificationsAsRead(thisUserNotifications, notifications)
      }
    }}
    >
       <div className='d-flex'>
          <div className='me-2'>
            {recipientUser?.photo ?
                  <img className={style.profile} src={recipientUser?.photo} alt='' />
                  : <img className={style.profile} src={'assets/avatar/user.png'} alt='' />}
          </div>
          <div className={style.textContent}>
            <div className={style.name}>{recipientUser?.username}</div>
            <div className={style.text}>{latestMessage?.text && (
              <span>{truncateText(latestMessage?.text)}</span>
            )}</div>
          </div>
       </div>
       <div className='d-flex flex-column aling-items-end'>
           <div className={style.date}>
              {moment(latestMessage?.createdAt).calendar()}
           </div>
           <div className={`${CountNotifications > 0 ? `${style.thisUserNotifications}` : '' }`}>
              {thisUserNotifications?.length > 0 ? thisUserNotifications?.length : ''}
           </div>
           <span className={`${isOnline ? `${style.userOnline}`: ''}`}></span>
       </div>
    </Stack>
  )
}

export default UserChat;