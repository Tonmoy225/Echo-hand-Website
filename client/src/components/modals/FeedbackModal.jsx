import { useState } from "react";
import toast from "react-hot-toast";
import { submitFeedbackApi } from "../../api/users";

const TYPES = [
  { label: "Suggestion", icon: "fa-regular fa-thumbs-up" },
  { label: "Bug Report", icon: "fa-solid fa-bug" },
  { label: "Compliment", icon: "fa-regular fa-star" },
];

export default function FeedbackModal({ onClose }) {
  const [type, setType] = useState("Suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }
    setSending(true);
    try {
      await submitFeedbackApi({ type, subject, message });
      toast.success("Feedback sent — thank you!");
      onClose();
    } catch {
      toast.error("Could not send feedback");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="modal-title">
          <i className="fa-regular fa-comment-dots" style={{ color: "var(--accent)" }}></i> Send
          Feedback
        </div>

        <div className="feedback-type">
          {TYPES.map((t) => (
            <div
              key={t.label}
              className={`fb-type-btn ${type === t.label ? "active" : ""}`}
              onClick={() => setType(t.label)}
            >
              <i className={t.icon}></i>
              {t.label}
            </div>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">Subject</label>
          <input
            className="form-input"
            placeholder="Brief summary of your feedback"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Your Feedback</label>
          <textarea
            className="form-input form-textarea"
            placeholder="Tell us what's on your mind. We read every message."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button className="btn btn-accent" onClick={handleSend} disabled={sending}>
          {sending ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}{" "}
          Send Feedback
        </button>
      </div>
    </div>
  );
}
