import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react';
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
    navigate(`/profile/${username}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-brand-line">
      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter h-16 flex items-center gap-4">
        <button
          type="button"
          className="lg:hidden p-2 -ml-2 text-brand-slate"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-md bg-primary-container flex items-center justify-center text-on-primary font-bold text-lg">
            F
          </span>
          <span className="hidden sm:inline text-title-md font-bold text-on-surface tracking-tight">Feedants</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-outline" />
          <input
            value={query}
            onChange={handleSearchChange}
            placeholder="Search creators, tags, snippets…"
            className="w-full h-10 pl-10 pr-3 rounded-full bg-surface-container border border-transparent text-body-sm placeholder:text-outline focus:bg-surface-container-lowest focus:border-brand-line focus:ring-2 focus:ring-primary-fixed outline-none transition-all"
          />
          {debouncedQuery.trim().length >= 2 && searchResults?.data?.length > 0 && (
            <div className="absolute mt-2 w-full bg-surface-container-lowest border border-brand-line rounded-lg shadow-level3 overflow-hidden">
              {searchResults.data.slice(0, 5).map((result) => (
                <button
                  key={result._id || result.id}
                  type="button"
                  onClick={() => goToProfile(result.username)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-low transition-colors text-left"
                >
                  <Avatar src={result.avatar} name={result.name} size="sm" ring={false} />
                  <div className="min-w-0">
                    <p className="text-body-sm font-semibold truncate">{result.name}</p>
                    <p className="text-body-sm text-brand-slate truncate">@{result.username}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
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
                  className="flex items-center"
                  aria-label="Open profile menu"
                >
                  <Avatar src={user?.avatar} name={user?.name} size="sm" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-brand-line rounded-lg shadow-level3 py-1.5 z-20">
                      <div className="px-3 py-2 border-b border-brand-line mb-1">
                        <p className="text-body-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-body-sm text-brand-slate truncate">@{user?.username}</p>
                      </div>
                      <Link
                        to={`/profile/${user?.username}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container-low"
                      >
                        <UserIcon className="w-4 h-4" /> View profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container-low"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-error hover:bg-error-container/40"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => dispatch(openAuthModal('signin'))}>
                Sign in
              </Button>
              <Button variant="primary" size="sm" onClick={() => dispatch(openAuthModal('signup'))}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
