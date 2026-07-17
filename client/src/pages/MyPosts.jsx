import { useEffect, useState } from "react";
import { getMyPostsApi } from "../api/users";
import PostCard from "../components/post/PostCard";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPostsApi()
      .then(({ data }) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (updated) =>
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  const handleDelete = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  return (
    <div id="main-content">
      <h2 style={{ marginBottom: 16, fontSize: "1.1rem" }}>
        <i className="fa-solid fa-rectangle-list" style={{ color: "var(--accent)" }}></i> My
        Posts
      </h2>

      {loading && (
        <div className="empty-state">
          <i className="fa-solid fa-leaf fa-spin"></i>
          <p>Loading...</p>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="empty-state">
          <i className="fa-regular fa-folder-open"></i>
          <p>You haven't posted anything yet. Click "Post" to list your first item!</p>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} onUpdate={handleUpdate} onDelete={handleDelete} />
      ))}
    </div>
  );
}
