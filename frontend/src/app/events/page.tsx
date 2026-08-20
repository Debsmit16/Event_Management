"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { EventCard } from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-asc");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Reset page when search or sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortOption]);
  
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const [sortBy, sortDir] = sortOption.split('-');
      const res = await api.get('/events', {
        params: {
          search: debouncedSearch || undefined,
          sortBy,
          sortDir,
          limit: 12,
          page
        }
      });
      
      // api.ts interceptor returns response.data, so res is { success, data, meta }
      const responseData = res as any;
      setEvents(responseData.data);
      if (responseData.meta) {
        setTotalPages(responseData.meta.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortOption, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Events</h1>
          <p className="text-gray-500 mt-1">Discover and join amazing events happening around you.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              type="text" 
              placeholder="Search events..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date: Upcoming first</SelectItem>
              <SelectItem value="date-desc">Date: Furthest first</SelectItem>
              <SelectItem value="created_at-desc">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border shadow-sm">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <div className="flex gap-4 mb-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-20 w-full mb-6" />
              <div className="flex justify-between border-t pt-4">
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <EventCard 
                id={event.id}
                name={event.name}
                description={event.description}
                date={event.date}
                location={event.location}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-1">No events found</h3>
          <p className="text-gray-500">
            {debouncedSearch ? `No results for "${debouncedSearch}"` : "There are currently no upcoming events."}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && events.length > 0 && totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t pt-6">
          <p className="text-sm text-gray-500 mb-4 sm:mb-0">
            Showing page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
