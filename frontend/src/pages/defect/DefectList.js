import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { showToast } from "../../services/notifications";

function DefectList() {
    const [defects, setDefects] = useState([]);
    const [defectToDelete, setDefectToDelete] = useState(null);
    const role = localStorage.getItem("role");

    const loadDefects = async () => {
        try {
            const response = await api.get("/defects");
            setDefects(response.data);
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to load defects.", "error");
        }
    };

    useEffect(() => {
        loadDefects();
    }, []);

    const deleteDefect = async (id) => {
        try {
            await api.delete(`/defects/${id}`);
            showToast("Defect deleted successfully");
            setDefectToDelete(null);
            loadDefects();
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to delete defect.", "error");
        }
    };

    return (
        <div className="page-shell page-list-page">
            <header className="page-title-block">
                <span className="page-eyebrow">QUALITY OPERATIONS</span>
                <h1>Defects</h1>
                <p>Track product issues and keep an eye on resolution progress.</p>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Description</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        defects.map((defect) => (
                            <tr key={defect.id}>
                                <td>{defect.id}</td>
                                <td>{defect.product_name}</td>
                                <td>{defect.description}</td>
                                <td>
                                    <span className={`quality-pill quality-pill--${defect.severity?.toLowerCase()}`}>
                                        {defect.severity}
                                    </span>
                                </td>
                                <td>
                                    <span className={`quality-pill quality-pill--${defect.status?.toLowerCase()}`}>
                                        {defect.status}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/edit-defect/${defect.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    {role === "Manager" && (
                                        <button onClick={() => setDefectToDelete(defect.id)}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {defectToDelete !== null && (
                <div className="confirm-popup-backdrop">
                    <section
                        className="confirm-popup"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-defect-title"
                        aria-describedby="delete-defect-description"
                    >
                        <span className="confirm-popup__icon" aria-hidden="true">!</span>
                        <h2 id="delete-defect-title">Delete defect?</h2>
                        <p id="delete-defect-description">
                            This defect will be permanently removed. This action cannot be undone.
                        </p>
                        <div className="confirm-popup__actions">
                            <button type="button" onClick={() => setDefectToDelete(null)}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="confirm-popup__delete"
                                onClick={() => deleteDefect(defectToDelete)}
                            >
                                Delete defect
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default DefectList;