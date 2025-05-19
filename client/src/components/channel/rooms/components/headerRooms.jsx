import React, { useContext, useState } from 'react';
import style from './HeaderRooms.module.css';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Nav } from 'react-bootstrap';
import { GameContext } from '@/context/gameContext/gameContext';
import { useLanguagesContext } from '@/context/languagesContext/languagesContext';
import { BlitzSvg, BulletSvg, FastSvg } from '@/svg';

export default function HeaderRooms({handleSignOut,setShowSettings}) {
    const {infUser} = useContext(GameContext);
    const {language} = useLanguagesContext();
    const [showModalSign, setShowModalSign] = useState(false);
    const typeRoom = localStorage.getItem('typeRoom');

  return (
    <div className={style.desafio}>
        <div className={style.SignOut} onMouseLeave={()=>setShowModalSign(false)}>
        <FaSignOutAlt 
            className={style.FaSignOutAlt}
            onMouseEnter={()=>setShowModalSign(true)}               
        />
        {showModalSign && 
            <div className={style.dropdown}>
            <p onClick={()=>handleSignOut()}>Cambiar de sala</p>
            <p><Nav.Link href="/">Salir</Nav.Link></p>
            </div>
        }
        </div>
        <div className={style.titleWithIcon}>          
            <img 
                src={'/icon/userswhite.png'} 
                alt="" 
            />
            <h5>
                {language.Challenge_a_match} 
                 {' '}
                { typeRoom === 'onlineBullet1' 
                    ? '1' 
                    : typeRoom === 'onlineBullet2' 
                      ? '2' 
                      : typeRoom === 'onlineBlitz3'
                        ? '3' 
                        : typeRoom === 'onlineBlitz5'
                          ? '5' 
                          : typeRoom === 'onlineFast10'
                            ? '10' 
                            : '20'
                } mn
            </h5>
            {infUser?.time === 60  || infUser?.time === 120 
                ? <BulletSvg/> 
                : infUser?.time === 180 || infUser.time === 300 
                ? <BlitzSvg/> 
                : <FastSvg/>
            }
        </div>
        <div 
            className={style.setting} 
            title={language.settings}
            onClick={()=>setShowSettings(true)}
        >
            <FaCog className={style.FaCog} />
        </div>
    </div> 
  )
}
