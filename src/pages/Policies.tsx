import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import type { Poliza, SummaryResponse } from '../interfaces/responses';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const PoliciesPage = () => {
  const [policies, setPolicies] = useState<Poliza[]>([]);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesRes, summaryRes] = await Promise.all([
          api.get('/?limit=100'),
          api.get('/summary')
        ]);
        console.log(policiesRes.data);
        setPolicies(policiesRes.data);
        setSummary(summaryRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="policies-container">
      <h2>Listado de Pólizas y Métricas</h2>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Distribución por Tipo de Póliza</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary?.distributionByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                label
              >
                {summary?.distributionByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Prima Total (USD) por Región</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary?.premiumByRegion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="policies-table">
          <thead>
            <tr>
              <th>Nro Póliza</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Prima (USD)</th>
              <th>Suma Asegurada</th>
              <th>Estado</th>
              <th>Región</th>
              <th>Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id}>
                <td>{p.policy_number}</td>
                <td>{p.customer}</td>
                <td>{p.policy_type}</td>
                <td>${p.premium_usd.toLocaleString()}</td>
                <td>${p.insured_value_usd.toLocaleString()}</td>
                <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                <td>{p.region}</td>
                <td><span className={`risk-badge ${p.risk_rating}`}>{p.risk_rating}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoliciesPage;
