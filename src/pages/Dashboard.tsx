import { FiFileText, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiActivity, FiClock } from 'react-icons/fi';

const Dashboard = () => {
  const stats = [
    { label: 'Total Pólizas', value: '1,284', icon: <FiFileText />, type: 'total' },
    { label: 'Insertados', value: '1,250', icon: <FiCheckCircle />, type: 'success' },
    { label: 'Rechazados', value: '34', icon: <FiAlertCircle />, type: 'error' },
    { label: 'Eficiencia', value: '97.3%', icon: <FiTrendingUp />, type: 'info' },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Panel de Control</h1>
          <p>Monitoreo de carga y validación de pólizas</p>
        </div>
        <div className="header-meta">
          <FiClock /> Actualizado: {new Date().toLocaleTimeString()}
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card ${stat.type}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="main-grid">
        <section className="chart-section">
          <div className="section-header">
            <h3><FiActivity /> Tendencia de Carga</h3>
            <select className="custom-select">
              <option>Últimos 7 días</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <span>[ Visualización de Datos ]</span>
          </div>
        </section>

        <section className="history-section">
          <h3>Últimas Cargas</h3>
          <div className="history-list">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="history-item">
                <div className="status-indicator"></div>
                <div className="item-details">
                  <strong>carga_polizas_q4.csv</strong>
                  <span>ID: 8234-{i}</span>
                </div>
                <div className="badge">FIN</div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">Ver Historial</button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
