const LoadingOverlay = ({ message }) => (
    <div className="loading-overlay" aria-live="polite" role="status">
        <div aria-hidden="true" className="loading-spinner" />
        <div className="loading-text">{message}</div>
    </div>
)

export default LoadingOverlay
