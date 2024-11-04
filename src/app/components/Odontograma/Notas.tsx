import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Nota {
  id: number;
  tooth_number: number;
  procedure: string;
  date: string;
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

  const cargarNotas = async () => {
    if (!userId) return; // Si no hay usuario seleccionado, no hacer la consulta

    setCargando(true);
    try {
      const respuesta = await axios.get('http://localhost:8000/api/notes/', {
        params: { userId, pieza: piezaSeleccionada === 'todas las piezas' ? '' : piezaSeleccionada }
      });
      setNotas(respuesta.data);
    } catch (error) {
      console.error("Error al cargar las notas:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNotas();
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div className="notas-container" style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', width: '80%', maxWidth: '800px' }}>
        
        {/* Sección de Historial y Filtro */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="select-notas">Historial</label>
            <select id="select-notas" value={piezaSeleccionada} onChange={event => setPiezaSeleccionada(event.target.value)} style={{ marginLeft: '10px' }}>
              <option value="todas las piezas">Filtro</option>
              {[...Array(38)].map((_, i) => (
                <option key={i + 11} value={i + 11}>{i + 11}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Encabezados de la tabla */}
        <table className="notas-table" style={{ width: '100%', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>Pieza</th>
              <th>Procedimiento</th>
              <th>Fecha</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {notas.length > 0 ? (
              notas.map(nota => (
                <tr key={nota.id}>
                  <td>{nota.tooth_number}</td>
                  <td>{nota.procedure}</td>
                  <td>{nota.date}</td>
                  <td>Sin observaciones</td>
                  <td>
                    <button onClick={() => verNota(nota)}>🔎</button>
                    <button onClick={() => eliminarNota(nota.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td>
                  <button onClick={() => alert("Acción no disponible")}>🔎</button>
                  <button onClick={() => alert("Acción no disponible")}>🗑️</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notas;