import { useCallback, useEffect, useState } from "react";
import { getRequest, baseUrl, postRequest } from "../../utils/services";
import  io  from 'socket.io-client';
import { ChatContext } from "./ChatContext";

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserchats] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotencialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
      const newSocket = io.connect(
         import.meta.env.VITE_PRODUCTION === 'production'
           ? 'https://chessknigth-22fe0ebf751e.herokuapp.com'
           : 'http://192.168.2.5:5000'
       );
    
        setSocket(newSocket);

        return () =>{
         newSocket.disconnect();
        }
    },[user, import.meta.env.VITE_PRODUCTION]);

    useEffect(() => {
      if(socket === null) return;
      socket.emit('addNewUser', user?._id);
      socket.on('getOnlineUsers', (data) => {
        setOnlineUsers(data);
      });
      return () => {
         socket.off('getOnlineUsers');
      }
    },[socket, user?._id]);

    //send Message
    useEffect(() => {
      if(socket === null) return;
       const recipientId = currentChat?.members.find((id) => id !== user?._id);
       socket.emit('sendMessage', {...newMessage, recipientId})
    },[newMessage, currentChat?.members, socket, user?._id]);
   
    //receive message and notifications
    useEffect(() => {
      if(socket === null) return;
       socket.on('getMessage', (res )=> {
           if(currentChat?._id !== res.chatId) return;
           setMessages((prev) => [...prev, res])
       });

       socket.on('getNotifications', (res )=> {
         const isChatOpen = currentChat?.members.some(id => id._id === res.senderId);
         if(isChatOpen){
            setNotifications(prev => [{...res, isRead: true}, ...prev])
         }else{
            setNotifications(prev => [res, ...prev]);
         }
     });

       return () => {
         socket.off('getMessage');
         socket.off('getNotifications');
       }
    },[socket, currentChat]);

   useEffect(() => {
       const getUsers = async() =>{
        
         const response = await getRequest(`${baseUrl}/users`);
          if(response.error){
             return console.log('Error fetching users', response);
          }
         
         const pChats = response.filter((u) => {
            let isChatCreated = false;
             if(user?._id === u._id) return false;

              if(userChats){
                 isChatCreated = userChats?.some((chat) =>{
                    return chat.members[0] === u._id || chat.members[1] === u._id
                  })
              }
              return !isChatCreated;
          });

           setPotencialChats(pChats);
           setAllUsers(response);
        }

       getUsers();

    }, [userChats, user?._id]);

    useEffect(()=>{
        const getUserChats = async() => {
            if(user?._id){

                setIsUserChatsLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chat/${user?._id}`);
                setIsUserChatsLoading(false);
                if(response.error){
                    return setUserChatsError(response);
                }

                setUserchats(response);
            }
        }

        getUserChats();
    },[user,notifications]);

    useEffect(()=>{
      const getMessages = async() => {

         setMessagesLoading(true);
         setMessagesError(null);
         const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
         setMessagesLoading(false);
         if(response.error){
            return setMessagesError(response);
         }

         setMessages(response);
      }
      getMessages();
  },[currentChat]);

    const sendTextMessage = useCallback(async(textMessage, sender, currentChatId, setTextMessage) => {
       if(!textMessage) return console.log('you must type something...');
       const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
         chatId: currentChatId,
         senderId: sender,
         text: textMessage
       }));

       if(response.error){
         return setSendTextMessageError(response);
       }

       setNewMessage(response);
       setMessages((prev) => [...prev, response]);
       setTextMessage('');

    },[]);
    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    },[]);

    const createChat = useCallback(async (firstId, secondId) => {
      console.log('userChats create', userChats);
      const response = await postRequest(`${baseUrl}/chat`, 
        JSON.stringify({
          firstId,
          secondId
        })
      );

      console.log('createChat', response)
    
      if (response.error) {
        return console.log('Error creating chat', response);
      }    
        setUserchats((prev) => {
            // Verificar si el chat ya existe
            return [...prev, response];

       });    
       
    }, []);

    const markAllNotificationsAsRead = useCallback((notifications) => {
       const mNotifications = notifications.map(n => {
         return {...n, isRead: true}
      });
      setNotifications(mNotifications);
    },[userChats]);

    const markNotificationAsRead = useCallback((n, userChats, user, notifications)=>{
       //find chat to open
       const desiredChat = userChats.find(chat=>{
         const chatMembers = [user._id, n.senderId];
         const isDesiredChat = chat?.members.every((member) => {
            return chatMembers.includes(member);
         });

         return isDesiredChat;
       });
       //mark notification as read
       const mNotifications = notifications.map(el =>{
         if(n.senderId === el.senderId){
            return {...n, isRead: true}
         }else{
            return el
         }
       })
       updateCurrentChat(desiredChat);
       setNotifications(mNotifications);

    },[updateCurrentChat]);

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notificacions) => {
      const mNotifications = notificacions?.map((el) => {
         let notification;

         thisUserNotifications?.forEach(n => {
            if(n.senderId === el.senderId){
               notification = {...n, isRead: true}
            }else{
               notification = el;
            }
         });
         return notification;
      });
      setNotifications(mNotifications);
    },[]);

    return <ChatContext.Provider 
         value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats, 
            createChat,
            updateCurrentChat,
            currentChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendTextMessage,
            onlineUsers,
            setOnlineUsers,
            notifications,
            allUsers,
            markAllNotificationsAsRead,
            markNotificationAsRead,
            markThisUserNotificationsAsRead
         }}
      >
         {children}
      </ChatContext.Provider>
    
}