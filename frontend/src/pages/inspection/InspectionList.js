import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { showToast } from "../../services/notifications";

function InspectionList() {

    const [inspections, setInspections] = useState([]);
    const [inspectionToDelete, setInspectionToDelete] = useState(null);
    const navigate = useNavigate();
    // Get logged-in user's role
    const role = localStorage.getItem("role");

    // Load inspections
    const loadInspections = async () => {
        try {
            const response = await api.get("/inspections");
            setInspections(response.data);
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to load inspections.", "error");
        }
    };

    // Load inspections when page opens
    useEffect(() => {
        loadInspections();
    }, []);

    // Manager: Edit inspection
    const handleEdit = (id) => {
        navigate(`/edit-inspection/${id}`);
    };

    // Manager: Delete inspection
    const handleDelete = async (id) => {
        try {
            await api.delete(`/inspections/${id}`);
            showToast("Inspection deleted successfully");
            setInspectionToDelete(null);
            loadInspections();
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to delete inspection.", "error");
        }
    };

    return (
        <div className="page-shell page-list-page">
            <header className="page-title-block">
                <span className="page-eyebrow">QUALITY OPERATIONS</span>
                <h1>Inspections</h1>
                <p>Review and manage quality checks across your products.</p>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Inspector Name</th>
                        <th>Inspection Date</th>
                        <th>Status</th>
                        {role === "Manager" && (
                            <th>Action</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {inspections.map((inspection) => (
                        <tr key={inspection.id}>
                            <td>{inspection.id}</td>
                            <td>{inspection.product_name}</td>
                            <td>{inspection.inspector_name}</td>
                            <td>{inspection.inspection_date}</td>
                            <td>
                                <span className={`quality-pill quality-pill--${inspection.status?.toLowerCase()}`}>
                                    {inspection.status}
                                </span>
                            </td>
                            <td>
                                {role === "Manager" && (
                                    <>
                                        <button onClick={() => handleEdit(inspection.id)}>Edit</button>
                                        <button onClick={() => setInspectionToDelete(inspection.id)}>Delete</button>

                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {inspectionToDelete !== null && (
                <div className="confirm-popup-backdrop">
                    <section
                        className="confirm-popup"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-inspection-title"
                        aria-describedby="delete-inspection-description"
                    >
                        <span className="confirm-popup__icon" aria-hidden="true">!</span>
                        <h2 id="delete-inspection-title">Delete inspection?</h2>
                        <p id="delete-inspection-description">
                            This inspection will be permanently removed. This action cannot be undone.
                        </p>
                        <div className="confirm-popup__actions">
                            <button type="button" onClick={() => setInspectionToDelete(null)}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="confirm-popup__delete"
                                onClick={() => handleDelete(inspectionToDelete)}
                            >
                                Delete inspection
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default InspectionList;