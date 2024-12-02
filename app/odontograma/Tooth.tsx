"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";

interface ToothProps {
  number: number;
  onRegister: (registro: { lado: string; color: string; fecha: string; accion: string }) => void;
  highlightedTooth: { number: number; color: string; lado: string } | null;
  userId: number | null; // ID del usuario actual
  onHighlightTooth: (toothNumber: number, color: string, lado: string) => void;
}

type ToothFace = "top" | "right" | "bottom" | "left" | "center";

const colorMapping: { [key: number]: string } = {
  1: "lightcoral",
  2: "lightblue",
  3: "palegoldenrod",
  4: "lightgreen",
  5: "sandybrown",
  6: "lightsalmon",
  7: "plum",
};

const tooltipMapping: { [key: number]: string } = {
  1: "Patología activa o una condición que requiere tratamiento.",
  2: "Tratamiento realizado/corregido.",
  3: "Placa/Sarro.",
  4: "Prevención/Protección.",
  5: "Lesión/Desgaste.",
  6: "Alteración anatómica.",
  7: "Cirugía oral.",
  11: "Extracción: Remoción del diente.",
  12: "Prótesis →: Comienzo de una prótesis desde el lado derecho del diente.",
  13: "Prótesis ←: Comienzo de una prótesis desde el lado izquierdo del diente.",
};

const colorLabels: { [key: number]: string } = {
  1: "Rojo",
  2: "Azul",
  3: "Amarillo",
  4: "Verde",
  5: "Marrón",
  6: "Naranja",
  7: "Violeta",
};

const Tooth: React.FC<ToothProps> = ({ number, onRegister, highlightedTooth, userId, onHighlightTooth }) => {
  const [selectedFaces, setSelectedFaces] = useState<{ [key in ToothFace]?: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedFace, setSelectedFace] = useState<ToothFace | null>(null);
  const [observaciones, setObservaciones] = useState<string>("");
  const [isExtraction, setIsExtraction] = useState(false);
  const [protesisRight, setProtesisRight] = useState(false);
  const [protesisLeft, setProtesisLeft] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData); // Aseguramos que sea un JSON válido
      setAuthToken(parsedData.token); // Guardamos el token
    } else {
      console.error("No se encontró userData en localStorage");
      window.location.href = "/"; // Redirige si no hay datos
    }
  }, []);

  const handleClick = (face: ToothFace) => {
    setSelectedFace(face);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setObservaciones("");
    setSelectedNumber(null);
  };

  const handleNumberSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const num = Number(event.target.value);
    setSelectedNumber(num);
  };

    const handleApplyNumber = async () => {
      if (!userId) {
          console.error("Usuario no disponible.");
          return;
      }

      try {
          if (selectedNumber !== null && selectedFace) {
              const isExtraccion = selectedNumber === 11;
              const isProtesisRight = selectedNumber === 12;
              const isProtesisLeft = selectedNumber === 13;

              if (isExtraccion) {
                  setIsExtraction(true);
                  setProtesisRight(false);
                  setProtesisLeft(false);
                  setSelectedFaces({});
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
                      ? `Prótesis lado derecho del diente ${number}`
                      : isProtesisLeft
                      ? `Prótesis lado izquierdo del diente ${number}`
                      : tooltipMapping[selectedNumber] || `Procedimiento desconocido (ID: ${selectedNumber})`;

              const newNota = {
                  tooth_number: number,
                  procedure: accion,
                  date: fecha,
                  user: userId,
                  observations: observaciones,
              };

              try {
                  await api.post('/notes/', newNota);
                  onRegister({ lado: selectedFace, color: isExtraccion ? "white" : colorMapping[selectedNumber], fecha, accion });
              } catch (error) {
                  console.error("Error al registrar la nota:", error);
              }
          }
      } catch (error) {
          console.error("Error al aplicar el procedimiento:", error);
      }

      handleCloseModal();
  };


  return (
    <div style={{ margin: "10px", textAlign: "center" }}>
      <svg width="50" height="50" viewBox="0 0 100 100" style={{ cursor: "pointer" }}>
        <rect x="10" y="10" width="80" height="80" stroke="black" strokeWidth="2" fill="none" />
        <rect x="35" y="35" width="30" height="30" stroke="black" strokeWidth="2" fill="none" />
        <polygon points="10,10 90,10 65,35 35,35" fill={selectedFaces.top || "transparent"} stroke="black" onClick={() => handleClick("top")} />
        <polygon points="90,10 90,90 65,65 65,35" fill={selectedFaces.right || "transparent"} stroke="black" onClick={() => handleClick("right")} />
        <polygon points="10,90 90,90 65,65 35,65" fill={selectedFaces.bottom || "transparent"} stroke="black" onClick={() => handleClick("bottom")} />
        <polygon points="10,10 10,90 35,65 35,35" fill={selectedFaces.left || "transparent"} stroke="black" onClick={() => handleClick("left")} />
        <rect x="35" y="35" width="30" height="30" fill={selectedFaces.center || "transparent"} stroke="black" onClick={() => handleClick("center")} />

        {isExtraction && (
          <>
            <line x1="20" y1="20" x2="80" y2="80" stroke="red" strokeWidth="2" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="red" strokeWidth="2" />
          </>
        )}

        {protesisRight && (
          <text x="85" y="70" textAnchor="start" fontSize="80" fill="blue" style={{ fontWeight: "normal" }}>
            [
          </text>
        )}

        {protesisLeft && (
          <text x="15" y="70" textAnchor="end" fontSize="80" fill="blue" style={{ fontWeight: "normal" }}>
            ]
          </text>
        )}
      </svg>
      <div> {number}</div>

      {isModalOpen && (
        <div className="modal" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 9999, padding: "20px", borderRadius: "8px", backgroundColor: "#f8f9fa", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
          <h3 style={{ textAlign: "center" }}>Selecciona una opción</h3>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>Opciones:</label>
            <select onChange={handleNumberSelect} value={selectedNumber || ""} style={{ flex: 1, padding: "10px", borderRadius: "5px" }}>
              <option value="" title="Selecciona una opción">
                Selecciona
              </option>
              {Object.keys(colorMapping).map((key) => (
                <option key={key} value={key} title={tooltipMapping[+key]}>
                  {colorLabels[+key]}
                </option>
              ))}
              <option value="11" title={tooltipMapping[11]}>
                Extracción
              </option>
              <option value="12" title={tooltipMapping[12]}>
                Prótesis →
              </option>
              <option value="13" title={tooltipMapping[13]}>
                Prótesis ←
              </option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", width: "100%" }}
          />
          <button
            onClick={handleApplyNumber}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "10px",
              backgroundColor: "#000000",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Aplicar
          </button>
          <button
            onClick={handleCloseModal}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "10px",
              backgroundColor: "#5a5757",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default Tooth;
