import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import type { UploadResponse } from '../interfaces/responses';

const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResponse>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "text/csv" || droppedFile?.name.endsWith('.csv')) {
      setFile(droppedFile);
    } else {
      alert("Por favor, sube un archivo CSV válido.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file); // 'file' debe coincidir con tu backend

    setUploading(true);
    try {
      const data = await api.post('/upload', formData);
      setResults(data);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error al procesar el archivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Carga de Pólizas</h2>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".csv"
          hidden
        />

        {file ? (
          <p className="file-info">📄 {file.name}</p>
        ) : (
          <p>Arrastra tu CSV aquí o haz clic para seleccionar</p>
        )}
      </div>

      <button
        className="upload-btn"
        onClick={(e) => { e.stopPropagation(); uploadFile(); }}
        disabled={!file || uploading}
      >
        {uploading ? 'Procesando...' : 'Subir Archivo'}
      </button>

      {/* Aquí irían los componentes de Progress Bar y Tabla de Errores que pide el punto 6A */}
      {results && (
        <div className="results-summary">
          <h3>Resultado de Operación: {results.metrics.operation_id}</h3>
          <ul>
            <li>Insertados: {results.metrics.inserted_count}</li>
            <li>Rechazados: {results.metrics.rejected_count}</li>
            <li>Advertencias: {results.metrics.warning_count}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
