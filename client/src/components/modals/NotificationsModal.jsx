import { useEffect, useState } from "react";
import { getNotificationsApi, markAllNotifReadApi, markNotifReadApi } from "../../api/users";
import TimeAgo from "../common/TimeAgo";

const ICONS = {
  like: { icon: "fa-solid fa-heart", color: "var(--red)" },
  comment: { icon: "fa-solid fa-comment", color: "var(--accent)" },
  share: { icon: "fa-solid fa-share-from-square", color: "var(--gold)" },
  sold: { icon: "fa-solid fa-tag", color: "var(--green)" },
  message: { icon: "fa-solid fa-envelope", color: "var(--accent)" },
  follow: { icon: "fa-solid fa-user-plus", color: "var(--purple-300)" },
};

export default function NotificationsModal({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotificationsApi()
      .then(({ data }) => setNotifications(data.notifications))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAll = async () => {
    await markAllNotifReadApi();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = async (n) => {
    if (!n.read) {
      await markNotifReadApi(n._id);
      setNotifications((prev) => prev.map((p) => (p._id === n._id ? { ...p, read: true } : p)));
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="modal-title" style={{ justifyContent: "space-between" }}>
          <span>
            <i className="fa-regular fa-bell" style={{ color: "var(--accent)" }}></i> Notifications
          </span>
          <span
            style={{ fontSize: "0.75rem", color: "var(--accent)", cursor: "pointer", fontWeight: 500 }}
            onClick={handleMarkAll}
          >
            Mark all read
          </span>
        </div>

        {loading && (
          <div className="empty-state">
            <i className="fa-solid fa-leaf fa-spin"></i>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="empty-state">
            <i className="fa-regular fa-bell-slash"></i>
            <p>No notifications yet</p>
          </div>
        )}

        {notifications.map((n) => {
          const cfg = ICONS[n.type] || ICONS.like;
          return (
            <div
              key={n._id}
              className={`notif-item ${!n.read ? "unread" : ""}`}
              onClick={() => handleClick(n)}
            >
              <div className="notif-avatar">
                {n.sender?.avatar ? (
                  <img src={n.sender.avatar} alt="" />
                ) : (
                  n.sender?.name?.charAt(0)
                )}
              </div>
              <div>
                <div className="notif-text">
                  <i className={cfg.icon} style={{ color: cfg.color, marginRight: 6 }}></i>
                  {n.text}
                </div>
                <div className="notif-time">
                  <TimeAgo date={n.createdAt} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
