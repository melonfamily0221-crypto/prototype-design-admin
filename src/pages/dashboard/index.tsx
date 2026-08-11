import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartData = [
  { date: "4月7日", desktop: 120, mobile: 80 },
  { date: "4月9日", desktop: 250, mobile: 100 },
  { date: "4月11日", desktop: 180, mobile: 90 },
  { date: "4月13日", desktop: 300, mobile: 150 },
  { date: "4月15日", desktop: 200, mobile: 110 },
  { date: "4月17日", desktop: 450, mobile: 180 },
  { date: "4月19日", desktop: 280, mobile: 130 },
  { date: "4月21日", desktop: 350, mobile: 160 },
  { date: "4月23日", desktop: 320, mobile: 140 },
  { date: "4月26日", desktop: 500, mobile: 200 },
  { date: "4月29日", desktop: 380, mobile: 170 },
  { date: "5月2日", desktop: 550, mobile: 280 },
  { date: "5月5日", desktop: 420, mobile: 200 },
  { date: "5月8日", desktop: 350, mobile: 180 },
  { date: "5月11日", desktop: 480, mobile: 250 },
  { date: "5月14日", desktop: 500, mobile: 320 },
  { date: "5月17日", desktop: 400, mobile: 210 },
  { date: "5月21日", desktop: 380, mobile: 180 },
  { date: "5月24日", desktop: 520, mobile: 280 },
  { date: "5月28日", desktop: 600, mobile: 350 },
  { date: "5月31日", desktop: 450, mobile: 260 },
  { date: "6月3日", desktop: 550, mobile: 300 },
  { date: "6月6日", desktop: 680, mobile: 380 },
  { date: "6月9日", desktop: 700, mobile: 400 },
  { date: "6月12日", desktop: 580, mobile: 320 },
  { date: "6月15日", desktop: 650, mobile: 350 },
  { date: "6月18日", desktop: 720, mobile: 410 },
  { date: "6月22日", desktop: 800, mobile: 450 },
  { date: "6月26日", desktop: 680, mobile: 380 },
  { date: "6月30日", desktop: 750, mobile: 400 },
]

const chartConfig = {
  desktop: {
    label: "桌面端",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "移动端",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("3m")

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 overflow-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总收入</CardTitle>
            <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">¥12,500.00</div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center text-sm font-medium leading-none text-foreground">
                本月呈上升趋势 <TrendingUp className="ml-1 h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                过去 6 个月总计
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">新客户</CardTitle>
            <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs font-medium">
              <TrendingDown className="h-3 w-3" />
              -20%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">1,234</div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center text-sm font-medium leading-none text-foreground">
                本周期下降 20% <TrendingDown className="ml-1 h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                获客情况需要关注
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">活跃账号</CardTitle>
            <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">45,678</div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center text-sm font-medium leading-none text-foreground">
                用户留存强劲 <TrendingUp className="ml-1 h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                互动量超预期指标
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">增长率</CardTitle>
            <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              +4.5%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">4.5%</div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center text-sm font-medium leading-none text-foreground">
                业绩稳步增长 <TrendingUp className="ml-1 h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">
                符合年度增长预期
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle className="text-xl">总访客数</CardTitle>
            <CardDescription className="text-base">
              过去 3 个月总计
            </CardDescription>
          </div>
          <div className="flex items-center px-6 py-4 sm:py-0">
            <div className="flex items-center rounded-md border p-1 shadow-sm">
              <button
                onClick={() => setTimeFilter("3m")}
                className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                  timeFilter === "3m" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                最近 3 个月
              </button>
              <button
                onClick={() => setTimeFilter("30d")}
                className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                  timeFilter === "30d" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                最近 30 天
              </button>
              <button
                onClick={() => setTimeFilter("7d")}
                className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                  timeFilter === "7d" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                最近 7 天
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[400px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={24}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                fillOpacity={0.4}
                stroke="var(--color-mobile)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}