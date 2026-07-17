import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

export default function LogoutModal({ onClose }) {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    onClose();
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 360, textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>
          <i className="fa-regular fa-hand" style={{ color: "var(--accent)" }}></i>
        </div>
        <div className="modal-title" style={{ justifyContent: "center" }}>
          Logging out?
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: 20 }}>
          You'll need to log back in to buy or sell on EcoHand.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>
            Stay
          </button>
          <button className="btn btn-danger" onClick={handleLogout} style={{ flex: 1 }}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
