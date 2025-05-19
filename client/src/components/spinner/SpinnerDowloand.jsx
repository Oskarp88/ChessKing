import React from 'react';
import style from './Spinner.module.css';
import { useChessboardContext } from '../../context/boardContext/boardContext';

function SpinnerDowloand({text, color}) {
    const {chessColor} = useChessboardContext();
    return (
        <div className={style.redirecting} style={color ? {color: color }: {}}>
            <div 
              className={style.spinner} 
              style={{border: chessColor?.spinner, borderLeftColor: chessColor?.colorBorder}}></div>
            <p 
              className={style.dirigiendo} 
              style={color ? {color: color} :{color: chessColor?.color}}>
                {text}
            </p>
        </div>
      )
}

export default SpinnerDowloand