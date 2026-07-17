import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostApi } from "../api/posts";
import PostCard from "../components/post/PostCard";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPostApi(id)
      .then(({ data }) => setPost(data))
      .catch(() => navigate("/"));
  }, [id, navigate]);

  if (!post) {
    return (
      <div id="main-content">
        <div className="empty-state">
          <i className="fa-solid fa-leaf fa-spin"></i>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content">
      <PostCard post={post} onUpdate={setPost} onDelete={() => navigate("/")} />

      {post.owner?.socialLinks &&
        Object.values(post.owner.socialLinks).some((v) => v) && (
          <div className="right-card">
            <div className="right-card-title">
              <i className="fa-solid fa-share-nodes"></i> Connect with {post.owner.name}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {post.owner.socialLinks.facebook && (
                <a href={post.owner.socialLinks.facebook} target="_blank" rel="noreferrer" className="social-icon si-facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              )}
              {post.owner.socialLinks.instagram && (
                <a href={post.owner.socialLinks.instagram} target="_blank" rel="noreferrer" className="social-icon si-instagram">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              )}
              {post.owner.socialLinks.whatsapp && (
                <a href={post.owner.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="social-icon si-whatsapp">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
              )}
              {post.owner.socialLinks.linkedin && (
                <a href={post.owner.socialLinks.linkedin} target="_blank" rel="noreferrer" className="social-icon si-linkedin">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
