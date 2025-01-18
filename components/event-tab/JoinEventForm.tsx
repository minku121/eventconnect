import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface JoinEventFormProps {
  onClose: () => void
}

export default function JoinEventForm({ onClose }: JoinEventFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold mb-4">Join Event</h2>
      
      <div>
        <Label htmlFor="eventId">Event ID</Label>
        <Input id="eventId" required />
      </div>
      
      <div className="flex space-x-4">
        <Button type="submit" className="transition-all duration-200 ease-in-out hover:bg-primary-dark">Join Event</Button>
      </div>
    </form>
  )
}

