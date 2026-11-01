export default function LoadingState({ label = "Loading", variant = "inline" }) {
  if (variant === "grid") {
    return (
      <div className="loading-grid" role="status" aria-label={label}>
        {Array.from({ length: 6 }, (_, index) => (
          <div className="loading-product" key={index} aria-hidden="true">
            <span className="loading-shimmer loading-image"></span>
            <span className="loading-shimmer loading-title"></span>
            <span className="loading-shimmer loading-price"></span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="loading-state" role="status">
      <span className="loading-spinner" aria-hidden="true"></span>
      <span>{label}</span>
    </div>
  );
}
