import React from 'react';



interface ModalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalAlert: React.FC<ModalAlertProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <span className="text-gray-500 text-2xl font-bold cursor-pointer float-right" onClick={onClose}>&times;</span>
        <h2 className="text-xl font-semibold mb-4">Confirmar Eliminación</h2>
        <p className="mb-6">¿Estás seguro de que deseas eliminar este turno?</p>
        <div className="flex justify-around mt-4">
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Confirmar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};


export default ModalAlert;
