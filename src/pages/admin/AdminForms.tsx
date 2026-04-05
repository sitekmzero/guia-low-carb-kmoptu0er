import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PlusCircle, MousePointerClick, Eye, Users } from 'lucide-react'

export default function AdminForms() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Captura & Pop-ups</h1>
          <p className="text-muted-foreground">
            Gerencie seus formulários progressivos e pop-ups inteligentes.
          </p>
        </div>
        <Button className="bg-primary">
          <PlusCircle className="w-4 h-4 mr-2" /> Novo Formulário
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Eye className="w-4 h-4 mr-2 text-primary" /> Visualizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12.450</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MousePointerClick className="w-4 h-4 mr-2 text-secondary" /> Interações (Stage 1)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1.820</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-4 h-4 mr-2 text-emerald-600" /> Leads Capturados (Final)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">840</p>
            <p className="text-xs text-muted-foreground">Conv. Rate: 6.7%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulários Ativos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo (Trigger)</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Pop-up Exit Intent (Blog)</TableCell>
                <TableCell>Exit-Intent</TableCell>
                <TableCell>4,200</TableCell>
                <TableCell>210 (5%)</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Formulário In-Page (E-books)</TableCell>
                <TableCell>Embedded</TableCell>
                <TableCell>8,100</TableCell>
                <TableCell>630 (7.7%)</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
