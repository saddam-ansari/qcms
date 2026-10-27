import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { showToast } from "../../services/notifications";

function EditInspection() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        product_name: "",
        inspector_name: "",
        inspection_date: "",
        status: "Pending"
    });

    const loadInspection = useCallback(async () => {
        try {
            const response = await api.get("/inspections");
            const inspection = response.data.find((item) => item.id === Number(id));

            if (inspection) {
                setFormData({
                    product_name: inspection.product_name,
                    inspector_name: inspection.inspector_name,
                    inspection_date: inspection.inspection_date.split("T")[0],
                    status: inspection.status
                });
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to load inspection.", "error");
        }
    }, [id]);

    useEffect(() => {
        loadInspection();
    }, [loadInspection]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await api.put(`/inspections/${id}`, formData);
            showToast("Inspection updated successfully");
            navigate("/inspections");
        } catch (error) {
            showToast(error.response?.data?.message || "Unable to update inspection.", "error");
        }
    };

    return (
        <div className="page-shell page-form-page">
            <header className="page-title-block">
                <span className="page-eyebrow">QUALITY OPERATIONS</span>
                <h1>Edit Inspection</h1>
                <p>Update inspection details and status.</p>
            </header>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="inspector_name"
                    value={formData.inspector_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="inspection_date"
                    value={formData.inspection_date}
                    onChange={handleChange}
                    required
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
                <button type="submit">Update Inspection</button>
            </form>
        </div>
    );
}

export default EditInspection;