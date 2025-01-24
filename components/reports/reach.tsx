"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { date: "2024-04-01", Event: 222, Team: 150 },
  { date: "2024-04-02", Event: 97, Team: 180 },
  { date: "2024-04-03", Event: 167, Team: 120 },
  { date: "2024-04-04", Event: 242, Team: 260 },
  { date: "2024-04-05", Event: 373, Team: 290 },
  { date: "2024-04-06", Event: 301, Team: 340 },
  { date: "2024-04-07", Event: 245, Team: 180 },
  { date: "2024-04-08", Event: 409, Team: 320 },
  { date: "2024-04-09", Event: 59, Team: 110 },
  { date: "2024-04-10", Event: 261, Team: 190 },
  { date: "2024-04-11", Event: 327, Team: 350 },
  { date: "2024-04-12", Event: 292, Team: 210 },
  { date: "2024-04-13", Event: 342, Team: 380 },
  { date: "2024-04-14", Event: 137, Team: 220 },
  { date: "2024-04-15", Event: 120, Team: 170 },
  { date: "2024-04-16", Event: 138, Team: 190 },
  { date: "2024-04-17", Event: 446, Team: 360 },
  { date: "2024-04-18", Event: 364, Team: 410 },
  { date: "2024-04-19", Event: 243, Team: 180 },
  { date: "2024-04-20", Event: 89, Team: 150 },
  { date: "2024-04-21", Event: 137, Team: 200 },
  { date: "2024-04-22", Event: 224, Team: 170 },
  { date: "2024-04-23", Event: 138, Team: 230 },
  { date: "2024-04-24", Event: 387, Team: 290 },
  { date: "2024-04-25", Event: 215, Team: 250 },
  { date: "2024-04-26", Event: 75, Team: 130 },
  { date: "2024-04-27", Event: 383, Team: 420 },
  { date: "2024-04-28", Event: 122, Team: 180 },
  { date: "2024-04-29", Event: 315, Team: 240 },
  { date: "2024-04-30", Event: 454, Team: 380 },
  { date: "2024-05-01", Event: 165, Team: 220 },
  { date: "2024-05-02", Event: 293, Team: 310 },
  { date: "2024-05-03", Event: 247, Team: 190 },
  { date: "2024-05-04", Event: 385, Team: 420 },
  { date: "2024-05-05", Event: 481, Team: 390 },
  { date: "2024-05-06", Event: 498, Team: 520 },
  { date: "2024-05-07", Event: 388, Team: 300 },
  { date: "2024-05-08", Event: 149, Team: 210 },
  { date: "2024-05-09", Event: 227, Team: 180 },
  { date: "2024-05-10", Event: 293, Team: 330 },
  { date: "2024-05-11", Event: 335, Team: 270 },
  { date: "2024-05-12", Event: 197, Team: 240 },
  { date: "2024-05-13", Event: 197, Team: 160 },
  { date: "2024-05-14", Event: 448, Team: 490 },
  { date: "2024-05-15", Event: 473, Team: 380 },
  { date: "2024-05-16", Event: 338, Team: 400 },
  { date: "2024-05-17", Event: 499, Team: 420 },
  { date: "2024-05-18", Event: 315, Team: 350 },
  { date: "2024-05-19", Event: 235, Team: 180 },
  { date: "2024-05-20", Event: 177, Team: 230 },
  { date: "2024-05-21", Event: 82, Team: 140 },
  { date: "2024-05-22", Event: 81, Team: 120 },
  { date: "2024-05-23", Event: 252, Team: 290 },
  { date: "2024-05-24", Event: 294, Team: 220 },
  { date: "2024-05-25", Event: 201, Team: 250 },
  { date: "2024-05-26", Event: 213, Team: 170 },
  { date: "2024-05-27", Event: 420, Team: 460 },
  { date: "2024-05-28", Event: 233, Team: 190 },
  { date: "2024-05-29", Event: 78, Team: 130 },
  { date: "2024-05-30", Event: 340, Team: 280 },
  { date: "2024-05-31", Event: 178, Team: 230 },
  { date: "2024-06-01", Event: 178, Team: 200 },
  { date: "2024-06-02", Event: 470, Team: 410 },
  { date: "2024-06-03", Event: 103, Team: 160 },
  { date: "2024-06-04", Event: 439, Team: 380 },
  { date: "2024-06-05", Event: 88, Team: 140 },
  { date: "2024-06-06", Event: 294, Team: 250 },
  { date: "2024-06-07", Event: 323, Team: 370 },
  { date: "2024-06-08", Event: 385, Team: 320 },
  { date: "2024-06-09", Event: 438, Team: 480 },
  { date: "2024-06-10", Event: 155, Team: 200 },
  { date: "2024-06-11", Event: 92, Team: 150 },
  { date: "2024-06-12", Event: 492, Team: 420 },
  { date: "2024-06-13", Event: 81, Team: 130 },
  { date: "2024-06-14", Event: 426, Team: 380 },
  { date: "2024-06-15", Event: 307, Team: 350 },
  { date: "2024-06-16", Event: 371, Team: 310 },
  { date: "2024-06-17", Event: 475, Team: 520 },
  { date: "2024-06-18", Event: 107, Team: 170 },
  { date: "2024-06-19", Event: 341, Team: 290 },
  { date: "2024-06-20", Event: 408, Team: 450 },
  { date: "2024-06-21", Event: 169, Team: 210 },
  { date: "2024-06-22", Event: 317, Team: 270 },
  { date: "2024-06-23", Event: 480, Team: 530 },
  { date: "2024-06-24", Event: 132, Team: 180 },
  { date: "2024-06-25", Event: 141, Team: 190 },
  { date: "2024-06-26", Event: 434, Team: 380 },
  { date: "2024-06-27", Event: 448, Team: 490 },
  { date: "2024-06-28", Event: 149, Team: 200 },
  { date: "2024-06-29", Event: 103, Team: 160 },
  { date: "2024-06-30", Event: 446, Team: 400 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  Event: {
    label: "Event",
    color: "hsl(var(--chart-1))",
  },
  Team: {
    label: "Team",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Team_Event_Reach() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("Event")

  const total = React.useMemo(
    () => ({
      Event: chartData.reduce((acc, curr) => acc + curr.Event, 0),
      Team: chartData.reduce((acc, curr) => acc + curr.Team, 0),
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Team And Event Reach</CardTitle>
          <CardDescription>
            Showing total Reach In last selected Date
          </CardDescription>
        </div>
        <div className="flex">
          {["Event", "Team"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
