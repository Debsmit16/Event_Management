import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar, Trash2, Edit, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface EventCardProps {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  ownerId?: number;
  currentUserId?: number;
  onDelete?: (id: number) => void;
}

export const EventCard = React.memo(({ 
  id, name, description, date, location, ownerId, currentUserId, onDelete 
}: EventCardProps) => {
  const isOwner = ownerId && currentUserId && ownerId === currentUserId;

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass-card rounded-3xl overflow-hidden flex flex-col h-full group relative transition-all duration-500 hover:shadow-[0_20px_50px_rgba(167,139,250,0.15)] hover:border-white/80"
    >
      <div className="p-8 flex-grow flex flex-col relative">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

        <div className="flex justify-between items-start mb-4">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase">
            <Calendar className="w-3.5 h-3.5 mr-2 text-primary" />
            {format(new Date(date), "MMM dd, yyyy")}
          </div>
        </div>

        <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-3 font-medium flex-grow leading-relaxed">
          {description || "No description provided."}
        </p>

        <div className="flex items-center text-slate-600 text-sm font-semibold mb-6">
          <MapPin className="w-4 h-4 mr-2 text-slate-400" />
          <span className="line-clamp-1">{location}</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100">
          <Link href={`/events/${id}`} className="w-full">
            <Button variant="ghost" className="w-full justify-between font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-2xl h-12">
              View Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
          
          {isOwner && (
            <div className="flex space-x-2 ml-4">
              <Link href={`/events/${id}/edit`}>
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              {onDelete && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onDelete(id)}
                  className="rounded-xl border-red-100 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

EventCard.displayName = "EventCard";
