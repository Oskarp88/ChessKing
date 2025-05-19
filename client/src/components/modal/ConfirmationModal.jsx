import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h3>Warning</h3>
        <p>If you refresh the page, you will be redirected to /home. Do you want to continue?</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;