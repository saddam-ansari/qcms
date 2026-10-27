import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const EMPTY_DASHBOARD_DATA = {
    totalInspection: 0,
    completedInspection: 0,
    pendingInspection: 0,
    totalDefects: 0,
    completedDefects: 0,
    pendingDefects: 0,
    lowSeverity: 0,
    mediumSeverity: 0,
    highSeverity: 0
};

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isErrorDismissed, setIsErrorDismissed] = useState(false);

    const loadDashboard = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");
        setIsErrorDismissed(false);
        try {
            const response = await api.get("/dashboard");
            setDashboardData({ ...EMPTY_DASHBOARD_DATA, ...response.data });
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "Unable to load dashboard data. Check your connection and try again."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const inspectionMetrics = [
        { label: "Total Inspections", value: dashboardData?.totalInspection ?? 0, tone: "blue" },
        { label: "Completed", value: dashboardData?.completedInspection ?? 0, tone: "green" },
        { label: "Pending", value: dashboardData?.pendingInspection ?? 0, tone: "amber" }
    ];
    const defectMetrics = [
        { label: "Total Defects", value: dashboardData?.totalDefects ?? 0, tone: "blue" },
        { label: "Completed", value: dashboardData?.completedDefects ?? 0, tone: "green" },
        { label: "Pending", value: dashboardData?.pendingDefects ?? 0, tone: "amber" }
    ];
    const severityMetrics = [
        { label: "Low Severity", value: dashboardData?.lowSeverity ?? 0, tone: "green" },
        { label: "Medium Severity", value: dashboardData?.mediumSeverity ?? 0, tone: "amber" },
        { label: "High Severity", value: dashboardData?.highSeverity ?? 0, tone: "red" }
    ];

    const renderMetrics = (metrics) => (
        <div className="card-container">
            {metrics.map((metric, index) => (
                <article
                    className={`metric-card metric-card--${metric.tone}`}
                    key={metric.label}
                    style={{ "--card-index": index }}
                >
                    <span className="metric-card__label">{metric.label}</span>
                    <span className="metric-card__value">{metric.value}</span>
                </article>
            ))}
        </div>
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-hero">
                <div className="dashboard-hero__copy">
                    <span className="dashboard-eyebrow">QUALITY OVERVIEW</span>
                    <h1>Quality Control Dashboard</h1>
                    <p>A clear snapshot of inspections, defects, and quality risks.</p>
                </div>
                <div className="dashboard-hero__mark" aria-hidden="true">
                    <svg viewBox="0 0 64 64" fill="none">
                        <path d="M32 6 52 14v15c0 13-8.5 23-20 29C20.5 52 12 42 12 29V14L32 6Z" />
                        <path d="m22 31 7 7 14-15" />
                    </svg>
                </div>
            </header>

            {errorMessage && isErrorDismissed && (
                <div className="dashboard-error-banner" role="alert">
                    <span>{errorMessage}</span>
                    <button type="button" onClick={loadDashboard}>Retry</button>
                </div>
            )}

            <main className="dashboard-content" aria-busy={isLoading}>
                {!isLoading && !errorMessage && dashboardData && (
                    <>
                        <section className="dashboard-section" aria-labelledby="inspection-summary-title">
                            <div className="dashboard-section__heading">
                                <div>
                                    <span className="section-kicker">OPERATIONS</span>
                                    <h2 id="inspection-summary-title">Inspection Summary</h2>
                                </div>
                                <span className="section-index">01</span>
                            </div>
                            {renderMetrics(inspectionMetrics)}
                        </section>

                        <section className="dashboard-section" aria-labelledby="defect-summary-title">
                            <div className="dashboard-section__heading">
                                <div>
                                    <span className="section-kicker">FOLLOW-UP</span>
                                    <h2 id="defect-summary-title">Defect Summary</h2>
                                </div>
                                <span className="section-index">02</span>
                            </div>
                            {renderMetrics(defectMetrics)}
                        </section>

                        <section className="dashboard-section" aria-labelledby="severity-summary-title">
                            <div className="dashboard-section__heading">
                                <div>
                                    <span className="section-kicker">RISK MONITORING</span>
                                    <h2 id="severity-summary-title">Defects by Severity</h2>
                                </div>
                                <span className="section-index">03</span>
                            </div>
                            {renderMetrics(severityMetrics)}
                        </section>
                    </>
                )}

                <section className="dashboard-actions" aria-label="Quick actions">
                    <div>
                        <span className="section-kicker">QUICK ACTIONS</span>
                        <h2>Keep quality moving</h2>
                        <p>Jump directly into your quality workflows.</p>
                    </div>
                    <div className="dashboard-buttons">
                        <Link className="dashboard-action-link" to="/inspections">
                            <span className="action-icon" aria-hidden="true">↗</span>
                            <span>Manage Inspections</span>
                        </Link>
                        <Link className="dashboard-action-link dashboard-action-link--dark" to="/defects">
                            <span className="action-icon" aria-hidden="true">↗</span>
                            <span>Manage Defects</span>
                        </Link>
                    </div>
                </section>
            </main>

            {isLoading && (
                <div className="dashboard-modal-backdrop">
                    <div
                        className="dashboard-modal dashboard-modal--loading"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dashboard-loading-title"
                        aria-describedby="dashboard-loading-description"
                    >
                        <span className="dashboard-loader" aria-hidden="true" />
                        <h2 id="dashboard-loading-title">Preparing your dashboard</h2>
                        <p id="dashboard-loading-description" role="status">
                            Gathering the latest quality metrics...
                        </p>
                    </div>
                </div>
            )}

            {!isLoading && errorMessage && !isErrorDismissed && (
                <div className="dashboard-modal-backdrop">
                    <div
                        className="dashboard-modal dashboard-modal--error"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="dashboard-error-title"
                        aria-describedby="dashboard-error-description"
                    >
                        <span className="dashboard-modal__icon" aria-hidden="true">!</span>
                        <h2 id="dashboard-error-title">Dashboard unavailable</h2>
                        <p id="dashboard-error-description">{errorMessage}</p>
                        <div className="dashboard-modal__actions">
                            <button type="button" className="dashboard-retry-button" onClick={loadDashboard}>
                                Retry
                            </button>
                            <button
                                type="button"
                                className="dashboard-dismiss-button"
                                onClick={() => setIsErrorDismissed(true)}
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;