import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import style from './UserProfile.module.css'; 

const AvatarSelectorModal = ({ show, handleClose, avatars, selectAvatar }) => {
  return (
    <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>Selecciona un Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body className={style.modalBodyWithScroll}>
        <div className={style.avatarGrid}>
          {avatars.map((item, index) => (
            <div key={index} className={style.avatarItem} onClick={() => selectAvatar(item.avatar)}>
              <img src={item.avatar} alt={`Avatar ${index}`} className={style.avatarImage} />
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

export default AvatarSelectorModal;
