import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfileApi } from "../api/users";
import PostCard from "../components/post/PostCard";

export default function Profile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getUserProfileApi(id).then(({ data }) => setData(data));
  }, [id]);

  if (!data) {
    return (
      <div id="main-content">
        <div className="empty-state">
          <i className="fa-solid fa-leaf fa-spin"></i>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const { user, posts } = data;

  return (
    <div id="main-content">
      <div className="post-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            className="post-avatar"
            style={{ width: 64, height: 64, fontSize: "1.6rem" }}
          >
            {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {user.location || "Location not set"}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--green)", marginTop: 4 }}>
              <i className="fa-solid fa-seedling"></i> Eco Score: {user.ecoScore}
            </div>
          </div>
        </div>
        {user.bio && (
          <p style={{ marginTop: 14, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {user.bio}
          </p>
        )}
      </div>

      <h3 style={{ marginBottom: 12, fontSize: "1rem" }}>Listings by {user.name}</h3>
      {posts.length === 0 && (
        <div className="empty-state">
          <i className="fa-regular fa-folder-open"></i>
          <p>No listings yet.</p>
        </div>
      )}
      {posts.map((post) => (
        <PostCard key={post._id} post={{ ...post, owner: user }} />
      ))}
    </div>
  );
}
