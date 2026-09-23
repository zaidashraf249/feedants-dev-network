import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
    <span className="text-display-xl-mobile sm:text-display-xl font-bold text-primary-container">404</span>
    <h1 className="text-headline-sm font-bold text-on-surface">Page not found</h1>
    <p className="text-body-md text-brand-slate max-w-sm">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <Link to="/">
      <Button variant="primary">Back to feed</Button>
    </Link>
  </div>
);

export default NotFoundPage;
