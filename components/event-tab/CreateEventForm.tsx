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
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface CreateEventFormProps {
  onClose: () => void;
}

export default function CreateEventForm({ onClose }: CreateEventFormProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(true);
  const [limitedParticipants, setLimitedParticipants] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [eventPin, setEventPin] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageUpload = (url: string) => {
    setImage(url);
  };
      
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    const eventData = {
      name,
      description: desc,
      location,
      dateTime: new Date(date).toISOString(),
      image: image || "",
      ispublic: isPublic,
      islimited: limitedParticipants,
      maxParticipants: limitedParticipants ? maxParticipants : null,
      isOnline,
      eventPin: isPublic ? null : eventPin
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
        const errorText = await response.text();
        const errorMessage = errorText ? JSON.parse(errorText)?.error : "Failed to create event.";
        throw new Error(errorMessage);
      }
  
      const result = response.status !== 204 ? await response.json() : null;
      console.log("Event created successfully:", result);
      toast({
        variant: "default",
        title: "Success",
        description: "Event Created Successfully",
      });
      
      onClose();
    } catch (error: any) {
      console.error("Error creating event:", error);
      setError(error.message || "Failed to create event. Please try again.");
      toast({
        variant: "destructive",
        title: "Error!",
        description: "There was a problem creating the event",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>

      <div>
        <Label htmlFor="name">Event Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={desc} 
          onChange={(e) => setDesc(e.target.value)} 
          required 
        />
      </div>

      <div>
        <Label htmlFor="coverImage">Cover Image</Label>
        <ImageUpload 
          onImageUpload={(url) => {
            handleImageUpload(url);
            setPreviewUrl(url);
          }}
          onUploadStart={() => {
            setIsImageUploading(true);
            setUploadProgress(0);
          }}
          onUploadEnd={() => setIsImageUploading(false)}
          onProgress={setUploadProgress}
          onError={(error) => {
            toast({
              variant: "destructive",
              title: "Upload Error",
              description: error,
            });
          }}
        />
        {isImageUploading && (
          <div className="mt-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
        {image && !isImageUploading && (
          <div className="mt-4">
            <Image 
              src={image} 
              alt="Preview" 
              width={400} 
              height={200} 
              className="rounded-lg object-cover w-full h-48"
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="isOnline" 
          checked={isOnline} 
          onCheckedChange={() => setIsOnline(!isOnline)} 
        />
        <Label htmlFor="isOnline">Online Event</Label>
      </div>

      {!isOnline && (
        <div>
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </div>
      )}

      <div>
        <Label htmlFor="dateTime">Date and Time</Label>
        <Input 
          id="dateTime" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          type="datetime-local" 
          required 
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="isPublic" 
          checked={isPublic} 
          onCheckedChange={() => setIsPublic(!isPublic)} 
        />
        <Label htmlFor="isPublic">Public Event</Label>
      </div>

      {!isPublic && (
        <div>
          <Label htmlFor="eventPin">Event PIN</Label>
          <Input 
            id="eventPin" 
            value={eventPin} 
            onChange={(e) => setEventPin(e.target.value)} 
            required 
            placeholder="Enter access PIN for private event"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch 
          id="limitedParticipants" 
          checked={limitedParticipants} 
          onCheckedChange={() => setLimitedParticipants(!limitedParticipants)} 
        />
        <Label htmlFor="limitedParticipants">Limit Participants</Label>
      </div>

      {limitedParticipants && (
        <div>
          <Label htmlFor="maxParticipants">Maximum Participants</Label>
          <Input 
            id="maxParticipants" 
            type="number" 
            min="1" 
            value={maxParticipants} 
            onChange={(e) => setMaxParticipants(Number(e.target.value))} 
            required 
          />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex space-x-4">
        <Button 
          type="submit" 
          disabled={isLoading || isImageUploading}
          className="relative"
        >
          {isLoading ? "Creating..." : "Create Event"}
          {isImageUploading && (
            <span className="ml-2 text-xs">
              (Waiting for image upload...)
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}