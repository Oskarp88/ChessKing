import React from 'react'
import { FaTimes } from 'react-icons/fa';

function Toast({text, show, color, setToastShow}) {
    if(!show) return;
  return (
    <div style={{
        width: '100%',
        height: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: color,
    }}
    >
        <p style={{fontWeight: '500'}}>{text}</p>
        <FaTimes onClick={setToastShow(false)}/>
    </div>
  )
}

export default Toast