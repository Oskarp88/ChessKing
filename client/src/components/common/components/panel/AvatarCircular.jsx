import React from 'react';
import style from './AvatarCircular.module.css';

function AvatarCircular({width, height, photo, marco}) {
  return (
    <div style={{width: width, height: height}}>
        <div className={style.imageContainer}>
            <img className={style.playerIcon} src={photo} alt="User" />
            <img className={style.marco} src={marco} alt="decoration" />
        </div>     
    </div>
  )
}

export default AvatarCircular;
