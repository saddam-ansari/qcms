import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../services/api";
import { showToast } from "../../services/notifications";
import "./Report.css";

function Report() {
    const navigate = useNavigate();
    const role = useSelector((state) => state.auth.role);

    const [inspections, setInspections] = useState([]);
    const [defects, setDefects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("inspections");

    // Redirect if not Manager
    useEffect(() => {
        if (role !== "Manager") {
            navigate("/dashboard");
        }
    }, [role, navigate]);

    // Load inspections and defects
    useEffect(() => {
        const loadReportData = async () => {
            try {
                setLoading(true);
                const [inspectionsRes, defectsRes] = await Promise.all([
                    api.get("/inspections"),
                    api.get("/defects"),
                ]);
                setInspections(inspectionsRes.data);
                setDefects(defectsRes.data);
            } catch (error) {
                showToast(error.response?.data?.message || "Failed to load report data.", "error");
            } finally {
                setLoading(false);
            }
        };

        loadReportData();
    }, []);

    // Export to CSV
    const exportToCSV = (data, filename) => {
        if (data.length === 0) {
            showToast("There is no data to export.", "error");
            return;
        }

        const csv = [
            Object.keys(data[0]).join(","),
            ...data.map((row) =>
                Object.values(row).map((val) => `"${val}"`).join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    // Print report
    const printReport = () => {
        window.print();
    };

    if (loading) {
        return <div className="report-container"><p>Loading report data...</p></div>;
    }

    return (
        <div className="report-container">
            <div className="report-header">
                <h2>Quality Control Report</h2>
                <div className="report-actions">
                    <button
                        className="export-btn"
                        onClick={() =>
                            exportToCSV(
                                activeTab === "inspections" ? inspections : defects,
                                `${activeTab}-report.csv`
                            )
                        }
                    >
                        📥 Export CSV
                    </button>
                    <button className="print-btn" onClick={printReport}>
                        🖨️ Print
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-container">
                <button
                    className={`tab-btn ${activeTab === "inspections" ? "active" : ""}`}
                    onClick={() => setActiveTab("inspections")}
                >
                    Inspections ({inspections.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === "defects" ? "active" : ""}`}
                    onClick={() => setActiveTab("defects")}
                >
                    Defects ({defects.length})
                </button>
            </div>

            {/* Inspections Report */}
            {activeTab === "inspections" && (
                <div className="report-section">
                    <h3>Inspections Report</h3>
                    {inspections.length > 0 ? (
                        <div className="table-wrapper">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Area</th>
                                        <th>Category</th>
                                        <th>Inspector</th>
                                        <th>Status</th>
                                        <th>Issues Found</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inspections.map((inspection) => (
                                        <tr key={inspection._id}>
                                            <td>{inspection._id?.substring(0, 8) || "N/A"}</td>
                                            <td>
                                                {new Date(inspection.date).toLocaleDateString()}
                                            </td>
                                            <td>{inspection.area || "N/A"}</td>
                                            <td>{inspection.category || "N/A"}</td>
                                            <td>{inspection.inspector || "N/A"}</td>
                                            <td>
                                                <span
                                                    className={`status-badge ${
                                                        inspection.status === "Completed"
                                                            ? "completed"
                                                            : "pending"
                                                    }`}
                                                >
                                                    {inspection.status}
                                                </span>
                                            </td>
                                            <td>{inspection.issuesFound ? "Yes" : "No"}</td>
                                            <td>{inspection.notes || "No notes"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-data">No inspections found</p>
                    )}
                </div>
            )}

            {/* Defects Report */}
            {activeTab === "defects" && (
                <div className="report-section">
                    <h3>Defects Report</h3>
                    {defects.length > 0 ? (
                        <div className="table-wrapper">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date Reported</th>
                                        <th>Area</th>
                                        <th>Defect Type</th>
                                        <th>Severity</th>
                                        <th>Status</th>
                                        <th>Assigned To</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {defects.map((defect) => (
                                        <tr key={defect._id}>
                                            <td>{defect._id?.substring(0, 8) || "N/A"}</td>
                                            <td>
                                                {new Date(defect.dateReported).toLocaleDateString()}
                                            </td>
                                            <td>{defect.area || "N/A"}</td>
                                            <td>{defect.defectType || "N/A"}</td>
                                            <td>
                                                <span
                                                    className={`severity-badge ${defect.severity?.toLowerCase() || "unknown"}`}
                                                >
                                                    {defect.severity}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`status-badge ${
                                                        defect.status === "Resolved"
                                                            ? "completed"
                                                            : "pending"
                                                    }`}
                                                >
                                                    {defect.status}
                                                </span>
                                            </td>
                                            <td>{defect.assignedTo || "Unassigned"}</td>
                                            <td>{defect.description || "No description"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-data">No defects found</p>
                    )}
                </div>
            )}

            {/* Summary Section */}
            <div className="summary-section">
                <h3>Summary</h3>
                <div className="summary-cards">
                    <div className="summary-card">
                        <h4>Total Inspections</h4>
                        <p className="summary-value">{inspections.length}</p>
                    </div>
                    <div className="summary-card">
                        <h4>Completed Inspections</h4>
                        <p className="summary-value">
                            {inspections.filter((i) => i.status === "Completed").length}
                        </p>
                    </div>
                    <div className="summary-card">
                        <h4>Total Defects</h4>
                        <p className="summary-value">{defects.length}</p>
                    </div>
                    <div className="summary-card">
                        <h4>Resolved Defects</h4>
                        <p className="summary-value">
                            {defects.filter((d) => d.status === "Resolved").length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report;
