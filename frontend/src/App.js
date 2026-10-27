import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Login from "./pages/login/Login";
import Register from "./pages/registration/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import InspectionList from "./pages/inspection/InspectionList"
import AddInspection from "./pages/inspection/AddInspection"
import EditInspection from "./pages/inspection/EditInspection";
import UpdateInspection from "./pages/inspection/UpdateInspection";
import EditDefect from "./pages/defect/EditDefect";
import DefectList from "./pages/defect/DefectList"
import AddDefect from "./pages/defect/AddDefect"
import Report from "./pages/report/Report";
import Navbar from "./components/navbar/Navbar"
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { logout } from "./redux/authSlice";
import ToastViewport from "./components/ToastViewport";

function PageBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pathname.startsWith("/login") ? "login"
      : pathname.startsWith("/register") ? "register"
        : pathname.startsWith("/dashboard") ? "dashboard"
          : pathname.startsWith("/inspection") || pathname.includes("inspection") ? "inspections"
            : pathname.startsWith("/defect") || pathname.includes("defect") ? "defects"
              : pathname.startsWith("/report") ? "reports"
                : "default";

    document.body.dataset.page = page;
    return () => {
      delete document.body.dataset.page;
    };
  }, [pathname]);

  return null;
}

function SessionExpiryHandler() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(logout());
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:expired", handleSessionExpired);
    return () => window.removeEventListener("auth:expired", handleSessionExpired);
  }, [dispatch, navigate]);

  return null;
}


function App() {
  return (
    <BrowserRouter>
      <PageBackground />
      <SessionExpiryHandler />
      <ToastViewport />
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/inspections" element={<ProtectedRoute><InspectionList /></ProtectedRoute>} />
        <Route path="/add-inspection" element={<ProtectedRoute><AddInspection /></ProtectedRoute>} />
        <Route path="/edit-inspection/:id" element={<ProtectedRoute><EditInspection /></ProtectedRoute>} />
        <Route path="/update-inspection/:id" element={<UpdateInspection />} />
        <Route path="/defects" element={<ProtectedRoute><DefectList /></ProtectedRoute>} />
        <Route path="/add-defect" element={<ProtectedRoute><AddDefect /></ProtectedRoute>} />
        <Route path="/edit-defect/:id" element={<ProtectedRoute><EditDefect /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;