// src/types/responses.ts

export type Severity = 'error' | 'warning';

export interface RowError {
  row: number;         // Número de fila en el CSV
  field?: string;      // Campo que falló (opcional)
  message: string;     // Descripción del error
  code: string;        // Código de error (ej: PROPERTY_VALUE_TOO_LOW)
  severity: Severity;  // Indica si bloquea (error) o solo informa (warning)
}

export interface OperationMetrics {
  operation_id: string;      // UUID generado para esta carga
  total_processed: number;   // Total de filas leídas
  inserted_count: number;    // Filas guardadas en DB
  rejected_count: number;    // Filas con severity 'error'
  warning_count: number;     // Filas con severity 'warning'
}

export interface UploadResponse {
  message: string;
  metrics: OperationMetrics;
  errors: RowError[];        // Listado completo de fallas técnicas y de negocio
  correlation_id: string;    // ID de trazabilidad (X-Correlation-Id)
}

export interface DashboardMetrics {
  total_policies: number;
  total_premium: number;
  avg_insured_value: number;
  active_policies_count: number;
}

export interface ChartData {
  name: string;  // Ejemplo: "Property", "Auto" o "North America"
  value: number; // Ejemplo: monto total o conteo
}

export interface SummaryResponse {
  metrics: DashboardMetrics;
  distributionByType: ChartData[];   // Para el gráfico de distribución
  premiumByRegion: ChartData[];      // Para el gráfico de barras por región
  correlation_id: string;
}

export interface Poliza {
  id: string;
  policy_number: string;
  customer: string;

  policy_type:
  | 'Property'
  | 'Auto'
  | 'Life'
  | 'Health'
  | 'Liability'
  | 'Marine'
  | 'Cyber'
  | 'D&O';

  premium_usd: number;
  insured_value_usd: number;

  status: 'active' | 'pending' | 'expired' | 'cancelled';

  region: string;

  risk_rating: 'low' | 'medium' | 'high' | 'critical';

  start_date: string;
  end_date: string;

  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}
