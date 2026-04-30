type MetricCardProps = { label: string; value: string | number; detail?: string };
export default function MetricCard({ label, value, detail }: MetricCardProps) {
  return <article className="metric-card"><span>{label}</span><strong>{value}</strong>{detail && <p>{detail}</p>}</article>;
}
