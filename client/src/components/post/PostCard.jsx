import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import TimeAgo from "../common/TimeAgo";
import {
  toggleLikeApi,
  toggleSaveApi,
  sharePostApi,
  getCommentsApi,
  addCommentApi,
  deletePostApi,
  updatePostStatusApi,
} from "../../api/posts";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export default function PostCard({ post, onUpdate, onDelete }) {
  const { user } = useAuthStore();
  const { openModal } = useUIStore();

  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner = user?._id === post.owner?._id;

  const handleLike = async () => {
    try {
      const { data } = await toggleLikeApi(post._id);
      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch {
      toast.error("Please login to like posts");
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await toggleSaveApi(post._id);
      setSaved(data.saved);
      if (data.saved) toast.success("Post saved!");
    } catch {
      toast.error("Please login to save posts");
    }
  };

  const handleShare = async () => {
    try {
      await sharePostApi(post._id);
      if (navigator.share) {
        navigator.share({ title: post.title, url: `${window.location.origin}/post/${post._id}` });
      } else {
        navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Could not share post");
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      const { data } = await getCommentsApi(post._id);
      setComments(data);
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const { data } = await addCommentApi(post._id, commentText);
      setComments([data, ...comments]);
      setCommentText("");
    } catch {
      toast.error("Please login to comment");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      await deletePostApi(post._id);
      toast.success("Post deleted");
      onDelete?.(post._id);
    } catch {
      toast.error("Could not delete post");
    }
  };

  const handleMarkSold = async () => {
    try {
      const { data } = await updatePostStatusApi(post._id, "sold");
      toast.success("Marked as sold");
      onUpdate?.(data);
    } catch {
      toast.error("Could not update status");
    }
  };

  const imgCount = post.images?.length || 0;
  const imgClass = imgCount === 1 ? "one" : imgCount === 2 ? "two" : "many";

  return (
    <div className="post-card">
      <div className="post-head">
        <Link to={`/profile/${post.owner?._id}`} className="post-avatar">
          {post.owner?.avatar ? (
            <img src={post.owner.avatar} alt={post.owner.name} />
          ) : (
            post.owner?.name?.charAt(0).toUpperCase()
          )}
        </Link>
        <div className="post-meta">
          <Link to={`/profile/${post.owner?._id}`} className="post-author">
            {post.owner?.name}
          </Link>
          <div className="post-time">
            <TimeAgo date={post.createdAt} /> · <i className="fa-solid fa-location-dot"></i>{" "}
            {post.location}
          </div>
        </div>
        <div className="post-menu">
          <div className="post-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fa-solid fa-ellipsis"></i>
          </div>
          <div className={`post-dropdown ${menuOpen ? "open" : ""}`}>
            {isOwner ? (
              <>
                <div className="post-dropdown-item" onClick={() => openModal("editPost", { post })}>
                  <i className="fa-regular fa-pen-to-square"></i> Edit Post
                </div>
                {post.status !== "sold" && (
                  <div className="post-dropdown-item" onClick={handleMarkSold}>
                    <i className="fa-solid fa-tag"></i> Mark as Sold
                  </div>
                )}
                <div className="post-dropdown-item danger" onClick={handleDelete}>
                  <i className="fa-regular fa-trash-can"></i> Delete Post
                </div>
              </>
            ) : (
              <div
                className="post-dropdown-item danger"
                onClick={() => openModal("report", { targetPost: post._id })}
              >
                <i className="fa-solid fa-flag"></i> Report Post
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="post-body">
        <Link to={`/post/${post._id}`}>
          <div className="post-title">{post.title}</div>
        </Link>
        <div className="post-desc">{post.description}</div>
        <div className="post-price-row">
          <span className="post-price">৳{post.price?.toLocaleString()}</span>
          <span className="post-tag tag-condition">{post.condition}</span>
          {post.negotiable && <span className="post-tag tag-negotiable">Negotiable</span>}
          {post.status === "sold" && <span className="post-tag tag-status-sold">SOLD</span>}
          {post.status === "reserved" && (
            <span className="post-tag tag-status-reserved">Reserved</span>
          )}
        </div>

        {imgCount > 0 && (
          <Link to={`/post/${post._id}`}>
            <div className={`post-images ${imgClass}`}>
              {post.images.slice(0, 2).map((img, i) => (
                <img key={i} src={img} alt={post.title} />
              ))}
            </div>
          </Link>
        )}
      </div>

      <div className="post-stats-row">
        <div className="post-stats-left">
          <i className="fa-solid fa-heart" style={{ color: "var(--red)", fontSize: "0.7rem" }}></i>{" "}
          {likeCount} likes
        </div>
        <div>
          {comments.length || post.commentCount || 0} comments · {post.shareCount || 0} shares ·{" "}
          {post.views || 0} views
        </div>
      </div>

      <div className="post-actions">
        <div className={`post-action ${liked ? "liked" : ""}`} onClick={handleLike}>
          <i className={liked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i> Like
        </div>
        <div className="post-action" onClick={loadComments}>
          <i className="fa-regular fa-comment"></i> Comment
        </div>
        <div className="post-action" onClick={handleShare}>
          <i className="fa-regular fa-share-from-square"></i> Share
        </div>
        <div className={`post-action ${saved ? "saved" : ""}`} onClick={handleSave}>
          <i className={saved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i> Save
        </div>
      </div>

      {showComments && (
        <div className="post-comments" style={{ display: "flex" }}>
          <div className="comment-input-row">
            <input
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <div className="comment-send" onClick={handleAddComment}>
              <i className="fa-solid fa-paper-plane" style={{ fontSize: "0.8rem" }}></i>
            </div>
          </div>
          {comments.map((c) => (
            <div className="comment-item" key={c._id}>
              <div className="comment-avatar">
                {c.author?.avatar ? (
                  <img src={c.author.avatar} alt={c.author.name} />
                ) : (
                  c.author?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="comment-bubble">
                <div className="comment-author">{c.author?.name}</div>
                <div className="comment-text">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
