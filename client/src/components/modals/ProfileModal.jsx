import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { updateProfileApi } from "../../api/users";
import { uploadImageApi } from "../../api/users";

export default function ProfileModal({ onClose }) {
  const { user, updateUserLocal, logout } = useAuthStore();
  const [tab, setTab] = useState("details");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  const [social, setSocial] = useState({
    facebook: user?.socialLinks?.facebook || "",
    instagram: user?.socialLinks?.instagram || "",
    twitter: user?.socialLinks?.twitter || "",
    linkedin: user?.socialLinks?.linkedin || "",
    whatsapp: user?.socialLinks?.whatsapp || "",
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadImageApi(file);
      setForm((f) => ({ ...f, avatar: data.url }));
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateProfileApi({ ...form, socialLinks: social });
      updateUserLocal(data);
      toast.success("Profile updated!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
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
          <i className="fa-regular fa-user" style={{ color: "var(--accent)" }}></i> Edit Profile
        </div>

        <div className="avatar-upload">
          <label className="avatar-upload-img">
            {form.avatar ? (
              <img src={form.avatar} alt="avatar" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
            <div className="avatar-upload-edit">
              {uploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-camera"></i>}
            </div>
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </label>
        </div>

        <div className="profile-tabs">
          <div className={`modal-tab ${tab === "details" ? "active" : ""}`} onClick={() => setTab("details")}>
            Details
          </div>
          <div className={`modal-tab ${tab === "social" ? "active" : ""}`} onClick={() => setTab("social")}>
            Social Accounts
          </div>
        </div>

        {tab === "details" && (
          <div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Tell others about yourself..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                maxLength={200}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  className="form-input"
                  placeholder="City, Country"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  placeholder="+880..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {tab === "social" && (
          <div>
            <div className="social-input-row">
              <div className="social-icon si-facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </div>
              <input
                className="form-input"
                placeholder="Facebook profile URL"
                value={social.facebook}
                onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
              />
            </div>
            <div className="social-input-row">
              <div className="social-icon si-instagram">
                <i className="fa-brands fa-instagram"></i>
              </div>
              <input
                className="form-input"
                placeholder="Instagram profile URL"
                value={social.instagram}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
              />
            </div>
            <div className="social-input-row">
              <div className="social-icon si-twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </div>
              <input
                className="form-input"
                placeholder="X / Twitter profile URL"
                value={social.twitter}
                onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
              />
            </div>
            <div className="social-input-row">
              <div className="social-icon si-linkedin">
                <i className="fa-brands fa-linkedin-in"></i>
              </div>
              <input
                className="form-input"
                placeholder="LinkedIn profile URL"
                value={social.linkedin}
                onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
              />
            </div>
            <div className="social-input-row">
              <div className="social-icon si-whatsapp">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <input
                className="form-input"
                placeholder="WhatsApp number / link"
                value={social.whatsapp}
                onChange={(e) => setSocial({ ...social, whatsapp: e.target.value })}
              />
            </div>
          </div>
        )}

        <button className="btn btn-accent" style={{ marginTop: 10 }} onClick={handleSave} disabled={saving}>
          {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}{" "}
          Save Changes
        </button>
      </div>
    </div>
  );
}
