import { useState } from "react";
import toast from "react-hot-toast";
import { createPostApi, updatePostApi } from "../../api/posts";
import { uploadMultipleApi } from "../../api/users";

const CATEGORIES = [
  "Mobile Phones",
  "Laptops",
  "Cameras",
  "Audio",
  "Gaming",
  "TV & Monitors",
  "Accessories",
  "Wearables",
  "Home Appliances",
  "Other",
];
const CONDITIONS = ["Brand New", "Like New", "Good", "Fair", "For Parts"];

export default function CreatePostModal({ onClose, editingPost }) {
  const isEdit = !!editingPost;
  const [form, setForm] = useState({
    title: editingPost?.title || "",
    description: editingPost?.description || "",
    price: editingPost?.price || "",
    negotiable: editingPost?.negotiable ?? true,
    category: editingPost?.category || "Mobile Phones",
    condition: editingPost?.condition || "Good",
    location: editingPost?.location || "",
  });
  const [images, setImages] = useState(editingPost?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 6 - images.length);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const { data } = await uploadMultipleApi(files);
      setImages((prev) => [...prev, ...data.urls]);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.price || !form.location) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), images };
      if (isEdit) {
        await updatePostApi(editingPost._id, payload);
        toast.success("Post updated!");
      } else {
        await createPostApi(payload);
        toast.success("Post published! +10 eco points 🌱");
      }
      onClose();
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <div className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="modal-title">
          <i className="fa-solid fa-plus" style={{ color: "var(--accent)" }}></i>{" "}
          {isEdit ? "Edit Listing" : "Create New Listing"}
        </div>

        <div className="form-group">
          <label className="form-label">Photos (up to 6)</label>
          <div className="image-upload-grid">
            {images.map((img, i) => (
              <div className="image-upload-slot" key={i}>
                <img src={img} alt="" />
                <div className="remove-img" onClick={() => removeImage(i)}>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
            ))}
            {images.length < 6 && (
              <label className="image-upload-slot">
                {uploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-plus"></i>}
                <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            placeholder="e.g. iPhone 12 Pro 128GB"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input form-textarea"
            placeholder="Describe the condition, usage history, included accessories..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price (৳)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              className="form-input"
              placeholder="City"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Condition</label>
          <div className="condition-grid">
            {CONDITIONS.map((c) => (
              <div
                key={c}
                className={`condition-btn ${form.condition === c ? "active" : ""}`}
                onClick={() => setForm({ ...form, condition: c })}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={form.negotiable}
            onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
            style={{ width: 16, height: 16 }}
          />
          <label className="form-label" style={{ margin: 0 }}>
            Price is negotiable
          </label>
        </div>

        <button className="btn btn-accent" onClick={handleSubmit} disabled={saving}>
          {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}{" "}
          {isEdit ? "Update Listing" : "Publish Listing"}
        </button>
      </div>
    </div>
  );
}
