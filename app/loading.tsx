export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-label="Cargando página">
      <span className="route-loading-mark font-display">A/</span>
      <span className="route-loading-line" aria-hidden="true" />
      <span className="font-mono">LOADING PORTFOLIO</span>
    </div>
  );
}
