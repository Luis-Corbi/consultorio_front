import React from 'react';
import './Calendario.css';


interface ModalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalAlert: React.FC<ModalAlertProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-alert">
      <div className="modal-content-aler">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este turno?</p>
        <div className='botones-modal'>
          <button type="button" onClick={onConfirm} className="confirm-button">Confirmar</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert;
