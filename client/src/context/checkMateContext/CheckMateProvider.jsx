import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckMateContext } from './CheckMateContext';
import { baseUrl } from '@/utils/services';
import { useAuth } from '../authContext/authContext';

const CheckMateProvider = ({ children }) => {
  const { isScore, setScore } = useAuth();
  const [checkMate, setCheckMate] = useState(null);

  useEffect(() => {
    const updateCheckMate = async () => {
      if (!checkMate) return; // Asegurarse de que haya datos válidos en checkMate antes de hacer el request
      console.log('estoy dentro de updateCheckMate');
      try {
        const response = await axios.put(`${baseUrl}/partida/user/update/${checkMate.userId}`, {
          name: checkMate?.name,
          opponentId: checkMate?.opponentId,
          nameOpponent: checkMate?.nameOpponent,
          bandera: checkMate?.bandera,
          banderaOpponent: checkMate?.banderaOpponent,
          country: checkMate?.country,
          countryOpponent: checkMate?.countryOpponent,
          time: checkMate?.time,
          game: checkMate?.game,
          elo: checkMate?.elo,
          eloUser: checkMate?.eloUser,
          eloOpponent: checkMate?.eloOpponent,
          color: checkMate?.color,
          score: checkMate?.score
        });
        setScore(!isScore);
        if (response.error) {
          console.log('Error en la respuesta: ', response.error);
        }
      } catch (err) {
        console.log('Error de actualización de checkMate: ', err.message);
      }
    };

    updateCheckMate();
  }, [checkMate, isScore, setScore]);

  return (
    <CheckMateContext.Provider value={{ checkMate, setCheckMate }}>
      {children}
    </CheckMateContext.Provider>
  );
};

export { CheckMateProvider };
