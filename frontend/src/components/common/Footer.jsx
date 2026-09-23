import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-brand-line bg-surface-container-lowest mt-12">
    <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-on-primary font-bold text-sm">
          F
        </span>
        <span className="text-body-sm text-brand-slate">© {new Date().getFullYear()} Feedants. Built for builders.</span>
      </div>
      <div className="flex items-center gap-4 text-brand-slate">
        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary-container">
          <Github className="w-[18px] h-[18px]" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-primary-container">
          <Twitter className="w-[18px] h-[18px]" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary-container">
          <Linkedin className="w-[18px] h-[18px]" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
