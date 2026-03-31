import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export default function AdminSettings() {
  const [colors, setColors] = useState({ primary: '#1CA67D', secondary: '#F7941D' })

  useEffect(() => {
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'theme')
      .single()
      .then(({ data }) => {
        if (data?.value) setColors(data.value as any)
      })
  }, [])

  const saveSettings = async () => {
    await supabase.from('settings').upsert({ key: 'theme', value: colors })
    toast({ title: 'Configurações salvas' })
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <h1 className="text-3xl font-bold font-heading text-primary">Tema e Aparência</h1>

      <div className="bg-card p-6 rounded-xl border space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Cor Principal (Hex)</label>
          <div className="flex gap-4">
            <Input
              value={colors.primary}
              onChange={(e) => setColors((c) => ({ ...c, primary: e.target.value }))}
            />
            <div
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: colors.primary }}
            ></div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Cor Secundária (Hex)</label>
          <div className="flex gap-4">
            <Input
              value={colors.secondary}
              onChange={(e) => setColors((c) => ({ ...c, secondary: e.target.value }))}
            />
            <div
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: colors.secondary }}
            ></div>
          </div>
        </div>

        <Button onClick={saveSettings} className="bg-primary">
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
