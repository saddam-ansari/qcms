import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../services/notifications";

function AddInspection() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        product_name: "",
        inspector_name: "",
        inspection_date: "",
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
            await api.post("/inspections", formData);
            showToast("Inspection created successfully");
            navigate("/inspections");
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to save inspection.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="page-shell page-form-page">
            <header className="page-title-block">
                <span className="page-eyebrow">QUALITY OPERATIONS</span>
                <h1>Add Inspection</h1>
                <p>Record a product inspection and keep your quality history up to date.</p>
            </header>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="product_name"
                    placeholder="Product Name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="inspector_name"
                    placeholder="Inspector Name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="inspection_date"
                    onChange={handleChange}
                    required
                />
                <select
                    name="status"
                    onChange={handleChange}
                >
                    <option>Pending</option>
                    <option>Completed</option>
                </select>
                <button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save inspection"}
                </button>
            </form>
        </div>
    );
}

export default AddInspection;