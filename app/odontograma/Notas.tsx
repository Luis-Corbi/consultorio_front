"use client";
import React, { useState, useEffect } from "react";
import "./odonto.css";
import api from "@/lib/api";

interface Nota {
  id: number;
  tooth_number: number;
  procedure: string;
  date: string;
  user: number;
  observations?: string;
  is_active: boolean;
}

interface NotasProps {
  registros: { lado: string; color: string; fecha: string; accion: string }[];
  onRegister: (registro: { lado: string; color: string; fecha: string; accion: string }) => void;
  onHighlightTooth: (toothNumber: number, color: string, lado: string) => void;
  userId: number | null;
}

const Notas: React.FC<NotasProps> = ({
  registros,
  onRegister,
  onHighlightTooth,
  userId,
}) => {
  const [piezaSeleccionada, setPiezaSeleccionada] = useState("todas las piezas");
  const [notas, setNotas] = useState<Nota[]>([]);
  const [borradasNotas, setBorradasNotas] = useState<Nota[]>([]);
  const [mostrarModalBorradas, setMostrarModalBorradas] = useState(false);
  const [cargando, setCargando] = useState(false);

  const cargarNotas = async () => {
    if (!userId) return;

    setCargando(true);
    try {
      const response = await api.get('/notes/', {
        params: {
          user_id: userId,
          pieza: piezaSeleccionada === "todas las piezas" ? "" : piezaSeleccionada,
        },
      });
      setNotas(response.data.filter((nota: Nota) => nota.is_active));
      setBorradasNotas(response.data.filter((nota: Nota) => !nota.is_active));
    } catch (error) {
      console.error("Error al cargar las notas:", error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarNota = async (id: number) => {
    try {
      await api.patch(`/notes/${id}/`, {
        is_active: false,
      });
      cargarNotas();
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
    }
  };

  const restaurarNota = async (id: number) => {
    try {
      await api.patch(`/notes/${id}/restore/`);
      cargarNotas();
    } catch (error) {
      console.error("Error al restaurar la nota:", error);
    }
  };

  const eliminarDefinitivamente = async (id: number) => {
    try {
      await api.delete(`/notes/${id}/delete-permanently/`);
      cargarNotas();
    } catch (error) {
      console.error("Error al eliminar la nota definitivamente:", error);
    }
  };

  useEffect(() => {
    cargarNotas();
  }, [piezaSeleccionada, userId]);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="notas-container">
        <div>
          <label htmlFor="select-notas">Historial</label>
          <select
            id="select-notas"
            value={piezaSeleccionada}
            onChange={(event) => setPiezaSeleccionada(event.target.value)}
          >
            <option value="todas las piezas">Filtro</option>
            {[...Array(38)].map((_, i) => (
              <option key={i + 11} value={i + 11}>
                {i + 11}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla de Notas Activas */}
        <table className="notas-table">
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
              notas.map((nota) => (
                <tr key={nota.id}>
                  <td>{nota.tooth_number}</td>
                  <td>{nota.procedure}</td>
                  <td>{nota.date}</td>
                  <td>{nota.observations || "-"}</td>
                  <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => eliminarNota(nota.id)}
                          style={{
                            display: "inline-block",
                            margin: "0 auto",
                            padding: "5px 10px",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          🗑️
                        </button>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay notas disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Botón para Ver Notas Borradas */}
        <button
          onClick={() => setMostrarModalBorradas(true)}
          style={{ marginTop: "10px", marginLeft: "5px" }}
        >
          ♻
        </button>

        {/* Modal para Ver Notas Borradas */}
        {mostrarModalBorradas && (
          <div
            className="modal"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "8px",
              zIndex: 1000,
            }}
          >
            <h3>Notas Borradas</h3>
            <table className="notas-table">
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
                {borradasNotas.length > 0 ? (
                  borradasNotas.map((nota) => (
                    <tr key={nota.id}>
                      <td>{nota.tooth_number}</td>
                      <td>{nota.procedure}</td>
                      <td>{nota.date}</td>
                      <td>{nota.observations || "-"}</td>
                      <td>
                        <button onClick={() => restaurarNota(nota.id)}>🔄 Restaurar</button>
                        <button onClick={() => eliminarDefinitivamente(nota.id)}>❌ Borrar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No hay notas borradas disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              onClick={() => setMostrarModalBorradas(false)}
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notas;
