import { useEffect, useState, useCallback } from "react";
import PostCard from "../components/post/PostCard";
import { getFeedApi } from "../api/posts";
import { useUIStore } from "../store/uiStore";

export default function Feed() {
  const { activeCategory, searchQuery } = useUIStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getFeedApi({
        category: activeCategory,
        search: searchQuery || undefined,
        page,
        limit: 8,
      });
      setPosts(page === 1 ? data.posts : (prev) => [...prev, ...data.posts]);
      setPages(data.pages);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, page]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleUpdate = (updated) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };
  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div id="main-content">
      {loading && posts.length === 0 && (
        <div className="empty-state">
          <i className="fa-solid fa-leaf fa-spin"></i>
          <p>Loading listings...</p>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="empty-state">
          <i className="fa-regular fa-folder-open"></i>
          <p>No listings found. Be the first to post in this category!</p>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} onUpdate={handleUpdate} onDelete={handleDelete} />
      ))}

      {page < pages && (
        <button
          className="btn btn-outline"
          style={{ marginBottom: 20 }}
          onClick={() => setPage((p) => p + 1)}
        >
          Load more listings
        </button>
      )}
    </div>
  );
}
