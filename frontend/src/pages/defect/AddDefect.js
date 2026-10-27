import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { showToast } from "../../services/notifications";

function AddDefect() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        product_name: "",
        description: "",
        severity: "Low",
        status: "Pending"
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            await api.post("/defects", formData);
            showToast("Defect created successfully");
            navigate("/defects");
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to save defect.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page-shell page-form-page">
            <header className="page-title-block">
                <span className="page-eyebrow">QUALITY OPERATIONS</span>
                <h1>Report a Defect</h1>
                <p>Capture the issue, severity, and current resolution status.</p>
            </header>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="product_name"
                    placeholder="Product Name"
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Defect Description"
                    onChange={handleChange}
                    required
                />
                <select
                    name="severity"
                    onChange={handleChange}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
                <button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save defect"}
                </button>
            </form>
        </div>
    );
}

export default AddDefect;