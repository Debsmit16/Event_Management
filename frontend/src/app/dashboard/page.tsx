"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { EventCard } from "@/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  
  const [cancelReason, setCancelReason] = useState("");

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch only events owned by the current user
      const res = await api.get('/events', { params: { limit: 100, ownerId: user?.id } });
      setEvents(res.data);
    } catch (error) {
      toast.error("Failed to load your events");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user, fetchMyEvents]);

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
      toast.success("Event deleted");
      if (selectedEventId === id) {
        setSelectedEventId(null);
        setParticipants([]);
      }
    } catch (error: any) {
      toast.error("Failed to delete event", { description: error.message });
    }
  };

  const loadParticipants = async (eventId: number) => {
    if (selectedEventId === eventId) return;
    
    try {
      setLoadingParticipants(true);
      setSelectedEventId(eventId);
      const res = await api.get(`/events/${eventId}/participants`);
      setParticipants(res.data);
    } catch (error) {
      toast.error("Failed to load participants");
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleCancelRegistration = async (participantId: number) => {
    if (cancelReason.length < 5) {
      toast.error("Please provide a valid reason (min 5 chars)");
      return;
    }

    try {
      await api.patch(`/events/participants/${participantId}/cancel`, { reason: cancelReason });
      
      setParticipants(participants.map(p => 
        p.id === participantId ? { ...p, status: 'cancelled', cancel_reason: cancelReason } : p
      ));
      
      toast.success("Registration cancelled");
      setCancelReason("");
    } catch (error: any) {
      toast.error("Failed to cancel registration", { description: error.message });
    }
  };

  if (!user || loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div><Skeleton className="h-96 w-full" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user.name}. Manage your events here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Events</h2>
          </div>
          
          {events.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
              <p className="text-slate-500 mb-6 font-medium">You haven't created any events yet.</p>
              <Button onClick={() => router.push("/events/create")} className="rounded-2xl px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg">Create Event</Button>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {events.map((event) => (
                <motion.div 
                  key={event.id}
                  variants={itemVariants}
                  className={`transition-all duration-300 rounded-[32px] ${
                    selectedEventId === event.id ? 'ring-2 ring-primary ring-offset-4 shadow-xl scale-[1.01]' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="cursor-pointer" onClick={() => loadParticipants(event.id)}>
                    <EventCard 
                      id={event.id}
                      name={event.name}
                      description={event.description}
                      date={event.date}
                      location={event.location}
                      ownerId={event.owner_id}
                      currentUserId={user.id}
                      onDelete={handleDeleteEvent}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="glass-card rounded-[32px] shadow-sm sticky top-28 overflow-hidden">
            <div className="p-8 border-b border-slate-100/50 bg-white/40">
              <h2 className="text-2xl font-black text-slate-900">Participants</h2>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                {selectedEventId ? 'Manage attendees for the selected event.' : 'Select an event to view participants.'}
              </p>
            </div>
            
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {!selectedEventId ? (
                <div className="text-center py-10 text-gray-400">
                  Click on one of your events to see who has registered.
                </div>
              ) : loadingParticipants ? (
                <div className="space-y-4 py-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No participants have registered for this event yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attendee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="font-medium text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.email}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            p.status === 'registered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {p.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {p.status === 'registered' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 h-8 px-2">Cancel</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Cancel Registration</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to cancel the registration for {p.name}? They will be notified.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="reason">Reason for cancellation</Label>
                                    <Textarea 
                                      id="reason" 
                                      placeholder="e.g., Event is over capacity"
                                      value={cancelReason}
                                      onChange={(e) => setCancelReason(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => handleCancelRegistration(p.id)}
                                      disabled={cancelReason.length < 5}
                                    >
                                      Confirm Cancellation
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
