import { useState } from "react";
import toast from "react-hot-toast";
import { submitReportApi } from "../../api/users";

const REASONS = [
  "Scam / Fraud",
  "Fake Listing",
  "Inappropriate Content",
  "Stolen Item",
  "Harassment",
  "App / Technical Bug",
  "Other",
];

export default function ReportModal({ onClose, targetPost }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!details.trim()) {
      toast.error("Please provide details");
      return;
    }
    setSending(true);
    try {
      await submitReportApi({ reason, details, targetPost });
      toast.success("Report submitted. We will review within 24 hours.");
      onClose();
    } catch {
      toast.error("Could not submit report");
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
          <i className="fa-solid fa-flag" style={{ color: "var(--red)" }}></i> Report a Problem
        </div>

        <div className="form-group">
          <label className="form-label">What are you reporting?</label>
          <select className="form-input" value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Details</label>
          <textarea
            className="form-input form-textarea"
            placeholder="Describe the issue clearly. Include post links or usernames if relevant."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline" onClick={onClose} style={{ flex: "0.4" }}>
            Cancel
          </button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleSubmit} disabled={sending}>
            {sending ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-flag"></i>}{" "}
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
