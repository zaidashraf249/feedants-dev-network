import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import AuthModal from '../auth/AuthModal';

/**
 * Top-level page shell: sticky header, optional left nav rail, the
 * routed page content, footer, and the app-wide auth modal (opened via
 * ui slice state from anywhere in the app).
 */
const LayoutWrapper = ({ children, withSidebar = true }) => {
  const isAuthModalOpen = useSelector((state) => state.ui.isAuthModalOpen);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto flex gap-6 px-gutter-mobile sm:px-gutter">
        {withSidebar && <Sidebar />}
        <main className="flex-1 min-w-0 py-space-lg">{children}</main>
      </div>
      <Footer />
      {isAuthModalOpen && <AuthModal />}
    </div>
  );
};

export default LayoutWrapper;
