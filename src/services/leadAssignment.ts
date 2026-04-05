import { supabase } from '@/lib/supabase/client'

export const assignLeadToTeam = async (leadId: string, leadScore: number) => {
  // Logic to assign based on score
  const assignedTo = leadScore >= 60 ? 'Adriana Araújo' : 'Equipe Comercial SDR'

  try {
    // Create assignment task
    await supabase.from('crm_tasks').insert({
      lead_id: leadId,
      task_type: 'follow-up',
      task_description: `Follow-up estratégico com lead de pontuação ${leadScore}`,
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // next day
      assigned_to: assignedTo,
      status: 'pending',
    })
  } catch (error) {
    console.error('Error assigning lead:', error)
  }

  return { assignedTo }
}
