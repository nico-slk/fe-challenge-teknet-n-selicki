import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import type { UploadResponse } from '../interfaces/responses';

const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const resetStates = () => {
    setErrorMessage(null);
    setResults(undefined);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    resetStates();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "text/csv" || droppedFile?.name.endsWith('.csv')) {
      setFile(droppedFile);
    } else {
      setErrorMessage("El formato de archivo no es válido. Por favor, sube un CSV.");
      setFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetStates();
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        setErrorMessage("Por favor, selecciona un archivo CSV.");
      }
    }

    e.target.value = '';
  };

  const uploadFile = async () => {
    if (!file) return;

    const fileKey = `last_upload_${file.name}_${file.size}`;
    const cachedResult = localStorage.getItem(fileKey);

    if (cachedResult) {
      console.log("El archivo es idéntico al anterior. Cargando resultado de caché.");
      setResults(JSON.parse(cachedResult));
      setFile(null);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const data = await api.post('/upload', formData);
      localStorage.setItem(fileKey, JSON.stringify(data));
      setResults(data);
      setFile(null);
    } catch (error: unknown) {
      console.error("Error uploading file:", error);
      const err = error as { response?: { data?: { message?: string; }; }; message?: string; };
      const msg = err.response?.data?.message || err.message || "Error inesperado al conectar con el servidor.";
      setErrorMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Carga de Pólizas</h2>

      <div
        className={`drop-zone 
          ${isDragging ? 'dragging' : ''} 
          ${file ? 'has-file' : ''} 
          ${errorMessage ? 'has-error' : ''}`}
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
          <div className="zone-content">
            <p>{errorMessage ? '❌' : '☁️'}</p>
            <p>{errorMessage || 'Arrastra tu CSV aquí o haz clic para seleccionar'}</p>
          </div>
        )}
      </div>
      {errorMessage && <p className="inline-error-msg">{errorMessage}</p>}
      <button
        className="upload-btn"
        onClick={(e) => { e.stopPropagation(); uploadFile(); }}
        disabled={!file || uploading}
      >
        {uploading ? 'Procesando...' : 'Subir Archivo'}
      </button>

      {results && (
        <div className="results-summary">
          <h3>Resultado de Operación: {results.metrics.operation_id}</h3>
          <ul>
            <li className="results-summary-success">Insertados: <p>{results.metrics.inserted_count}</p></li>
            <li className="results-summary-rejected">Rechazados: <p>{results.metrics.rejected_count}</p></li>
            <li className="results-summary-warn">Advertencias: <p>{results.metrics.warning_count}</p></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
