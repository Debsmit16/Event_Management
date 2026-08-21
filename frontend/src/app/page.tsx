"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 overflow-hidden relative">
      
      {/* Animated CSS Blobs from globals.css */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl mx-auto flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-8 inline-flex items-center px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm text-slate-800 text-xs font-bold tracking-widest uppercase">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-3 animate-pulse"></span>
          Next Generation Platform
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-[7rem] font-black tracking-tighter text-slate-900 mb-6 leading-[1.1] md:leading-[0.95]">
          Manage Events <br />
          with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">Elegance.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl font-medium leading-relaxed">
          The minimalist, high-performance platform to discover, create, and manage your events seamlessly.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full justify-center">
          <Link href="/events">
            <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_10px_30px_rgba(167,139,250,0.3)] hover:scale-105 active:scale-95 transition-all">
              Explore Events
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl font-bold border-2 border-slate-200 hover:border-slate-300 hover:bg-white/50 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all">
              Sign Up Now
            </Button>
          </Link>
        </motion.div>

        {/* Bento Grid Features */}
        <motion.div 
          variants={containerVariants}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left"
        >
          {[
            { icon: Calendar, title: "Create Seamlessly", desc: "Set up your event in minutes with our intuitive creation flow.", colorClasses: "bg-primary/10 text-primary" },
            { icon: Users, title: "Manage Attendees", desc: "Track registrations and manage your participant lists effortlessly.", colorClasses: "bg-pink-500/10 text-pink-500" },
            { icon: TrendingUp, title: "Track Performance", desc: "Gain insights into your event's reach and popularity.", colorClasses: "bg-indigo-500/10 text-indigo-500" }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-10 rounded-[32px] transition-all duration-500 group"
            >
              <div className={`w-16 h-16 ${feature.colorClasses} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
