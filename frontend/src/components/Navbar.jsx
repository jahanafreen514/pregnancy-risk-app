import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHeartbeat, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-2xl shadow-2xl border-b border-pink-100/50"
          : "bg-white/70 backdrop-blur-xl border-b border-pink-100/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/home"
          className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-pink-300 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse">
            </div>
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-sky-400 flex items-center justify-center shadow-lg group-hover:shadow-pink-300/50 transition-all duration-300">
              <FaHeartbeat className="text-white text-xl animate-pulse" />
            </div>
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 bg-clip-text text-transparent">
            GlowCare
          </span>
        </Link>

        {/* Desktop Navigation - Only Home, About, Contact */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 font-semibold transition-all duration-300 group ${
                  isActive
                    ? "text-transparent bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text"
                    : "text-gray-600 hover:text-pink-500"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-500 to-sky-400 rounded-full"></span>
                )}
                
                {/* Hover Effect */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/0 to-sky-400/0 group-hover:from-pink-500/5 group-hover:to-sky-400/5 transition-all duration-300 -z-10"></span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500/10 to-sky-400/10 hover:from-pink-500/20 hover:to-sky-400/20 transition-all duration-300 flex items-center justify-center"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-2xl text-pink-500" />
          ) : (
            <FaBars className="text-2xl text-pink-500" />
          )}
        </button>
      </div>

      {/* Mobile Menu - Only Home, About, Contact */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-pink-100/50 shadow-2xl transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 space-y-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500/10 to-sky-400/10 text-transparent bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;