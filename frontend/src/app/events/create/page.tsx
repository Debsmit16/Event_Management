"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { api } from "@/lib/api";
import { eventSchema } from "@/lib/validators";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

type EventForm = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data: EventForm) => {
    try {
      setLoading(true);
      const res = await api.post("/events", data);
      
      toast.success("Event Created", {
        description: "Your event was successfully created.",
      });
      
      router.push(`/events/${res.data.id}`);
    } catch (error: any) {
      toast.error("Failed to create event", {
        description: error.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link href="/events" className="inline-flex items-center text-blue-600 hover:underline mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
        <p className="text-gray-500 mb-8">Fill in the details to publish your event to the public.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name *</Label>
            <Input 
              id="name" 
              placeholder="e.g., Tech Conference 2024"
              {...register("name")} 
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input 
                id="date" 
                type="date"
                {...register("date")} 
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location" 
                placeholder="e.g., New York City"
                {...register("location")} 
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Provide details about your event..."
              className="min-h-[150px]"
              {...register("description")} 
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link href="/events">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
