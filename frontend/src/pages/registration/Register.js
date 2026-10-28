import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    // Store form values
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Inspector"
    });

    // Store message
    const [message, setMessage] = useState("");

    // Update form values
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // Submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post("/auth/register", formData);
            setMessage(response.data.message);

            // Redirect after successful registration
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        }
        catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            }
            else {
                setMessage("Something went wrong");
            }
        }
    };

    return (

        <div className="register-container">
            <h2>User Registration</h2>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="registration-role">Account role</label>
                <select
                    id="registration-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="Inspector">Inspector</option>
                    <option value="Manager">Manager</option>
                </select>
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Register;