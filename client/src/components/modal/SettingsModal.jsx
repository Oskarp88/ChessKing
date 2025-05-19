import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import style from './SettingsModal.module.css';
import Accordion from 'react-bootstrap/Accordion';
import { useChessboardContext } from '../../context/boardContext/boardContext';
import { colorBoard } from '../../utils/Colors';
import { piecesTheme } from '../../utils/pieces';


function SettingsModal({show, handleClose}) {
    const {
        setBoardColor, 
        boardColor,
        themePiece, 
        setTemePiece
     } = useChessboardContext();

   const handleColorChange = ( num) => {  
    setBoardColor(colorBoard[num]);
    localStorage.setItem('colorBoard', num);
   }

   const handlePiecesChange = (num) => { 
    setTemePiece(piecesTheme[num]);
    localStorage.setItem('pieceTheme', num);
   }
    
  return (
    <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>Configuracion</Modal.Title>
      </Modal.Header>
      <Modal.Body className={style.modalBodyWithScroll}>
      <Accordion defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Tablero #1</Accordion.Header>
            <Accordion.Body style={{background: colorBoard.whiteRow}}>
                <div eventKey="0" className={style.colorOptions} >
                    {colorBoard?.map((c) => {        
                            return (
                            <div 
                              key={c.id} className={`${style.colorOption} ${c.id === boardColor.id ? `${style.even}` : ''}`}
                              onClick={(e) => handleColorChange(c.id, e)}
                            >                           
                                <div className={style.colorRow}>
                                    <div className={style.colorBoard} style={{ backgroundColor: c.blackRow }}></div>
                                    <div className={style.colorBoard} style={{ backgroundColor: c.whiteRow }}></div>
                                </div>
                                <div className={style.colorRow}>
                                    <div className={style.colorBoard} style={{ backgroundColor: c.whiteRow }}></div>
                                    <div className={style.colorBoard} style={{ backgroundColor: c.blackRow }}></div>
                                </div>
                            </div>
                       )}
                    )}
                </div>
            </Accordion.Body>
        </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>piezas #2</Accordion.Header>
            <Accordion.Body>
              <div className={style.colorOptions}>
                    {piecesTheme.map((c) => {
                            return (
                            <div 
                              key={c.id} className={`${style.colorOptionPiece} ${c.id === themePiece.id ? `${style.evenPiece}` : ''}`}
                              onClick={(e) => handlePiecesChange(c.id, e)}
                              style={c.id === piecesTheme.id ? {backgroundColor: 'rgba(0,0,0,0.5)'} : {}}
                            >                           
                                <div className={style.colorRow}>
                                    <div className={style.colorBoardPiece} style={{ backgroundColor: boardColor?.blackRow }}>
                                      <img src={`/assets/${c.images}/wk.png`} alt="" />
                                    </div>
                                    <div className={style.colorBoardPiece} style={{ backgroundColor: boardColor?.whiteRow }}>
                                      <img src={`/assets/${c.images}/wq.png`} alt="" />
                                    </div>
                                </div>
                                <div className={style.colorRow}>
                                    <div className={style.colorBoardPiece} style={{ backgroundColor: boardColor?.whiteRow }}>
                                      <img src={`/assets/${c.images}/bk.png`} alt="" />
                                    </div>
                                    <div className={style.colorBoardPiece} style={{ backgroundColor: boardColor?.blackRow }}>
                                      <img src={`/assets/${c.images}/bq.png`} alt="" />
                                    </div>
                                </div>
                            </div>
                       )}
                    )}
                </div>
            </Accordion.Body>
     </Accordion.Item>
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose} >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SettingsModal;