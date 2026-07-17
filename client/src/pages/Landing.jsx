import { useAuthStore } from "../store/authStore";
import ModalRoot from "../components/modals/ModalRoot";

export default function Landing() {
  const { openAuthModal } = useAuthStore();

  return (
    <div className="landing-hero">
      <div>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "linear-gradient(135deg,var(--accent),var(--purple-300))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            color: "#fff",
            margin: "0 auto 24px",
          }}
        >
          <i className="fa-solid fa-leaf"></i>
        </div>
        <h1>
          Welcome to Eco<span>Hand</span>
        </h1>
        <p>
          Buy and sell second-hand electronics. Reduce e-waste, save money, and give
          devices a second life — one trade at a time.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-accent" style={{ width: "auto", padding: "12px 28px" }} onClick={() => openAuthModal("login")}>
            <i className="fa-solid fa-right-to-bracket"></i> Login
          </button>
          <button className="btn btn-outline" style={{ width: "auto", padding: "12px 28px" }} onClick={() => openAuthModal("signup")}>
            <i className="fa-solid fa-user-plus"></i> Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
