import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import AuthModal from "./AuthModal";
import ProfileModal from "./ProfileModal";
import CreatePostModal from "./CreatePostModal";
import TermsModal from "./TermsModal";
import FeedbackModal from "./FeedbackModal";
import ReportModal from "./ReportModal";
import LogoutModal from "./LogoutModal";
import NotificationsModal from "./NotificationsModal";
import CartModal from "./CartModal";

export default function ModalRoot() {
  const { activeModal, modalProps, closeModal } = useUIStore();
  const { isAuthModalOpen } = useAuthStore();

  return (
    <>
      {isAuthModalOpen && <AuthModal />}
      {activeModal === "profile" && <ProfileModal onClose={closeModal} />}
      {(activeModal === "createPost" || activeModal === "editPost") && (
        <CreatePostModal onClose={closeModal} editingPost={modalProps.post} />
      )}
      {activeModal === "terms" && <TermsModal onClose={closeModal} />}
      {activeModal === "feedback" && <FeedbackModal onClose={closeModal} />}
      {activeModal === "report" && (
        <ReportModal onClose={closeModal} targetPost={modalProps.targetPost} />
      )}
      {activeModal === "logout" && <LogoutModal onClose={closeModal} />}
      {activeModal === "notifications" && <NotificationsModal onClose={closeModal} />}
      {activeModal === "cart" && <CartModal onClose={closeModal} />}
    </>
  );
}
