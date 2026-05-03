// src/types/responses.ts

export type Severity = 'error' | 'warning';
export type PolicyStatus = 'active' | 'pending' | 'expired' | 'cancelled'; // Centralizado
export type RiskRating = 'low' | 'medium' | 'high' | 'critical';
export type Region = 'NA' | 'APAC' | 'LATAM' | 'EMEA';

export type PolicyType =
  | 'Health'
  | 'Liability'
  | 'Life'
  | 'Auto'
  | 'D&O'
  | 'Cyber'
  | 'Marine'
  | 'Property';

// --- Interfaces ---

export interface RowError {
  row: number;
  field?: string;
  message: string;
  code: string;
  severity: Severity;
}

export interface OperationMetrics {
  operation_id: string;
  total_processed: number;
  inserted_count: number;
  rejected_count: number;
  warning_count: number;
}

export interface UploadResponse {
  message: string;
  metrics: OperationMetrics;
  errors: RowError[];
  correlation_id: string;
}

export interface Poliza {
  id: string;
  policy_number: string;
  customer: string;
  policy_type: PolicyType;
  premium_usd: number;
  insured_value_usd: number;
  status: PolicyStatus;
  region: string;
  risk_rating: RiskRating;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface AVGClaimByType {
  policy_type: PolicyType;
  avg_claims: string;
}

// --- Interfaces para /policies/summary y Recharts ---
export interface PoliciesSummaryRawResponse {
  total_policies: string;
  total_premium_usd: string;
  avg_premium_usd: string;
  count_by_status: Array<{ status: string; count: string; }>;
  metrics_by_type: Array<{ policy_type: PolicyType; count: string; premium_sum: string; }>;
  count_by_region: Array<{ region: string; count: string; }>;
  count_by_risk_rating: Array<{ risk_rating: string; count: string; }>;
  top_brokers: Array<{ broker: string; count: string; }>;
  avg_claims_by_type: AVGClaimByType[];
}

/**
 * Interfaz procesada para el estado de tu aplicación.
 * Recharts prefiere valores 'number' para los ejes y sectores.
 */
export interface PoliciesSummary {
  total_policies: number;
  total_premium_usd: number;
  avg_premium_usd: number;

  // Estas listas ya son compatibles con Recharts: 
  // <Bar data={count_by_region} dataKey="count" />
  // <Pie data={metrics_by_type} dataKey="premium_sum" nameKey="policy_type" />

  count_by_status: Array<{ status: string; count: number; }>;
  metrics_by_type: Array<{ policy_type: PolicyType; count: number; premium_sum: number; }>;
  count_by_region: Array<{ region: string; count: number; }>;
  count_by_risk_rating: Array<{ risk_rating: string; count: number; }>;
  top_brokers: Array<{ broker: string; count: number; }>;
  avg_claims_by_type: Array<{ policy_type: PolicyType; avg_claims: number; }>;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface PolicyMetrics {
  total_policies: string;
  total_premium_usd: string;
  avg_premium_usd: string;
  count_by_status: StatusMetric[];
  metrics_by_type: TypeMetric[];
  count_by_region: RegionMetric[];
  count_by_risk_rating: RiskRatingMetric[];
  top_brokers: BrokerMetric[];
  avg_claims_by_type: AvgClaimsMetric[];
}

export interface StatusMetric {
  status: 'active' | 'cancelled' | 'inactive'; // Basado en tu POLICY_CONFIG
  count: string;
}

export interface TypeMetric {
  policy_type: string;
  count: string;
  premium_sum: string;
}

export interface RegionMetric {
  region: string;
  count: string;
}

export interface RiskRatingMetric {
  risk_rating: 'low' | 'medium' | 'high' | 'critical';
  count: string;
}

export interface BrokerMetric {
  broker: string;
  count: string;
}

export interface AvgClaimsMetric {
  policy_type: string;
  avg_claims: string;
}

export interface Issue {
  id: string;
  type: string;
  value: string;
  message: string;
  severity: string;
}
