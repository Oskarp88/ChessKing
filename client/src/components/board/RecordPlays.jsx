import { useContext, useEffect, useRef } from 'react';
import { useChessboardContext } from '../../context/boardContext/boardContext';
import style from './RecordPlay.module.css';
import { GameContext } from '../../context/gameContext/gameContext';

function RecordPlays({ whiteMoveLog, blackMoveLog}) {
  
    const {boardColor,themePiece} = useChessboardContext();
    const {moveLog} = useContext(GameContext);
    const moveLogContainerRef = useRef(null);
    const movePlayRef = useRef(null);

    useEffect(() => {
      // Desplaza hacia el final del contenedor
      if (movePlayRef.current) {
        movePlayRef.current.scrollLeft = movePlayRef.current.scrollWidth;
      }
    }, [moveLog]);  

    useEffect(() => {
        // Ajusta el scroll al final del contenedor
        moveLogContainerRef.current.scrollTop = moveLogContainerRef.current.scrollHeight;
      }, [whiteMoveLog,blackMoveLog]);

      let count = 1;

  return (
    <>
       <div 
          ref={moveLogContainerRef} 
          className={style.moveLogContainer} 
          style={{
            background: boardColor.register || 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)',        
          }}
      >       
           <div className={style.moveLog}>
            <ul>
              {whiteMoveLog?.map((move, index) => (
                <li 
                 style={index % 2 === 0 ? {backgroundColor: 'rgba(0, 0, 0, 0.15)'}: {}} 
                 className={style.moveLiWhite} key={index}
                 >  <span>{index + 1}.</span> 
                 { 
                    move?.charAt(0) === 'R' || move?.charAt(0) === 'N' || move?.charAt(0) === 'B' || move?.charAt(0) === 'K' || move?.charAt(0) === 'Q' ?
                  <>
                    <img className={style.piezaMove} src={`assets/${themePiece.images}/w${move?.charAt(0).toLowerCase()}.png`} alt="" />
                    <p>{move?.slice(1)}</p>
                  </>    : <p style={{marginLeft:'1.3rem'}}>{move}</p>
                 }                
                 
                </li>
              ))}
            </ul>
          </div>
          <div className={style.moveLog}>
            <ul>
              {blackMoveLog?.map((move, index) => (
                <li 
                  style={index % 2 === 0 ? {backgroundColor: 'rgba(0, 0, 0, 0.15)'}:{}} 
                  className={style.moveLiBlack} key={index}
                >{ 
                  move?.charAt(0) === 'R' || move?.charAt(0) === 'N' || move?.charAt(0) === 'B' || move?.charAt(0) === 'K' || move?.charAt(0) === 'Q' ?
                <>
                  <img className={style.piezaMove} src={`assets/${themePiece.images}/b${move?.charAt(0).toLowerCase()}.png`} alt="" />
                  <p>{move?.slice(1)}</p>
                </>    : <p style={{marginLeft:'1.3rem'}}>{move}</p>
               }</li>
              ))}
            </ul>
          </div>
       </div>
       <div className={style.recordPlay}>
          <div className={style.movePlay} ref={movePlayRef}> 
            <ul className={style.ul}>
              {moveLog?.map((move, index) => (
                <div
                 style={index === count + 1 ? {backgroundColor: 'rgba(0, 0, 0, 0.15)'}: {}} 
                 className={index % 2 === 0 ? style.moveLi : style.move} key={index}
                 >  <span>{index % 2 === 0 ? `${count++}.` : ''}</span> 
                 { 
                    move?.charAt(0) === 'R' || move?.charAt(0) === 'N' || move?.charAt(0) === 'B' || move?.charAt(0) === 'K' || move?.charAt(0) === 'Q' ?
                  <>
                    <img 
                      className={style.piezaMove} 
                       src={
                          index % 2 === 0 ? `assets/${themePiece.images}/w${move?.charAt(0).toLowerCase()}.png` :
                              `assets/${themePiece.images}/b${move?.charAt(0).toLowerCase()}.png`
                        }
                       alt="" />
                    <p>{move?.slice(1)}</p>
                  </>    : <p style={{marginLeft:'.1rem'}}>{move}</p>
                 }                
                 
                </div>
              ))}
               {/* {blackMoveLog.map((move, index) => (
                <div 
                  style={index % 2 === 0 ? {backgroundColor: 'rgba(0, 0, 0, 0.15)'}:{}} 
                  className={style.moveLiBlack} key={index}
                >{ 
                  move?.charAt(0) === 'R' || move?.charAt(0) === 'N' || move?.charAt(0) === 'B' || move?.charAt(0) === 'K' || move?.charAt(0) === 'Q' ?
                <>
                  <img className={style.piezaMove} src={`assets/${themePiece.images}/b${move?.charAt(0).toLowerCase()}.png`} alt="" />
                  <p>{move?.slice(1)}</p>
                </>    : <p style={{marginLeft:'1.3rem'}}>{move}</p>
               }</div>
              ))} */}
            </ul>
          </div>
       </div>
    </>
  )
}

export default RecordPlays