import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bookmark, Compass, Home, Settings, Users, X } from 'lucide-react';
import { closeSidebar } from '../../store/slices/uiSlice';
import { useGetCirclesQuery } from '../../store/api/circlesApi';
import { CIRCLE_DOT_COLORS } from '../../utils/constants';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { to: '/', label: 'Feed', icon: Home, end: true },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/bookmarks', label: 'Saved', icon: Bookmark },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const navItemClass = ({ isActive }) =>
  cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-title-md transition-colors',
    isActive
      ? 'bg-primary-fixed text-primary-container font-semibold'
      : 'text-brand-slate hover:bg-surface-container-low hover:text-on-surface'
  );

const SidebarContent = ({ onNavigate }) => {
  const { data } = useGetCirclesQuery();
  const circles = data?.data?.slice(0, 5) || [];

  return (
    <div className="flex flex-col gap-6 h-full">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navItemClass} onClick={onNavigate}>
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div>
        <div className="flex items-center gap-2 px-3 mb-2 text-label-sm text-outline uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          Your circles
        </div>
        <div className="flex flex-col gap-0.5">
          {circles.map((circle) => (
            <NavLink
              key={circle._id || circle.id}
              to={`/explore?circle=${circle._id || circle.id}`}
              onClick={onNavigate}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm text-brand-slate hover:bg-surface-container-low hover:text-on-surface transition-colors"
            >
              <span className={cn('w-2 h-2 rounded-full shrink-0', CIRCLE_DOT_COLORS[circle.category] || 'bg-slate-400')} />
              <span className="truncate">{circle.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders as a persistent left rail on large screens and an off-canvas
 * drawer (toggled via the header's hamburger button) on small screens.
 */
const Sidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isSidebarOpen);

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 py-space-lg pr-2">
        <div className="sticky top-20">
          <SidebarContent />
        </div>
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-brand-ink/50" onClick={() => dispatch(closeSidebar())} aria-hidden="true" />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface-container-lowest p-space-md shadow-level3 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-title-md font-bold">Menu</span>
              <button
                type="button"
                onClick={() => dispatch(closeSidebar())}
                aria-label="Close menu"
                className="p-1.5 rounded-full hover:bg-surface-container-low"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => dispatch(closeSidebar())} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
