import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Topbar from "./components/layout/Topbar";
import CategoryBar from "./components/layout/CategoryBar";
import Sidebar from "./components/layout/Sidebar";
import RightPanel from "./components/layout/RightPanel";
import ModalRoot from "./components/modals/ModalRoot";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import MyPosts from "./pages/MyPosts";
import SavedPosts from "./pages/SavedPosts";
import Landing from "./pages/Landing";

export default function App() {
  const { user, loading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-page)",
          color: "var(--accent)",
          fontSize: "1.5rem",
        }}
      >
        <i className="fa-solid fa-leaf fa-spin"></i>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Landing />
        <ModalRoot />
      </>
    );
  }

  return (
    <>
      <Topbar />
      <CategoryBar />
      <div id="layout">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/saved" element={<SavedPosts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <RightPanel />
      </div>
      <ModalRoot />
    </>
  );
}
