import React, { useEffect, useRef, useState } from 'react';
import { RankingTable } from '../../components/ranking/RankingTablaFast';
import { RankingTableBlitz } from '../../components/ranking/RakingTablaBlitz';
import { RankingTableBullet } from '../../components/ranking/RakingTablaBullet';
import style from './Home.module.css';

const useInterval = (callback, delay) => {
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    useEffect(() => {
      const tick = () => {
        savedCallback.current();
      };
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

function TableRaking() {
    const [autoPaginate, setAutoPaginate] = useState(true);
    const [paginate, setPaginate] = useState(1);

    useInterval(() => {
        if (autoPaginate) {
          if (paginate === 1) {
            setPaginate(3);
          } else {
            setPaginate(p => p - 1);
          }
        }
    }, 15000);

    const handleFormer = () => {
        if(parseInt(paginate) === 2 || parseInt(paginate) === 3) setPaginate(parseInt(paginate) -1);
        setAutoPaginate(false);
        setTimeout(()=>{
          setAutoPaginate(true);
        },30000)
    }
    
    const handleNext = () => {
        if(parseInt(paginate) === 1 || parseInt(paginate) === 2) setPaginate(parseInt(paginate) +1);
        setAutoPaginate(false);
        setTimeout(()=>{
            setAutoPaginate(true);
        },30000)
    }

  return (
    <div className={style.table}>
        <div 
            className={style.chevron} 
            onClick={() => handleFormer()}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                style={ paginate === 1 
                            ? {color: '#50c256'}  : paginate === 2 
                            ? {color: '#FFEB3B'}  : {color: '#F9A825'}
                        }  
                fill="currentColor" 
                width="40" height="40"
                className="bi bi-chevron-left" 
                viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
            </svg>
        </div>
        <div>
        {
            paginate === 1 ? <RankingTable/> : 
            paginate === 2 ? <RankingTableBlitz/> : 
            <RankingTableBullet/>
        }
        </div>
        <div className={style.chevron} onClick={() => handleNext()}>
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            style={ paginate === 1 
                    ? {color: '#50c256'} : paginate === 2 
                    ? {color: '#FFEB3B'} : {color: '#F9A825'}
                    }  
            width="40" height="40"
            fill="currentColor" 
            className="bi bi-chevron-right" 
            viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
        </svg>
        </div>
    </div>  
  )
}

export default TableRaking