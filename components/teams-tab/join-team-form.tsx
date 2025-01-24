"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface JoinTeamFormProps {
  onBack: () => void
}

export default function JoinTeamForm({ onBack }: JoinTeamFormProps) {
  const [teamId, setTeamId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle joining team here
    console.log("Joining team with ID:", teamId)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="team-id">Team ID</Label>
        <Input id="team-id" value={teamId} onChange={(e) => setTeamId(e.target.value)} required />
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Join Team</Button>
      </div>
    </form>
  )
}

