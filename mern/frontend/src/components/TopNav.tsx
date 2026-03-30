import { Link, useLocation } from 'react-router-dom';
import { Server, FileText, Info, BookOpen, Settings } from 'lucide-react';

export default function TopNav() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Info },
    { name: 'How It Works', path: '/how-it-works', icon: BookOpen },
    { name: 'Guide', path: '/guide', icon: FileText },
    { name: 'Whitepaper', path: '/whitepaper', icon: FileText },
    { name: 'DPI Engine', path: '/engine', icon: Settings, primary: true },
  ];

  return (
    <header className="relative z-50 glass-panel mt-4 mx-6 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center p-[2px] shadow-lg group-hover:shadow-primary/50 transition-all">
          <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
            <Server className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">DPI Engine</h1>
          <p className="text-xs text-gray-400 font-medium tracking-wider uppercase transition-colors">Created by FAIZAN NOOR</p>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                link.primary
                  ? 'btn-primary shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                  : isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Mobile Menu Button - Minimal placeholder for now */}
      <div className="md:hidden flex items-center">
        <button className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </header>
  );
}
