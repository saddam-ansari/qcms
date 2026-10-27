import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import "./Navbar.css";

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const role = useSelector((state) => state.auth.role);
    const name = useSelector((state) => state.auth.name) || localStorage.getItem("name");
    const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");

    // Hide navbar if user is not logged in
    if (!token) {
        return null;
    }

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false);
        navigate("/login");
    };

    return (
        <nav className="nav-container">
            <div className="navbar-inner">
                <Link className="navbar-brand" to="/dashboard" aria-label="QCMS dashboard">
                    <span className="navbar-brand__mark" aria-hidden="true">
                        <svg viewBox="0 0 32 32" fill="none">
                            <path d="M16 3 27 7v8c0 7.2-4.7 12.6-11 15-6.3-2.4-11-7.8-11-15V7l11-4Z" />
                            <path d="m10.5 15.5 3.7 3.7 7.6-8" />
                        </svg>
                    </span>
                    <span>QCMS<span className="navbar-brand__period">.</span></span>
                </Link>

                <button
                    className="navbar-menu-toggle"
                    type="button"
                    aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div className={`navbar-content${isMobileMenuOpen ? " navbar-content--open" : ""}`}>
                    <div className="navbar-links">
                        <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Overview</NavLink>
                        {(role === "Manager" || role === "Inspector") && (
                            <NavLink to="/inspections" onClick={() => setIsMobileMenuOpen(false)}>Inspections</NavLink>
                        )}
                        {role === "Manager" && (
                            <NavLink to="/add-inspection" onClick={() => setIsMobileMenuOpen(false)}>New inspection</NavLink>
                        )}
                        {(role === "Manager" || role === "Inspector") && (
                            <NavLink to="/defects" onClick={() => setIsMobileMenuOpen(false)}>Defects</NavLink>
                        )}
                        {(role === "Manager" || role === "Inspector") && (
                            <NavLink to="/add-defect" onClick={() => setIsMobileMenuOpen(false)}>New defect</NavLink>
                        )}
                        {role === "Manager" && (
                            <NavLink to="/report" onClick={() => setIsMobileMenuOpen(false)}>Reports</NavLink>
                        )}
                    </div>

                    <div className="navbar-profile">
                        <button
                            className="navbar-profile-trigger"
                            type="button"
                            aria-expanded={isProfileOpen}
                            aria-haspopup="menu"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <span className="navbar-avatar" aria-hidden="true">
                                {(name || role || "U").slice(0, 1).toUpperCase()}
                            </span>
                            <span className="navbar-profile-copy">
                                <span className="navbar-profile-name">{name || "User"}</span>
                                <span className="navbar-profile-role">{role || "Member"}</span>
                            </span>
                            <span className={`navbar-chevron${isProfileOpen ? " navbar-chevron--open" : ""}`} aria-hidden="true">
                                <svg viewBox="0 0 16 16" fill="none">
                                    <path d="m4 6 4 4 4-4" />
                                </svg>
                            </span>
                        </button>
                        {isProfileOpen && (
                            <div className="navbar-profile-menu" role="menu">
                                <div className="navbar-profile-menu__heading">
                                    <span className="navbar-avatar navbar-avatar--large" aria-hidden="true">
                                        {(name || role || "U").slice(0, 1).toUpperCase()}
                                    </span>
                                    <span>
                                        <strong>{name || "User"}</strong>
                                        <small>{role || "Member"} account</small>
                                    </span>
                                </div>
                                <div className="navbar-profile-menu__divider" />
                                <button className="navbar-logout" type="button" role="menuitem" onClick={handleLogout}>
                                    <span aria-hidden="true">↪</span>
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;