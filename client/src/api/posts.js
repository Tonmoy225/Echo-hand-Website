import api from "./axios";

export const getFeedApi = (params) => api.get("/posts", { params });
export const getPostApi = (id) => api.get(`/posts/${id}`);
export const createPostApi = (data) => api.post("/posts", data);
export const updatePostApi = (id, data) => api.put(`/posts/${id}`, data);
export const deletePostApi = (id) => api.delete(`/posts/${id}`);
export const updatePostStatusApi = (id, status) =>
  api.patch(`/posts/${id}/status`, { status });

export const toggleLikeApi = (id) => api.post(`/posts/${id}/like`);
export const toggleSaveApi = (id) => api.post(`/posts/${id}/save`);
export const sharePostApi = (id) => api.post(`/posts/${id}/share`);

export const getCommentsApi = (id) => api.get(`/posts/${id}/comments`);
export const addCommentApi = (id, text) => api.post(`/posts/${id}/comments`, { text });
export const deleteCommentApi = (id) => api.delete(`/comments/${id}`);
