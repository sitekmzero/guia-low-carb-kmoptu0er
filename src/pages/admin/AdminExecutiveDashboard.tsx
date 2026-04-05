import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'

const revenueData = [
  { name: 'Sem 1', value: 4000 },
  { name: 'Sem 2', value: 3000 },
  { name: 'Sem 3', value: 2000 },
  { name: 'Sem 4', value: 2780 },
]

export default function AdminExecutiveDashboard() {
  const [date] = useState(
    new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  )

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Dashboard Executivo</h1>
          <p className="text-muted-foreground capitalize">{date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Receita (30 dias)</p>
                <p className="text-3xl font-bold">R$ 24.500</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">+12.5%</span>
              <span className="text-muted-foreground ml-2">vs último mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Novos Clientes</p>
                <p className="text-3xl font-bold">+145</p>
              </div>
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Users className="h-5 w-5 text-secondary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">+8.2%</span>
              <span className="text-muted-foreground ml-2">vs último mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-3xl font-bold">R$ 168,90</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowDownRight className="h-4 w-4 text-rose-500 mr-1" />
              <span className="text-rose-500 font-medium">-2.4%</span>
              <span className="text-muted-foreground ml-2">vs último mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
                <p className="text-3xl font-bold">3.8%</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">+1.1%</span>
              <span className="text-muted-foreground ml-2">vs último mês</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { color: 'hsl(var(--primary))' } }}
              className="h-[300px] w-full"
            >
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(val) => `R${val}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { color: 'hsl(var(--secondary))' } }}
              className="h-[300px] w-full"
            >
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={3} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
