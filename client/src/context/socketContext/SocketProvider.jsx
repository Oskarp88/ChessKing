import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from './SocketContext';

const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(localStorage.getItem('gameRoom') || null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [currentMessageChess, setCurrentMessageChess] = useState('');
  const [messageListChess, setMessageListChess] = useState([]);
  const [countMessage, setCountMessage] = useState(0);
  const [userChess, setUser] = useState({
    _id: null,
    username: '',
    imagenBandera: '',
    // más campos...
  });
  const [playersTotal, setPlayersTotal] = useState({
    uno: 0,
    dos: 0,
    tres: 0,
    cinco: 0,
    diez: 0,
    veinte: 0,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsersRoom, setOnlineUsersRoom] = useState({});
  const [online, setOnline] = useState(null);
  const [partidas, setPartidas] = useState([]);
  
  useEffect(() => {
    const newSocket = io.connect(
      import.meta.env.VITE_PRODUCTION === 'production'
        ? 'https://chessknigth-22fe0ebf751e.herokuapp.com'
        : 'http://192.168.2.5:5000'
    );
    
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;

    socket.on('getPartidas', (data) => {
      setPartidas(data);
    });

    socket.on('receive_messageChess', (response) => {
      setMessageListChess((list) => {
        const messageExists = list.some(
          (msg) =>
            msg.author === response.author &&
            msg.message === response.message &&
            msg.times === response.times
        );

        if (!messageExists) {
          setCountMessage((prev) => prev + 1);
          return [...list, response];
        }
        return list;
      });
    });

    return () => {
      socket.off('getPartidas');
      socket.off('receive_messageChess');
    };
  }, [socket]);

  useEffect(() => {
    if (online) {
      const minUno = online.filter((userOnline) => userOnline.time === 60);
      const minDos = online.filter((userOnline) => userOnline.time === 120);
      const minTres = online.filter((userOnline) => userOnline.time === 180);
      const minCinco = online.filter((userOnline) => userOnline.time === 300);
      const minDiez = online.filter((userOnline) => userOnline.time === 600);
      const minVeinte = online.filter((userOnline) => userOnline.time === 1200);

      setPlayersTotal({
        uno: minUno.length,
        dos: minDos.length,
        tres: minTres.length,
        cinco: minCinco.length,
        diez: minDiez.length,
        veinte: minVeinte.length,
      });
    }
  }, [online]);

  return (
    <SocketContext.Provider value={{
      socket,
      setSocket,
      room,
      setRoom,
      allUsers,
      setAllUsers,
      onlineUsersRoom,
      setOnlineUsersRoom,
      partidas,
      setPartidas,
      userChess,
      setUser,
      messageList,
      setMessageList,
      currentMessage,
      setCurrentMessage,
      playersTotal,
      setPlayersTotal,
      online,
      setOnline,
      countMessage,
      setCountMessage,
      currentMessageChess,
      setCurrentMessageChess,
      messageListChess,
      setMessageListChess,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider };
