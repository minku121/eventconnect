import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Tournament {
  id: string
  name: string
  type: string
  teamCount: number
}

const mockTournaments: Tournament[] = [
  { id: "1", name: "Summer Cricket League", type: "Cricket", teamCount: 8 },
  { id: "2", name: "City Football Cup", type: "Football", teamCount: 16 },
  { id: "3", name: "Mixed Sports Festival", type: "Custom", teamCount: 12 },
]

export default function PublicTournaments() {
  return (
    <div>
      <h3 className="text-xl text-center font-semibold mb-4">Public Tournaments</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockTournaments.map((tournament) => (
          <Card key={tournament.id}>
            <CardHeader>
              <CardTitle>{tournament.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Type: {tournament.type}</p>
              <p>Teams: {tournament.teamCount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

