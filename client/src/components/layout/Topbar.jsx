import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { getNotificationsApi } from "../../api/users";
import { getCartApi } from "../../api/users";

export default function Topbar() {
  const { user } = useAuthStore();
  const { openModal, searchQuery, setSearchQuery } = useUIStore();
  const [unread, setUnread] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [{ data: notifData }, { data: cartData }] = await Promise.all([
          getNotificationsApi(),
          getCartApi(),
        ]);
        setUnread(notifData.unreadCount);
        setCartCount(cartData.length);
      } catch {
        /* silent */
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="topbar">
      <Link to="/" className="logo">
        <div className="logo-icon">
          <i className="fa-solid fa-leaf"></i>
        </div>
        Eco<span>Hand</span>
      </Link>

      <div className="topbar-search">
        <input
          type="text"
          placeholder="Search electronics, brands, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      <div className="topbar-actions">
        <button className="post-btn" onClick={() => openModal("createPost")}>
          <i className="fa-solid fa-plus"></i> Post
        </button>

        <button className="tb-btn" onClick={() => openModal("cart")} title="Cart">
          <i className="fa-solid fa-cart-shopping"></i>
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>

        <button className="tb-btn" onClick={() => openModal("notifications")} title="Notifications">
          <i className="fa-regular fa-bell"></i>
          {unread > 0 && <span className="badge">{unread}</span>}
        </button>

        <div className="tb-avatar" onClick={() => openModal("profile")} title="Profile">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </div>
  );
}
