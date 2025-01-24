"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Team {
  name: string
  playerCount: number
  logo: string
}

interface TeamTypeFieldsProps {
  leagueType: string
}

export default function TeamTypeFields({ leagueType }: TeamTypeFieldsProps) {
  const [teams, setTeams] = useState<Team[]>(
    leagueType === "cricket" || leagueType === "football"
      ? [
          { name: "", playerCount: 11, logo: "" },
          { name: "", playerCount: 11, logo: "" },
        ]
      : [],
  )

  const handleTeamChange = (index: number, field: keyof Team, value: string | number) => {
    const newTeams = [...teams]
    newTeams[index] = { ...newTeams[index], [field]: value }
    setTeams(newTeams)
  }

  const addTeam = () => {
    setTeams([...teams, { name: "", playerCount: 1, logo: "" }])
  }

  const removeTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {teams.map((team, index) => (
        <div key={index} className="space-y-4 p-4 border rounded">
          <div>
            <Label htmlFor={`team-name-${index}`}>Team Name</Label>
            <Input
              id={`team-name-${index}`}
              value={team.name}
              onChange={(e) => handleTeamChange(index, "name", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor={`player-count-${index}`}>Number of Players</Label>
            <Input
              id={`player-count-${index}`}
              type="number"
              min="1"
              value={team.playerCount}
              onChange={(e) => handleTeamChange(index, "playerCount", Number.parseInt(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor={`team-logo-${index}`}>Team Logo URL</Label>
            <Input
              id={`team-logo-${index}`}
              type="url"
              value={team.logo}
              onChange={(e) => handleTeamChange(index, "logo", e.target.value)}
            />
          </div>
          {leagueType === "custom" && (
            <Button type="button" variant="destructive" onClick={() => removeTeam(index)}>
              Remove Team
            </Button>
          )}
        </div>
      ))}
      {leagueType === "custom" && (
        <Button type="button" onClick={addTeam}>
          Add Team
        </Button>
      )}
    </div>
  )
}

