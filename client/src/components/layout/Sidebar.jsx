import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export default function Sidebar() {
  const { user } = useAuthStore();
  const { openModal } = useUIStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div id="sidebar">
      <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
        <i className="fa-solid fa-house"></i>
        <span>News Feed</span>
      </Link>
      <Link to="/my-posts" className={`nav-item ${isActive("/my-posts") ? "active" : ""}`}>
        <i className="fa-solid fa-rectangle-list"></i>
        <span>My Posts</span>
      </Link>
      <Link to="/saved" className={`nav-item ${isActive("/saved") ? "active" : ""}`}>
        <i className="fa-regular fa-bookmark"></i>
        <span>Saved Posts</span>
      </Link>
      <div className="nav-item" onClick={() => openModal("cart")}>
        <i className="fa-solid fa-cart-shopping"></i>
        <span>My Cart</span>
      </div>
      <div className="nav-item" onClick={() => openModal("notifications")}>
        <i className="fa-regular fa-bell"></i>
        <span>Notifications</span>
      </div>
      <Link to={`/profile/${user?._id}`} className="nav-item">
        <i className="fa-regular fa-user"></i>
        <span>My Profile</span>
      </Link>

      <div className="nav-divider"></div>
      <div className="nav-section-title">Eco Impact</div>
      <div className="eco-stat-card">
        <div className="eco-stat-title">
          <i className="fa-solid fa-seedling" style={{ color: "var(--green)" }}></i> Eco Score
        </div>
        <div className="eco-stat-num">{user?.ecoScore ?? 0}</div>
        <div className="eco-stat-sub">Points earned by reducing e-waste</div>
      </div>

      <div className="nav-divider"></div>
      <div className="nav-section-title">Support</div>
      <div className="nav-item" onClick={() => openModal("terms")}>
        <i className="fa-solid fa-file-contract"></i>
        <span>Terms of Policy</span>
      </div>
      <div className="nav-item" onClick={() => openModal("feedback")}>
        <i className="fa-regular fa-comment-dots"></i>
        <span>Feedback</span>
      </div>
      <div className="nav-item" onClick={() => openModal("report")}>
        <i className="fa-solid fa-flag"></i>
        <span>Report a Problem</span>
      </div>
      <div className="nav-item" onClick={() => openModal("logout")} style={{ color: "var(--red)" }}>
        <i className="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
      </div>
    </div>
  );
}
