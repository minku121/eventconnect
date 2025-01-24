"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TeamTypeFields from "./team-type-fields"

interface CreateTeamFormProps {
  onBack: () => void
}

export default function CreateTeamForm({ onBack }: CreateTeamFormProps) {
  const [leagueName, setLeagueName] = useState("")
  const [isPublic, setIsPublic] = useState("public")
  const [leagueType, setLeagueType] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ leagueName, isPublic, leagueType })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="league-name">League/Tournament Name</Label>
        <Input id="league-name" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} required />
      </div>

      <RadioGroup value={isPublic} onValueChange={setIsPublic}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id="public" />
          <Label htmlFor="public">Public</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="private" id="private" />
          <Label htmlFor="private">Private</Label>
        </div>
      </RadioGroup>

      <div>
        <Label htmlFor="league-type">League Type</Label>
        <Select value={leagueType} onValueChange={setLeagueType}>
          <SelectTrigger>
            <SelectValue placeholder="Select league type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cricket">Cricket</SelectItem>
            <SelectItem value="football">Football</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {leagueType && <TeamTypeFields leagueType={leagueType} />}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Create Team</Button>
      </div>
    </form>
  )
}

