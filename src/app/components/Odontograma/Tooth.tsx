"use client";
import React, { useState } from 'react';
import axios from 'axios';

interface ToothProps {
  number: number;
  onRegister: (registro: { lado: string; color: string; fecha: string; accion: string }) => void; // Prop para registrar
  highlightedTooth: { number: number; color: string; lado: string } | null; // Prop para resaltar el diente
  userId: number | null; // Prop para el ID del usuario
  onHighlightTooth: (toothNumber: number, color: string, lado: string) => void; // Acepta la función para resaltar dientes
}

type ToothFace = 'top' | 'right' | 'bottom' | 'left' | 'center';

const colorMapping: { [key: number]: string } = {
  1: 'lightblue',
  2: 'lightgreen',
  3: 'lightyellow',
  4: 'lightcoral',
  5: 'lightpink',
  6: 'lightgray',
  7: 'lightgoldenrodyellow',
  8: 'lightsalmon',
  9: 'lightseagreen',
  10: 'lightcyan',
};

const Tooth: React.FC<ToothProps> = ({ number, onRegister, highlightedTooth, userId, onHighlightTooth }) => {
  const [selectedFaces, setSelectedFaces] = useState<{ [key in ToothFace]?: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedFace, setSelectedFace] = useState<ToothFace | null>(null);
  const [observaciones, setObservaciones] = useState<string>(''); // Estado para el input de observaciones
  const [isExtraction, setIsExtraction] = useState(false); // Estado para extracción
  const [protesisRight, setProtesisRight] = useState(false); // Estado para prótesis derecha
  const [protesisLeft, setProtesisLeft] = useState(false); // Estado para prótesis izquierda

  const handleClick = (face: ToothFace) => {
    setSelectedFace(face);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setObservaciones(''); // Limpiar el input al cerrar el modal
    setSelectedNumber(null);
  };

  const handleNumberSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const num = Number(event.target.value);
    setSelectedNumber(num);
  };

  const handleApplyNumber = async () => {
    if (!userId) {
      alert("Por favor, selecciona un usuario antes de aplicar.");
      return; // No permitir aplicar si no hay usuario seleccionado
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/`);
      if (response.status === 200) {
        if (selectedNumber !== null && selectedFace) {
          const isExtraccion = selectedNumber === 11;
          const isProtesisRight = selectedNumber === 12;
          const isProtesisLeft = selectedNumber === 13;

          if (isExtraccion) {
            setIsExtraction(true);
            setProtesisRight(false);
            setProtesisLeft(false);
            setSelectedFaces({}); // Limpiar colores al aplicar extracción
          } else if (isProtesisRight) {
            setProtesisRight(true);
            setProtesisLeft(false);
            setIsExtraction(false);
          } else if (isProtesisLeft) {
            setProtesisLeft(true);
            setProtesisRight(false);
            setIsExtraction(false);
          } else {
            const color = colorMapping[selectedNumber];
            setSelectedFaces((prev) => ({
              ...prev,
              [selectedFace]: color,
            }));
            setIsExtraction(false);
            setProtesisRight(false);
            setProtesisLeft(false);
          }

          const fecha = new Date().toLocaleDateString();
          const accion =
            isExtraccion
              ? `Extracción aplicada al diente ${number}`
              : isProtesisRight
              ? `Prótesis → aplicada al diente ${number}`
              : isProtesisLeft
              ? `Prótesis ← aplicada al diente ${number}`
              : `Aplicado color ${selectedNumber} al lado ${selectedFace} del diente ${number}`;

          const newNota = {
            tooth_number: number,
            procedure: accion,
            date: fecha,
            user: userId,
            observations: observaciones,
          };

          try {
            await axios.post('http://localhost:8000/api/notes/', newNota);
            onRegister({ lado: selectedFace, color: isExtraccion ? 'white' : colorMapping[selectedNumber], fecha, accion });
          } catch (error) {
            console.error("Error al registrar la nota:", error);
          }
        }
      }
    } catch (error) {
      console.error("El usuario no existe:", error);
      alert("El usuario seleccionado no existe. Por favor, verifica el usuario.");
    }

    handleCloseModal();
  };

  return (
    <div style={{ margin: '10px', textAlign: 'center' }}>
      <svg width="50" height="50" viewBox="0 0 100 100" style={{ cursor: 'pointer' }}>
        <rect x="10" y="10" width="80" height="80" stroke="black" strokeWidth="2" fill="none" />
        <rect x="35" y="35" width="30" height="30" stroke="black" strokeWidth="2" fill="none" />
        <line x1="10" y1="10" x2="35" y2="35" stroke="black" strokeWidth="2" />
        <line x1="90" y1="10" x2="65" y2="35" stroke="black" strokeWidth="2" />
        <line x1="90" y1="90" x2="65" y2="65" stroke="black" strokeWidth="2" />
        <line x1="10" y1="90" x2="35" y2="65" stroke="black" strokeWidth="2" />

        {/* Pintar lados del diente */}
        <polygon points="10,10 90,10 65,35 35,35" fill={selectedFaces.top || 'transparent'} stroke="black" onClick={() => handleClick('top')} />
        <polygon points="90,10 90,90 65,65 65,35" fill={selectedFaces.right || 'transparent'} stroke="black" onClick={() => handleClick('right')} />
        <polygon points="10,90 90,90 65,65 35,65" fill={selectedFaces.bottom || 'transparent'} stroke="black" onClick={() => handleClick('bottom')} />
        <polygon points="10,10 10,90 35,65 35,35" fill={selectedFaces.left || 'transparent'} stroke="black" onClick={() => handleClick('left')} />
        <rect x="35" y="35" width="30" height="30" fill={selectedFaces.center || 'transparent'} stroke="black" onClick={() => handleClick('center')} />

        {/* Renderizar "X" si es extracción */}
        {isExtraction && (
          <>
            <line x1="20" y1="20" x2="80" y2="80" stroke="red" strokeWidth="2" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="red" strokeWidth="2" />
          </>
        )}

        {/* Renderizar "[" si es prótesis derecha */}
        {protesisRight && (
          <text x="85" y="70" textAnchor="start" fontSize="80" fill="blue" style={{ fontWeight: 'normal' }}>
            [
          </text>
        )}

        {/* Renderizar "]" si es prótesis izquierda */}
        {protesisLeft && (
          <text x="15" y="70" textAnchor="end" fontSize="80" fill="blue" style={{ fontWeight: 'normal' }}>
            ]
          </text>
        )}
      </svg>
      <div>Diente {number}</div>

      {isModalOpen && (
        <div className="modal" style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fa', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
          <h3 style={{ textAlign: 'center' }}>Selecciona una opción</h3>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Opciones:</label>
            <select onChange={handleNumberSelect} value={selectedNumber || ''} style={{ flex: 1, padding: '10px', borderRadius: '5px' }}>
              <option value="">Selecciona</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(num => (
                <option key={num} value={num}>
                  {num === 11 ? 'Extracción' : num === 12 ? 'Prótesis →' : num === 13 ? 'Prótesis ←' : num}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', width: '100%' }}
          />
          <button onClick={handleApplyNumber} style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#000000', color: 'white', border: 'none', borderRadius: '5px' }}>Aplicar</button>
          <button onClick={handleCloseModal} style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#5a5757', color: 'white', border: 'none', borderRadius: '5px' }}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default Tooth;