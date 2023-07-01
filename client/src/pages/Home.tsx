import React from 'react';
import {  useNavigate } from 'react-router-dom';
import style from './Home.module.css';

export function Home() {
  const navigate = useNavigate();

  const handlePlayChess = () => {
    navigate('/chess');
  };

  return (
    <div className={style.home}>
      <h1>Welcome to ChessKing</h1>
      <p>Play chess online and improve your skills!</p>
      <button className={style.playButton} onClick={handlePlayChess}>
        Play Chess
      </button>
    </div>
  );
}