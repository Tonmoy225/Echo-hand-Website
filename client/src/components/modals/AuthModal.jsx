import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

export default function AuthModal() {
  const { authModalView, setAuthView, closeAuthModal, login, register } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const isLogin = authModalView === "login";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success("Logged in successfully!");
      } else {
        if (!form.name.trim()) {
          toast.error("Please enter your name");
          setLoading(false);
          return;
        }
        await register(form.name, form.email, form.password);
        toast.success("Account created! Welcome to EcoHand 🌱");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && closeAuthModal()}>
      <div className="modal">
        <div className="modal-close" onClick={closeAuthModal}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="modal-title">
          <i className="fa-solid fa-leaf" style={{ color: "var(--accent)" }}></i> EcoHand
        </div>

        <div className="auth-tabs">
          <div className={`auth-tab ${isLogin ? "active" : ""}`} onClick={() => setAuthView("login")}>
            Login
          </div>
          <div className={`auth-tab ${!isLogin ? "active" : ""}`} onClick={() => setAuthView("signup")}>
            Sign Up
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <button className="btn btn-accent" type="submit" disabled={loading}>
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <>
                <i className={isLogin ? "fa-solid fa-right-to-bracket" : "fa-solid fa-user-plus"}></i>{" "}
                {isLogin ? "Login" : "Create Account"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
