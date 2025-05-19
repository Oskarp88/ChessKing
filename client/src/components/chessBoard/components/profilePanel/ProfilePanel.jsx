import React from 'react'
import { useWindowHeight, useWindowWidth } from '../../../../hooks/useWindowWidth';
import AvatarCircular from '../../../common/components/panel/AvatarCircular';
import style from './ProfilePanel.module.css';

function ProfilePanel({photo, marco, username, elo, flags,alignItems}) {
    const width = useWindowWidth();
    const height = useWindowHeight();

  return (
    <div style={{
        height:height -200 < width ? height *0.13 : width *0.18, 
        width: height -200 < width ? height *0.72 : width,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    }}>
      
      <div className={style.row} style={{width: '65%'}}>
        <AvatarCircular
            height={height < width ? height*0.11 : width*0.13}
            width={height < width ? height*0.11 : width*0.13}
            marco={marco}
            photo={photo}
        />
        <div className={style.column}>
           <div className={style.row} style={{width: '100%', paddingLeft: '0.5rem'}}>
                <span className={style.username}>{username}</span>
                <span className={style.elo}>({elo})</span>
           </div>
           <img 
              src={flags} 
              alt="flags" 
              style={{width: height -200 < width ? height *0.05 : width *0.08}}
              className={style.flags}
           />
        </div>
      </div>
      <div className={style.containerTimer} style={{alignItems: alignItems}}>
         <div className={style.timer} >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-stopwatch" viewBox="0 0 16 16">
                <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z"/>
                <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3"/>
            </svg>
            <span className={style.textTimer}>
                10:00
            </span>
         </div>
      </div>
    </div>
  )
}

export default ProfilePanel
