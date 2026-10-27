import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { showToast } from "../../services/notifications";

function EditDefect() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        product_name: "",
        description: "",
        severity: "Low",
        status: "Pending"
    });

    const loadDefect = useCallback(async () => {
        try {
            const response = await api.get("/defects");
            const defect = response.data.find((item) => item.id === Number(id));
            if (defect) {
                setFormData({
                    product_name: defect.product_name,
                    description: defect.description,
                    severity: defect.severity,
                    status: defect.status
                });
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to load defect.", "error");
        }
    }, [id]);

    useEffect(() => {
        loadDefect();
    }, [loadDefect]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await api.put(`/defects/${id}`, formData);
            showToast("Defect updated successfully");
            navigate("/defects");
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to update defect.", "error");
        }
    };

    return (
        <div className="page-shell page-form-page">
            <header className="page-title-block">
                <span className="page-eyebrow">QUALITY OPERATIONS</span>
                <h1>Edit Defect</h1>
                <p>Update the defect details and resolution status.</p>
            </header>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <select
                    name="severity"
                    value={formData.severity}
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
                <button type="submit">Update Defect</button>
            </form>
        </div>
    );
}

export default EditDefect;