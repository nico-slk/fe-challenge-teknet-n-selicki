import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import type { PoliciesSummaryRawResponse, Poliza } from '../interfaces/responses';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const PoliciesPage = () => {
  const [policies, setPolicies] = useState<Poliza[]>([]);
  const [summary, setSummary] = useState<PoliciesSummaryRawResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    q: '',
    status: '',
    policy_type: '',
    region: '',
    sort_by: '',
    order: 'DESC'
  });
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (filters.page - 1) * filters.limit;
        const params = new URLSearchParams();
        params.append('limit', filters.limit.toString());
        params.append('offset', offset.toString());
        if (filters.q) params.append('q', filters.q);
        if (filters.status) params.append('status', filters.status);
        if (filters.policy_type) params.append('policy_type', filters.policy_type);
        if (filters.region) params.append('region', filters.region);
        if (filters.sort_by) {
          params.append('sort_by', filters.sort_by);
          params.append('order', filters.order);
        }
        const [policiesRes, summaryRes] = await Promise.all([
          api.get(`/policies/?${params.toString()}`, false),
          api.get('/policies/summary')
        ]);
        setPolicies(policiesRes.data);
        setSummary(summaryRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleNextPage = () => setFilters(prev => ({
    ...prev,
    page: prev.page + 1
  }));
  const handlePrevPage = () => setFilters(prev => ({
    ...prev,
    page: Math.max(prev.page - 1, 1)
  }));

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1
    }));
  };

  const toggleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sort_by: field,
      order: prev.sort_by === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
      page: 1
    }));
  };

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
                data={summary?.metrics_by_type.map(item => ({
                  ...item,
                  premium_sum: Number(item.premium_sum)
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="premium_sum"
                nameKey="policy_type"
                label
              >
                {summary?.metrics_by_type.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Prima Total (USD) por Región</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={summary?.count_by_region.map(item => ({
                ...item,
                count: Number(item.count)
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="region"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          name="q"
          placeholder="Buscar cliente..."
          value={filters.q}
          onChange={handleFilterChange}
          className="filter-input"
        />

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Todos los Estados</option>
          <option value="active">Activo</option>
          <option value="expired">Expirado</option>
          <option value="cancelled">Cancelado</option>
        </select>

        <select name="policy_type" value={filters.policy_type} onChange={handleFilterChange}>
          <option value="">Todos los Tipos</option>
          <option value="Health">Salud</option>
          <option value="Auto">Auto</option>
          <option value="Life">Vida</option>
          <option value="Property">Hogar</option>
          <option value="Liability">Liability</option>
          <option value="Marine">Marine</option>
          <option value="Cyber">Cyber</option>
          <option value="D&O">D&O</option>
        </select>

        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="">Todas las Regiones</option>
          <option value="LATAM">LATAM</option>
          <option value="NA">NA</option>
          <option value="EMEA">EMEA</option>
          <option value="APAC">APAC</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="policies-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('policy_number')} className="sortable">
                Nro Póliza {filters.sort_by === 'policy_number' && (filters.order === 'ASC' ? '↑' : '↓')}
              </th>
              <th onClick={() => toggleSort('customer')} className="sortable">
                Cliente {filters.sort_by === 'customer' && (filters.order === 'ASC' ? '↑' : '↓')}
              </th>
              <th>Tipo</th>
              <th onClick={() => toggleSort('premium_usd')} className="sortable">
                Prima {filters.sort_by === 'premium_usd' && (filters.order === 'ASC' ? '↑' : '↓')}
              </th>
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
      <div className="pagination-controls">
        <button
          onClick={handlePrevPage}
          disabled={filters.page === 1 || loading}
          className="pagi-btn"
        >
          <FiChevronLeft /> Anterior
        </button>

        <span className="page-indicator">Página <strong>{filters.page}</strong></span>

        <button
          onClick={handleNextPage}
          disabled={policies.length < limit || loading}
          className="pagi-btn"
        >
          Siguiente <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default PoliciesPage;
