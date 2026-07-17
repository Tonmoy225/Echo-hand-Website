import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getCartApi, toggleCartApi } from "../../api/users";

export default function CartModal({ onClose }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCartApi()
      .then(({ data }) => setCart(data))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (postId) => {
    try {
      await toggleCartApi(postId);
      setCart((prev) => prev.filter((c) => c.post._id !== postId));
      toast.success("Removed from cart");
    } catch {
      toast.error("Could not remove item");
    }
  };

  const total = cart.reduce((sum, c) => sum + (c.post?.price || 0), 0);

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="modal-title">
          <i className="fa-solid fa-cart-shopping" style={{ color: "var(--accent)" }}></i> My
          Cart
        </div>

        {loading && (
          <div className="empty-state">
            <i className="fa-solid fa-leaf fa-spin"></i>
          </div>
        )}

        {!loading && cart.length === 0 && (
          <div className="empty-state">
            <i className="fa-solid fa-cart-shopping"></i>
            <p>Your cart is empty. Browse listings to add items here.</p>
          </div>
        )}

        {cart.map((c) => (
          <div className="cart-item" key={c.post._id}>
            {c.post.images?.[0] ? (
              <img src={c.post.images[0]} alt={c.post.title} />
            ) : (
              <div className="img-placeholder" style={{ width: 60, height: 60, borderRadius: 8 }}>
                <i className="fa-solid fa-image"></i>
              </div>
            )}
            <div className="cart-item-info">
              <Link to={`/post/${c.post._id}`} onClick={onClose}>
                <div className="cart-item-title">{c.post.title}</div>
              </Link>
              <div className="cart-item-price">৳{c.post.price?.toLocaleString()}</div>
            </div>
            <div className="cart-remove" onClick={() => handleRemove(c.post._id)}>
              <i className="fa-regular fa-trash-can"></i>
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.95rem",
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              <span>Total</span>
              <span style={{ color: "var(--green)" }}>৳{total.toLocaleString()}</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 10 }}>
              EcoHand connects buyers and sellers directly. Contact each seller via their profile
              to arrange payment and pickup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
