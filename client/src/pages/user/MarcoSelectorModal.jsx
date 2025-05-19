import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import style from './UserProfile.module.css'; 
import Spinner from 'react-bootstrap/esm/Spinner';

const MarcoSelectorModal = ({ show, handleClose, marcos, selectMarco }) => {
  return (
    <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>Selecciona un Marco</Modal.Title>
      </Modal.Header>
      <Modal.Body className={style.modalBodyWithScroll}>
        <div className={style.avatarGrid}>
          {marcos.map((item, index) => (
            <div key={index} className={style.avatarItem}  onClick={() => selectMarco(item.marco)}>
             {item?.marco ? 
              <img src={item.marco} alt={`Marco ${index}`} className={style.avatarImage} style={{border:'none'}}/>
              :  <div style={{color: '#000'}}>
                <Spinner animation="border" size="sm" />
                <Spinner animation="border" />
                <Spinner animation="grow" size="sm" />
                <Spinner animation="grow" />
              </div>}
            </div> 
    
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MarcoSelectorModal;
