import React, { useContext, useState } from 'react';
import style from './Notification.module.css';
import { ChatContext } from '../../context/chatContext/ChatContext';
import { useAuth } from '../../context/authContext/authContext';
import { unReadNotifications } from '../../utils/unReadNotifications';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const {auth} = useAuth();
    const {user} = auth;
    const {notifications, userChats, allUsers, markAllNotificationsAsRead, markNotificationAsRead} = useContext(ChatContext);

    const unReadNotification = unReadNotifications(notifications);
    const modifiedNotifications = notifications?.map((n) => {
        const sender = allUsers.find(u => u._id === n.senderId)
        return{
            ...n,
            senderName: sender?.name
        }
    })
    return (
    <div className={style.notifications}>
        <div className={style.notificationsIcon} onClick={() => setIsOpen(!isOpen)}>
        <div className={style.div}>
        <div clasName={style.image}>
          <img src="/icon/notification.png" alt="" />
        </div>
        </div>
            {
                unReadNotification?.length === 0 ? null : (
                    <span className={style.notificationCount }>
                        <span>{unReadNotification?.length}</span>
                    </span>
                )
            }
        </div>
        {
            isOpen && 
            <div className={style.notificationsBox}>
                <div className={style.notificationsHeader}>
                    <h3>Notifications</h3>
                    <div className={style.markAsRead} onClick={() => markAllNotificationsAsRead(notifications)}>
                       Mark all as read
                    </div>
                </div>
                       {modifiedNotifications?.length === 0 ? 
                         (<span className={style.notification}>No notificaion yet...</span>) : null
                       }
                       {modifiedNotifications &&
                           modifiedNotifications.map((n, index) => {
                            return (
                                <div 
                                  key={index} 
                                  className={`${n.isRead ? `${style.notification}` : `${style.notification} ${style.notRead}`}`}
                                  onClick={()=>{markNotificationAsRead(n, userChats, user, notifications); setIsOpen(false); navigate('/auth/chat')}}
                                  
                                >
                                   <span>{`${n.senderName} sent you a new message`}</span>
                                   <span className={style.notificationTime}>{moment(n.date).calendar()}</span>
                                </div>
                            )
                           })
                       }
                    
                
            </div>
        }
    
    </div>
  )
}

export default Notifications;