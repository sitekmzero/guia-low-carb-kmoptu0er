DO $$
BEGIN
  -- CRM Tables
  CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    lead_source TEXT,
    lead_status TEXT DEFAULT 'new',
    lead_score INTEGER DEFAULT 0,
    interest_level TEXT,
    product_interest TEXT[],
    notes TEXT,
    last_contacted TIMESTAMPTZ,
    next_followup TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.crm_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL,
    interaction_date TIMESTAMPTZ DEFAULT NOW(),
    duration_minutes INTEGER,
    notes TEXT,
    outcome TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.crm_pipeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    stage TEXT NOT NULL,
    stage_entered_date TIMESTAMPTZ DEFAULT NOW(),
    days_in_stage INTEGER DEFAULT 0,
    expected_close_date TIMESTAMPTZ,
    deal_value NUMERIC(12,2),
    probability INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.crm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    task_type TEXT NOT NULL,
    task_description TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending',
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS public.lead_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMPTZ DEFAULT NOW(),
    total_leads INTEGER DEFAULT 0,
    new_leads INTEGER DEFAULT 0,
    qualified_leads INTEGER DEFAULT 0,
    converted_leads INTEGER DEFAULT 0,
    conversion_rate NUMERIC(5,2) DEFAULT 0,
    average_lead_score NUMERIC(5,2) DEFAULT 0,
    average_days_to_conversion INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Progress Tracking & Downloads
  CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    time_spent_minutes INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.download_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    download_date TIMESTAMPTZ DEFAULT NOW(),
    file_size INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Reports
  CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type TEXT NOT NULL,
    report_name TEXT NOT NULL,
    schedule TEXT NOT NULL,
    last_generated TIMESTAMPTZ,
    next_scheduled TIMESTAMPTZ,
    recipients TEXT[],
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.report_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    sent_date TIMESTAMPTZ DEFAULT NOW(),
    delivery_status TEXT DEFAULT 'sent',
    open_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

END $$;

-- RLS
DO $$
BEGIN
  -- Enable RLS
  ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.crm_pipeline ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.lead_analytics ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.download_history ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.report_deliveries ENABLE ROW LEVEL SECURITY;

  -- crm_leads
  DROP POLICY IF EXISTS "admin_all_crm_leads" ON public.crm_leads;
  CREATE POLICY "admin_all_crm_leads" ON public.crm_leads
    FOR ALL TO authenticated USING (is_admin());

  -- crm_interactions
  DROP POLICY IF EXISTS "admin_all_crm_interactions" ON public.crm_interactions;
  CREATE POLICY "admin_all_crm_interactions" ON public.crm_interactions
    FOR ALL TO authenticated USING (is_admin());

  -- crm_pipeline
  DROP POLICY IF EXISTS "admin_all_crm_pipeline" ON public.crm_pipeline;
  CREATE POLICY "admin_all_crm_pipeline" ON public.crm_pipeline
    FOR ALL TO authenticated USING (is_admin());

  -- crm_tasks
  DROP POLICY IF EXISTS "admin_all_crm_tasks" ON public.crm_tasks;
  CREATE POLICY "admin_all_crm_tasks" ON public.crm_tasks
    FOR ALL TO authenticated USING (is_admin());

  -- lead_analytics
  DROP POLICY IF EXISTS "admin_all_lead_analytics" ON public.lead_analytics;
  CREATE POLICY "admin_all_lead_analytics" ON public.lead_analytics
    FOR ALL TO authenticated USING (is_admin());

  -- user_progress
  DROP POLICY IF EXISTS "user_own_progress" ON public.user_progress;
  CREATE POLICY "user_own_progress" ON public.user_progress
    FOR ALL TO authenticated USING (user_id = auth.uid());

  -- download_history
  DROP POLICY IF EXISTS "user_own_downloads" ON public.download_history;
  CREATE POLICY "user_own_downloads" ON public.download_history
    FOR ALL TO authenticated USING (user_id = auth.uid());

  -- reports
  DROP POLICY IF EXISTS "admin_all_reports" ON public.reports;
  CREATE POLICY "admin_all_reports" ON public.reports
    FOR ALL TO authenticated USING (is_admin());

  -- report_deliveries
  DROP POLICY IF EXISTS "admin_all_report_deliveries" ON public.report_deliveries;
  CREATE POLICY "admin_all_report_deliveries" ON public.report_deliveries
    FOR ALL TO authenticated USING (is_admin());

END $$;
