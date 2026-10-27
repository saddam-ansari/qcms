import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { loginSuccess } from "../../redux/authSlice";
import "./Login.css";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");

    // Update input fields
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // Login
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post("/auth/login", formData);

            // Save token and role in Redux
            dispatch(loginSuccess({ token: response.data.token, role: response.data.role, name: response.data.name }));
            setMessage(response.data.message);

            // Redirect to Dashboard
            navigate("/dashboard");
        }
        catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            }
            else {
                setMessage("Server Error");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
            <p>
                Don't have an account?
                <Link to="/register">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default Login;