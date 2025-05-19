import React from 'react';
import { useLanguagesContext } from '../../context/languagesContext/languagesContext';
import style from '../../pages/home/Home.module.css';

function ButtonIcon({time, handleClick}) {
    const {language } = useLanguagesContext();
  return (
    <>
       <a  className={
          `${style.button} 
           ${ time === 'fast' ? style.lightbgblue : 
              time === 'blitz' ? style.lightbgyellow :
              style.lightbgorange
           } 
           ${style.clearfix}`
        }
            onClick={()=> handleClick(time)}
        >
            <span>
                {time === 'fast' ? language.fast : time === 'blitz' ? language.blitz : language.bullet}
            </span>
            <div className={style.icon}>
             {time === 'fast' ? 
                <svg style={{ color: '#80de83' }} xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                </svg> :
              time === 'blitz' ?
                <svg style={{ color: '#FFEB3B' }} xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                </svg> :
                <svg style={{ color: '#F9A825' }} xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                    <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                    <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
                </svg>
             }
            </div>
        </a>
    </>  
 )
}

export default ButtonIcon;