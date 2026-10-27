import { useEffect, useState } from "react";
import "./ToastViewport.css";

function ToastViewport() {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        let timeoutId;
        const handleToast = (event) => {
            setToast(event.detail);
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => setToast(null), 4200);
        };

        window.addEventListener("app:toast", handleToast);
        return () => {
            window.removeEventListener("app:toast", handleToast);
            window.clearTimeout(timeoutId);
        };
    }, []);

    if (!toast) {
        return null;
    }

    return (
        <div className={`toast-popup toast-popup--${toast.type}`} role="status" aria-live="polite">
            <span className="toast-popup__icon" aria-hidden="true">
                {toast.type === "error" ? "!" : "✓"}
            </span>
            <span className="toast-popup__message">{toast.message}</span>
            <button
                type="button"
                className="toast-popup__close"
                aria-label="Dismiss notification"
                onClick={() => setToast(null)}
            >
                ×
            </button>
        </div>
    );
}

export default ToastViewport;
