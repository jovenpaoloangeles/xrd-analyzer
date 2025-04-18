import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Link } from 'react-router-dom';

const XRDLogo = () => (
  <span className="inline-block w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
    {/* Simple XRD SVG icon */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20L20 4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  </span>
);

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="rounded-none shadow-none border-b bg-primary text-primary-foreground">
      <nav className="flex flex-col sm:flex-row items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <XRDLogo />
          <span className="text-xl font-bold tracking-tight">XRD Analyzer</span>
        </div>
        {/* Desktop links */}
        <div className="hidden sm:flex gap-2">
          <Button variant="ghost" asChild><Link to="/">Home</Link></Button>
          <Button variant="ghost" asChild><Link to="/about">About/User Guide</Link></Button>
          <Button variant="ghost" asChild><a href="#help">Help</a></Button>
        </div>
        {/* Mobile menu button */}
        <div className="flex sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            onClick={() => setMenuOpen(v => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </Button>
        </div>
      </nav>
      {/* Mobile nav menu */}
      {menuOpen && (
        <div id="mobile-nav-menu" className="flex flex-col gap-2 px-4 pb-3 sm:hidden animate-fade-in">
          <Button variant="ghost" asChild className="w-full justify-start"><Link to="/">Home</Link></Button>
          <Button variant="ghost" asChild className="w-full justify-start"><Link to="/about">About/User Guide</Link></Button>
          <Button variant="ghost" asChild className="w-full justify-start"><a href="#help">Help</a></Button>
        </div>
      )}
    </Card>
  );
};

export default Navbar;
