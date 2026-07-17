import api from "./axios";

// User / profile
export const updateProfileApi = (data) => api.put("/users/profile", data);
export const getUserProfileApi = (id) => api.get(`/users/${id}`);
export const getMyPostsApi = () => api.get("/users/me/posts");
export const getSavedPostsApi = () => api.get("/users/me/saved");
export const getCartApi = () => api.get("/users/me/cart");
export const toggleCartApi = (postId) => api.post(`/users/cart/${postId}`);

// Notifications
export const getNotificationsApi = () => api.get("/notifications");
export const markNotifReadApi = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotifReadApi = () => api.patch("/notifications/read-all");

// Reports / Feedback
export const submitReportApi = (data) => api.post("/reports", data);
export const submitFeedbackApi = (data) => api.post("/feedback", data);

// Upload
export const uploadImageApi = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const uploadMultipleApi = (files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));
  return api.post("/upload/multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
