"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Listen for storage events to sync auth across tabs
    const handleStorage = () => {
      const userData = localStorage.getItem("user");
      setIsAuthenticated(!!userData);
    };
    window.addEventListener("storage", handleStorage);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorage);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Explore Events", path: "/events" },
    ...(isAuthenticated ? [{ name: "Dashboard", path: "/dashboard" }] : []),
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-card border-x-0 border-t-0 shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-y-4">
        <Link href="/" className="text-xl md:text-2xl font-extrabold tracking-tighter text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform">
            <span className="text-white text-lg font-black leading-none">E</span>
          </div>
          Event<span className="text-primary font-light">Manager</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 w-full md:w-auto">
          <div className="flex items-center gap-4 md:gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative text-sm font-bold tracking-widest uppercase transition-colors ${
                    isActive ? "text-primary" : "text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/events/create">
                  <Button variant="default" className="rounded-2xl px-7 font-bold bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                    Create Event
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="rounded-2xl font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/50">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="rounded-2xl font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100/50">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" className="rounded-2xl px-7 font-bold bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
