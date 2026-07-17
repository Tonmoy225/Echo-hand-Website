import { useEffect, useState } from "react";
import { getSavedPostsApi } from "../api/users";
import PostCard from "../components/post/PostCard";

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedPostsApi()
      .then(({ data }) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div id="main-content">
      <h2 style={{ marginBottom: 16, fontSize: "1.1rem" }}>
        <i className="fa-regular fa-bookmark" style={{ color: "var(--accent)" }}></i> Saved
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
          <i className="fa-regular fa-bookmark"></i>
          <p>No saved posts yet. Tap the bookmark icon on any post to save it here.</p>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
