import { useState, useMemo } from 'react';
import { FiAlertCircle, FiAlertTriangle, FiFilter } from 'react-icons/fi';
import type { AVGClaimByType, Issue } from '../interfaces/responses';

const CLAIM_THRESHOLD_ERROR = 8;
const CLAIM_THRESHOLD_WARN = 7.5;

const ErrorTable = () => {
  const [data] = useState(() => {
    const cached = localStorage.getItem('/policies/summary');
    return cached ? JSON.parse(cached) : null;
  });

  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'ERROR' | 'WARN'>('ALL');

  const issues = useMemo(() => {
    if (!data) return [];

    return data.avg_claims_by_type.map((item: AVGClaimByType) => {
      const avg = parseFloat(item.avg_claims);
      let severity: 'ERROR' | 'WARN' | 'OK' = 'OK';

      if (avg >= CLAIM_THRESHOLD_ERROR) severity = 'ERROR';
      else if (avg >= CLAIM_THRESHOLD_WARN) severity = 'WARN';

      return {
        id: item.policy_type,
        type: item.policy_type,
        value: avg.toFixed(2),
        message: `Promedio de siniestros elevado para el sector ${item.policy_type}`,
        severity
      };
    }).filter((issue: Issue) => issue.severity !== 'OK');
  }, [data]);

  const filteredIssues = useMemo(() => {
    if (severityFilter === 'ALL') return issues;
    return issues.filter((i: Issue) => i.severity === severityFilter);
  }, [issues, severityFilter]);

  if (!data) return <div className="p-10">Cargando métricas...</div>;

  return (
    <div className="errors-page">
      <header className="errors-header">
        <div>
          <h1>Alertas de Validación</h1>
          <p>Detección de anomalías basada en promedios de siniestralidad</p>
        </div>

        <div className="filter-box">
          <FiFilter />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as 'ALL' | 'ERROR' | 'WARN')
            }
          >
            <option value="ALL">Todos los niveles</option>
            <option value="ERROR">Severidad: Alta</option>
            <option value="WARN">Severidad: Media</option>
          </select>
        </div>
      </header >

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Métrica (Avg Claims)</th>
              <th>Descripción de la Alerta</th>
              <th>Severidad</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue: Issue) => (
                <tr key={issue.id}>
                  <td className="col-name">{issue.type}</td>
                  <td className="bad-value"><code>{issue.value}</code></td>
                  <td className="err-msg">{issue.message}</td>
                  <td>
                    <span className={`severity-tag ${issue.severity.toLowerCase()}`}>
                      {issue.severity === 'ERROR' ? <FiAlertCircle /> : <FiAlertTriangle />}
                      {issue.severity === 'ERROR' ? 'CRÍTICO' : 'ATENCIÓN'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="empty-state">No hay alertas detectadas para este filtro.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default ErrorTable;
