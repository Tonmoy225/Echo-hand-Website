import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeedApi } from "../../api/posts";

export default function RightPanel() {
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    getFeedApi({ limit: 4 })
      .then(({ data }) => setSuggested(data.posts))
      .catch(() => {});
  }, []);

  return (
    <div id="right-panel">
      <div className="right-card">
        <div className="right-card-title">
          <i className="fa-solid fa-fire" style={{ color: "var(--gold)" }}></i>
          Trending Now
        </div>
        {suggested.length === 0 && (
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No listings yet</div>
        )}
        {suggested.map((p) => (
          <Link to={`/post/${p._id}`} key={p._id} className="suggested-item">
            {p.images?.[0] ? (
              <img src={p.images[0]} alt={p.title} />
            ) : (
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: "var(--purple-700)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--purple-300)",
                }}
              >
                <i className="fa-solid fa-image"></i>
              </div>
            )}
            <div>
              <div className="suggested-name">{p.title}</div>
              <div className="suggested-price">৳{p.price?.toLocaleString()}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="right-card">
        <div className="right-card-title">
          <i className="fa-solid fa-recycle" style={{ color: "var(--green)" }}></i>
          Eco Tip
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Every second-hand electronic device you buy or sell on EcoHand keeps e-waste
          out of landfills. Thank you for being part of the circular economy! 🌱
        </p>
      </div>
    </div>
  );
}
