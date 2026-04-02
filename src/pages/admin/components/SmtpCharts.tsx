import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from 'recharts'
import { BarChart3 } from 'lucide-react'

const MOCK_DATA_LINE = [
  { date: '01/04', sent: 120, opened: 80 },
  { date: '02/04', sent: 150, opened: 90 },
  { date: '03/04', sent: 180, opened: 110 },
  { date: '04/04', sent: 140, opened: 85 },
  { date: '05/04', sent: 200, opened: 130 },
  { date: '06/04', sent: 250, opened: 160 },
  { date: '07/04', sent: 220, opened: 145 },
]

const MOCK_DATA_BAR = [
  { name: 'Welcome', rate: 85 },
  { name: 'Purchase', rate: 92 },
  { name: 'Consultation', rate: 78 },
  { name: 'Newsletter', rate: 45 },
]

export function SmtpMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Métricas de Entrega
        </CardTitle>
        <CardDescription>Performance de e-mails nos últimos 30 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-center">E-mails Enviados vs Abertos</h4>
            <div className="h-[250px]">
              <ChartContainer
                config={{
                  sent: { label: 'Enviados', color: 'hsl(var(--primary))' },
                  opened: { label: 'Abertos', color: '#10b981' },
                }}
              >
                <LineChart data={MOCK_DATA_LINE} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="var(--color-sent)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="opened"
                    stroke="var(--color-opened)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-center">Taxa de Abertura por Template (%)</h4>
            <div className="h-[250px]">
              <ChartContainer
                config={{ rate: { label: 'Taxa (%)', color: 'hsl(var(--primary))' } }}
              >
                <BarChart data={MOCK_DATA_BAR} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="rate" fill="var(--color-rate)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Total Enviados</p>
            <p className="text-2xl font-bold">1,260</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Taxa de Entrega</p>
            <p className="text-2xl font-bold text-green-600">98.5%</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Taxa de Abertura</p>
            <p className="text-2xl font-bold text-blue-600">65.2%</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Taxa de Clique</p>
            <p className="text-2xl font-bold text-purple-600">22.8%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
