"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "./ImageUpload";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";



interface CreateEventFormProps {
  onClose: () => void;
}

export default function CreateEventForm({ onClose }: CreateEventFormProps) {

  const { data: session } = useSession();
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(true);
  const [limitedAttendees, setLimitedAttendees] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [attandee, setAttandee] = useState(1);
  const [error, setError] = useState("");

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 
  
    const eventData = {
      name,
      description: desc,
      location,
      time: new Date(date).toISOString(),
      image: image || "",
      ispublic: isPublic,
      islimited: limitedAttendees,
      attandee: limitedAttendees ? attandee : null, // Fix the typo here
    };
    
    try {
      const response = await fetch("/api/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
  
      if (!response.ok) {
        // Attempt to parse the response error, but fall back to a generic message
        const errorText = await response.text();
        const errorMessage = errorText ? JSON.parse(errorText)?.error : "Failed to create event.";
        throw new Error(errorMessage);
      }
  
      // Parse response if it has content
      const result = response.status !== 204 ? await response.json() : null;
      console.log("Event created successfully:", result);
      toast({
        variant:"default",
        title: "Success",
        description: "Event Created Succesfully",
      })
      
  
      onClose(); 

    
      
    } catch (error: any) {
      console.error("Error creating event:", error);
      setError(error.message || "Failed to create event. Please try again.");
      toast({
        variant:"destructive",
        title: "Error!",
        description: "There was a problem in creating event",
      })
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>

      <div>
        <Label htmlFor="name">Event Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={desc} onChange={(e) => setDesc(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="coverImage">Cover Image</Label>
        <ImageUpload onImageUpload={handleImageUpload} />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="dateTime">Date and Time</Label>
        <Input id="dateTime" value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" required />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isPublic" checked={isPublic} onCheckedChange={() => setIsPublic(!isPublic)} />
        <Label htmlFor="isPublic">Public Event</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="limitedAttendees" checked={limitedAttendees} onCheckedChange={() => setLimitedAttendees(!limitedAttendees)} />
        <Label htmlFor="limitedAttendees">Limited Attendees</Label>
      </div>

      {limitedAttendees && (
        <div>
          <Label htmlFor="maxAttendees">Maximum Attendees</Label>
          <Input id="maxAttendees" type="number" min="1" value={attandee} onChange={(e) => setAttandee(Number(e.target.value))} required />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex space-x-4">
        <Button type="submit">Create Event</Button>
      </div>
    </form>
  );
}
