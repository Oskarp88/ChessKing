import React from 'react';
import style from './gameTimes.module.css';
import { helpersMethods } from '../../../utils/helpers/helpersMethods';
import FastSvg from '../../../svg/fastSvg';
import BlitzSvg from '../../../svg/blitzSvg';
import BulletSvg from '../../../svg/bulletSvg';
import { colorManager } from '../../../utils/constants/colorsManager';

function GameTimes() {
  return (
    <div 
       className={style.gameTime}
       style={{background: colorManager.blueDark7}}
    >
       <div className={style.column}>
            <h3 className={style.title}>Choose game time</h3>
            <div className={style.row}>
               {helpersMethods.gameTimes.map((time) => {
                const label = time.split(" ")[0];
                const times = time.split(" ")[1];
                return (
                  <div className={style.card}>
                     <div className={style.label}>
                       <span>{label}</span>
                       {label === 'Rapid' 
                           ? <FastSvg/>
                           : label === 'Blitz'
                              ? <BlitzSvg/>
                              : <BulletSvg/>
                        }
                     </div>
                     <span>{times}</span>
                  </div>)
               })}
            </div>            
       </div>
    </div>
  )
}

export default GameTimes
