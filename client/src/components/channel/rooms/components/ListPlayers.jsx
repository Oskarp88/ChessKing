import React from 'react';
import style from './ListPlayers.module.css';
import { useAuth } from '@/context/authContext/authContext';
import { FastSvg } from '@/svg';

export default function ListPlayers({
    handleModalOpen,
    setHoveredFriend,
    hoveredFriend,
    user
}) {

    const {auth} = useAuth();

    const time = localStorage.getItem('time');
    let count = 1;
  return (
    <li               
        className={`${style.frienditem} ${hoveredFriend === user.userId ? `${style.frienditem} ${style.frienditemHovered}` : ''}`}              
        style={user.userId === auth?.user?._id ? {background: 'linear-gradient(to top, #4e8381  0%, #73c2c0 100%)'} : {}}
        onMouseEnter={() => setHoveredFriend(user.userId)}
        onMouseLeave={() => setHoveredFriend(null)}
        onClick={() => handleModalOpen(user)}
    >                
        <div className={style.containerProfile}>
            <span style={{marginRight: '7px', color: '#fff'}}>{count++}.</span>
            <div className={style.imageContainer} >
                <img className={style.photoImage} src={user?.photo} alt="User Photo" />                  
                <img className={style.marco} src={user?.marco} alt="Marco"/>
            </div> 
            <div className={style.friendName}>
                    <span  >
                    {user?.username.substring(0, 8) > 8 ? user?.username.substring(0, 8)+'...' :  user?.username }
                    </span>
                    <img src={user?.flags} title={auth?.user?.country} className={style.bandera} alt="" />
            </div>
        </div>
        <div className={style.containerFlex}>           
            <div className={style.containerRanking}>
                <div style={{marginTop: '-2px'}} >
                {parseInt(time) === 60 || parseInt(time) === 120 
                    ?  <BulletSvg/> 
                    : parseInt(time) === 180 || parseInt(time) === 300 
                      ? <BlitzSvg /> 
                      : <FastSvg />
                }
                </div>
                <div className={style.friendRank}>
                    <span >
                      {user.elo}
                    </span>
                </div>
            </div>
        </div>              
    </li>
  )
}
