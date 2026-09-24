import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Bell, LogOut, Menu, Search, Settings, User as UserIcon, X } from 'lucide-react';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { openAuthModal, toggleSidebar } from '../../store/slices/uiSlice';
import { useLazySearchUsersQuery } from '../../store/api/usersApi';

const NAV_LINKS = [
  { to: '/', label: 'Feed', end: true },
  { to: '/explore', label: 'Explore' },
];

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded text-title-md transition-colors ${
    isActive ? 'text-primary-container font-semibold' : 'text-brand-slate hover:text-on-surface'
  }`;

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [triggerSearch, { data: searchResults }] = useLazySearchUsersQuery();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length >= 2) {
      triggerSearch(value.trim());
    }
  };

  const goToProfile = (username) => {
    setQuery('');
    setMobileSearchOpen(false);
    navigate(`/profile/${username}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-brand-line w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-gutter h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Drawer Toggle & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            className="lg:hidden p-1.5 -ml-1 text-brand-slate hover:text-on-surface rounded-lg transition-colors"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-md bg-primary-container flex items-center justify-center text-on-primary font-bold text-lg">
              F
            </span>
            <span className="hidden min-[380px]:inline text-title-md font-bold text-on-surface tracking-tight">
              Feedants
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-2">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar (Desktop / Tablet) */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-outline pointer-events-none" />
          <input
            value={query}
            onChange={handleSearchChange}
            placeholder="Search creators, tags, snippets…"
            className="w-full h-10 pl-10 pr-3 rounded-full bg-surface-container border border-transparent text-body-sm placeholder:text-outline focus:bg-surface-container-lowest focus:border-brand-line focus:ring-2 focus:ring-primary-fixed outline-none transition-all"
          />
          {debouncedQuery.trim().length >= 2 && searchResults?.data?.length > 0 && (
            <div className="absolute mt-2 w-full bg-surface-container-lowest border border-brand-line rounded-lg shadow-level3 overflow-hidden z-50 max-h-72 overflow-y-auto">
              {searchResults.data.slice(0, 5).map((result) => (
                <button
                  key={result._id || result.id}
                  type="button"
                  onClick={() => goToProfile(result.username)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-low transition-colors text-left"
                >
                  <Avatar src={result.avatar} name={result.name} size="sm" ring={false} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-semibold truncate">{result.name}</p>
                    <p className="text-body-sm text-brand-slate truncate">@{result.username}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Toggle Icon */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="p-2 rounded-full text-brand-slate hover:bg-surface-container transition-colors sm:hidden"
            aria-label="Toggle Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="p-2 rounded-full text-brand-slate hover:bg-surface-container transition-colors hidden sm:inline-flex"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-fixed p-0.5"
                  aria-label="Open profile menu"
                >
                  <Avatar src={user?.avatar} name={user?.name} size="sm" />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-brand-line rounded-lg shadow-level3 py-1.5 z-20 max-w-[90vw]">
                      <div className="px-3 py-2 border-b border-brand-line mb-1">
                        <p className="text-body-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-body-sm text-brand-slate truncate">@{user?.username}</p>
                      </div>
                      <Link
                        to={`/profile/${user?.username}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <UserIcon className="w-4 h-4 shrink-0" /> View profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <Settings className="w-4 h-4 shrink-0" /> Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-error hover:bg-error-container/40 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 shrink-0" /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button variant="ghost" size="sm" onClick={() => dispatch(openAuthModal('signin'))} className="px-2.5 sm:px-3">
                Sign in
              </Button>
              <Button variant="primary" size="sm" onClick={() => dispatch(openAuthModal('signup'))} className="px-2.5 sm:px-3">
                Get started
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Expanding Search Bar for Mobile Viewports */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-3 pb-3 pt-1 border-t border-brand-line bg-surface-container-lowest">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
            <input
              value={query}
              onChange={handleSearchChange}
              placeholder="Search creators, tags…"
              autoFocus
              className="w-full h-9 pl-9 pr-8 rounded-full bg-surface-container border border-brand-line text-body-sm outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setMobileSearchOpen(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-slate"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {debouncedQuery.trim().length >= 2 && searchResults?.data?.length > 0 && (
            <div className="mt-2 w-full bg-surface-container-lowest border border-brand-line rounded-lg shadow-level3 overflow-hidden max-h-60 overflow-y-auto">
              {searchResults.data.slice(0, 5).map((result) => (
                <button
                  key={result._id || result.id}
                  type="button"
                  onClick={() => goToProfile(result.username)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-container-low transition-colors text-left"
                >
                  <Avatar src={result.avatar} name={result.name} size="xs" ring={false} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-semibold truncate">{result.name}</p>
                    <p className="text-body-xs text-brand-slate truncate">@{result.username}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;