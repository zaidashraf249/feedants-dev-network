import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-brand-line bg-surface-container-lowest mt-12 w-full">
    <div className="max-w-7xl mx-auto px-3 sm:px-gutter py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      
      {/* Brand & Copyright Info */}
      <div className="flex flex-col min-[480px]:flex-row items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-on-primary font-bold text-sm">
            F
          </span>
          <span className="text-title-sm font-bold text-on-surface">Feedants</span>
        </div>
        <span className="hidden min-[480px]:inline text-outline">•</span>
        <p className="text-body-xs sm:text-body-sm text-brand-slate break-words">
          © {new Date().getFullYear()} Feedants. Built for builders worldwide.
        </p>
      </div>

      {/* Center Quick Links (Global Navigation) */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-body-xs sm:text-body-sm text-brand-slate">
        <Link to="/" className="hover:text-primary-container transition-colors py-1">
          Privacy Policy
        </Link>
        <span className="text-outline">•</span>
        <Link to="/" className="hover:text-primary-container transition-colors py-1">
          Terms of Service
        </Link>
        <span className="text-outline">•</span>
        <Link to="/" className="hover:text-primary-container transition-colors py-1">
          Status
        </Link>
      </div>

      {/* Social Media Links */}
      <div className="flex items-center gap-2 text-brand-slate">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="p-2 rounded-full hover:bg-surface-container-low hover:text-primary-container transition-colors"
        >
          <Github className="w-[18px] h-[18px]" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter"
          className="p-2 rounded-full hover:bg-surface-container-low hover:text-primary-container transition-colors"
        >
          <Twitter className="w-[18px] h-[18px]" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="p-2 rounded-full hover:bg-surface-container-low hover:text-primary-container transition-colors"
        >
          <Linkedin className="w-[18px] h-[18px]" />
        </a>
      </div>

    </div>
  </footer>
);

export default Footer;