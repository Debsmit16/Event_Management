"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { api } from "@/lib/api";
import { applyEventSchema } from "@/lib/validators";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ApplyForm = z.infer<typeof applyEventSchema>;

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ApplyForm>({
    resolver: zodResolver(applyEventSchema),
  });

  const fetchEvent = useCallback(async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to load event details.",
      });
      router.push("/events");
    } finally {
      setLoading(false);
    }
  }, [id, router, toast]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const onApply = async (data: ApplyForm) => {
    try {
      setApplying(true);
      await api.post(`/events/${id}/register`, data);
      
      toast.success("Success!", {
        description: "You have successfully registered for this event.",
      });
      
      reset();
    } catch (error: any) {
      toast.error("Registration Failed", {
        description: error.message || "Failed to register for the event.",
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Skeleton className="h-10 w-24 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/events" className="inline-flex items-center text-blue-600 hover:underline mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{event.name}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              <span className="font-medium">{format(new Date(event.date), "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              <span className="font-medium">{event.location}</span>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <h3 className="text-xl font-bold mb-4">About this Event</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
              {event.description || "No detailed description provided for this event."}
            </p>
          </div>
        </div>

        <div>
          <Card className="sticky top-24 shadow-md border-t-4 border-t-blue-600">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="flex items-center text-xl">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Register Now
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onApply)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Jane Doe"
                    {...register("name")} 
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="jane@example.com"
                    {...register("email")} 
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                
                <Button type="submit" className="w-full mt-4 h-12 text-lg" disabled={applying}>
                  {applying ? "Registering..." : "Secure Your Spot"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
