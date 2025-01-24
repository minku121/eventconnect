import { Button } from "@/components/ui/button"

interface ViewAllTeamsProps {
  onBack: () => void
}

export default function ViewAllTeams({ onBack }: ViewAllTeamsProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">All Teams</h3>
      <p>This is where you would display a list of all teams.</p>
      <Button onClick={onBack} className="mt-4">
        Back
      </Button>
    </div>
  )
}

