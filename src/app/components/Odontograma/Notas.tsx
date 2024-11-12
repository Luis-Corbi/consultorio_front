"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../odontograma/odonto.css"; // Asegúrate de que el archivo de estilos esté correctamente referenciado

interface Nota {
  id: number;
  tooth_number: number;
  procedure: string;
  date: string;
  user: number; // Agrega el usuario asociado a la nota
  observations?: string; // Agrega el campo para observaciones
}

interface NotasProps {
  registros: { lado: string; color: string; fecha: string; accion: string }[];
  onRegister: (registro: { lado: string; color: string; fecha: string; accion: string }) => void;
  onHighlightTooth: (toothNumber: number, color: string, lado: string) => void; 
  userId: number | null; // Recibe el ID del usuario seleccionado
}

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

const Notas: React.FC<NotasProps> = ({ registros, onRegister, onHighlightTooth, userId }) => {
  const [piezaSeleccionada, setPiezaSeleccionada] = useState('todas las piezas');
  const [notas, setNotas] = useState<Nota[]>([]);
  const [cargando, setCargando] = useState(false);
  const [nuevoProcedimiento, setNuevoProcedimiento] = useState('');
  const [toothNumber, setToothNumber] = useState<number | null>(null); // Para el número del diente
  const [observaciones, setObservaciones] = useState<string>(''); // Para las observaciones
  const [showObservationsBox, setShowObservationsBox] = useState<boolean>(false); // Controlar visibilidad del recuadro
  const [currentObservation, setCurrentObservation] = useState<string>(''); // Para almacenar la observación actual a mostrar

  const cargarNotas = async () => {
    if (!userId) return; // Si no hay usuario seleccionado, no hacer la consulta

    setCargando(true);
    try {
      const respuesta = await axios.get('http://localhost:8000/api/notes/', {
        params: { user_id: userId, pieza: piezaSeleccionada === 'todas las piezas' ? '' : piezaSeleccionada }
      });
      setNotas(respuesta.data);
    } catch (error) {
      console.error("Error al cargar las notas:", error);
    } finally {
      setCargando(false);
    }
  };

  const agregarNota = async () => {
    if (!userId || !toothNumber || !nuevoProcedimiento) return; // Asegúrate de que los campos estén completos

    const nuevaNota = {
      tooth_number: toothNumber,
      procedure: nuevoProcedimiento,
      user: userId, // Asocia la nota con el usuario seleccionado
      observations: observaciones // Almacenar las observaciones
    };

    try {
      const response = await axios.post('http://localhost:8000/api/notes/', nuevaNota);
      console.log('Nota creada:', response.data);
      setNotas([...notas, response.data]); // Agrega la nueva nota al estado
      setNuevoProcedimiento(''); // Limpiar el campo de procedimiento
      setToothNumber(null); // Limpiar el número del diente
      setObservaciones(''); // Limpiar las observaciones
      cargarNotas(); // Recargar notas después de crear una
    } catch (error) {
      console.error('Error al crear la nota:', error);
    }
  };

  useEffect(() => {
    cargarNotas(); // Cargar notas cada vez que cambia el usuario o la pieza seleccionada
  }, [piezaSeleccionada, userId]); // Cargar notas cuando cambia el usuario o la pieza seleccionada

  const eliminarNota = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/notes/${id}/`);
      setNotas(notas.filter(nota => nota.id !== id));
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
    }
  };

  const verNota = (nota: Nota) => {
    const match = nota.procedure.match(/\d+/);
    const colorIndex = match ? parseInt(match[0], 10) : 1;
    const color = colorMapping[colorIndex];
    
    const lado = nota.procedure.split(' ').find(part => ['top', 'right', 'bottom', 'left', 'center'].includes(part)) || 'top';
    if (color) {
      onHighlightTooth(nota.tooth_number, color, lado);
    }
  };

  const mostrarObservaciones = (observaciones: string) => {
    setCurrentObservation(observaciones); // Establece la observación actual
    setShowObservationsBox(true); // Muestra el recuadro
  };

  const cerrarObservacionesBox = () => {
    setShowObservationsBox(false); // Cierra el recuadro
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div className="notas-container">
        
        
        {/* Sección de Historial y Filtro */}
        <div>
          <label htmlFor="select-notas">Historial</label>
          <select id="select-notas" value={piezaSeleccionada} onChange={event => setPiezaSeleccionada(event.target.value)}>
            <option value="todas las piezas">Filtro</option>
            {[...Array(38)].map((_, i) => (
              <option key={i + 11} value={i + 11}>{i + 11}</option>
            ))}
          </select>
        </div>
        
        {/* Encabezados de la tabla */}
        <table className="notas-table">
          <thead>
            <tr>
              <th>Pieza</th>
              <th>Procedimiento</th>
              <th>Fecha</th>
              <th style={{ display: 'none' }}>Usuario</th> {/* Ocultar columna de Usuario */}
              <th>Observaciones</th> {/* Nueva columna de Observaciones */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
              {notas.length > 0 ? (
                notas
                  .slice() // Crear una copia del array para no mutarlo
                  .reverse() // Invertir el orden de las notas
                  .map((nota) => ( // Mapear las notas desde la más reciente
                    <tr key={nota.id}>
                      <td>{nota.tooth_number}</td>
                      <td>{nota.procedure}</td>
                      <td>{nota.date}</td>
                      <td style={{ display: 'none' }}>{nota.user}</td> {/* Ocultar datos de Usuario */}
                      <td>
                        <button 
                            style={{ display: 'block', margin: '0 auto' }} 
                            onClick={() => mostrarObservaciones(nota.observations)}
                        >
                            🔎
                        </button> {/* Botón en la columna de Observaciones centrado */}
                      </td>
                      <td>
                        <button onClick={() => eliminarNota(nota.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6}>No hay notas disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        
        {/* Recuadro de Observaciones */}
        {showObservationsBox && (
          <div className={`observaciones-box ${showObservationsBox ? 'show' : 'hide'}`}>
            <button className="close-button" onClick={cerrarObservacionesBox}>✖️</button>
            <h4>Observaciones</h4>
              <div className="content">
                <p>{currentObservation}</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Notas;