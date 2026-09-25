import { toast } from "react-toastify";

// Base style for all toasts
const baseToastStyle = {
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "500",
  padding: "14px 18px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
  color: "#ffffff",
};

// 1. SUCCESS TOAST (Theme Space Cadet + Tan Accent)
export const ToastSuccess = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      ...baseToastStyle,
      background: "#25344f", /* var(--space-cadet) */
      border: "1px solid rgba(213, 184, 147, 0.4)", /* var(--tan) */
      color: "#ffffff",
    },
    progressStyle: {
      background: "#d5b893", /* var(--tan) progress bar */
    },
  });
};

// 2. ERROR TOAST (Theme Caput Mortuum Accent)
export const ToastError = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      ...baseToastStyle,
      background: "#381316", /* Deep dark red based on --caput-mortuum */
      border: "1px solid rgba(239, 68, 68, 0.4)",
      color: "#ffffff",
    },
    progressStyle: {
      background: "#ef4444", /* Red progress bar */
    },
  });
};

// 3. INFO TOAST (Theme Slate Gray Accent)
export const ToastInfo = (msg) => {
  toast.info(msg, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      ...baseToastStyle,
      background: "#25344f",
      border: "1px solid rgba(97, 120, 145, 0.5)", /* var(--slate-gray) */
      color: "#ffffff",
    },
    progressStyle: {
      background: "#617891",
    },
  });
};