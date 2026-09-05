// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      ai_image_generations: {
        Row: {
          created_at: string
          id: string
          image_url: string
          metadata: Json | null
          prompt: string
          user_email: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          metadata?: Json | null
          prompt: string
          user_email?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          metadata?: Json | null
          prompt?: string
          user_email?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          status: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          status?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          status?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          compliance_passed: boolean | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          focus_keyword: string | null
          id: string
          image_alt: string | null
          image_is_ai: boolean | null
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          published_date: string | null
          reading_time_minutes: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          compliance_passed?: boolean | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          focus_keyword?: string | null
          id?: string
          image_alt?: string | null
          image_is_ai?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_date?: string | null
          reading_time_minutes?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          compliance_passed?: boolean | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          focus_keyword?: string | null
          id?: string
          image_alt?: string | null
          image_is_ai?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_date?: string | null
          reading_time_minutes?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      channel_tracking: {
        Row: {
          campaign: string | null
          content: string | null
          conversion_value: number | null
          created_at: string
          event_name: string
          id: string
          medium: string | null
          metadata: Json | null
          page_path: string | null
          source: string | null
          term: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          campaign?: string | null
          content?: string | null
          conversion_value?: number | null
          created_at?: string
          event_name?: string
          id?: string
          medium?: string | null
          metadata?: Json | null
          page_path?: string | null
          source?: string | null
          term?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          campaign?: string | null
          content?: string | null
          conversion_value?: number | null
          created_at?: string
          event_name?: string
          id?: string
          medium?: string | null
          metadata?: Json | null
          page_path?: string | null
          source?: string | null
          term?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      consultations: {
        Row: {
          consultation_type: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          zoom_link: string | null
        }
        Insert: {
          consultation_type?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zoom_link?: string | null
        }
        Update: {
          consultation_type?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zoom_link?: string | null
        }
        Relationships: []
      }
      crm_interactions: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          interaction_date: string | null
          interaction_type: string
          lead_id: string | null
          notes: string | null
          outcome: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          interaction_date?: string | null
          interaction_type: string
          lead_id?: string | null
          notes?: string | null
          outcome?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          interaction_date?: string | null
          interaction_type?: string
          lead_id?: string | null
          notes?: string | null
          outcome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'crm_interactions_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'crm_leads'
            referencedColumns: ['id']
          },
        ]
      }
      crm_leads: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          interest_level: string | null
          last_contacted: string | null
          lead_score: number | null
          lead_source: string | null
          lead_status: string | null
          name: string
          next_followup: string | null
          notes: string | null
          phone: string | null
          product_interest: string[] | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          interest_level?: string | null
          last_contacted?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_status?: string | null
          name: string
          next_followup?: string | null
          notes?: string | null
          phone?: string | null
          product_interest?: string[] | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          interest_level?: string | null
          last_contacted?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_status?: string | null
          name?: string
          next_followup?: string | null
          notes?: string | null
          phone?: string | null
          product_interest?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crm_pipeline: {
        Row: {
          created_at: string | null
          days_in_stage: number | null
          deal_value: number | null
          expected_close_date: string | null
          id: string
          lead_id: string | null
          probability: number | null
          stage: string
          stage_entered_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_in_stage?: number | null
          deal_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          probability?: number | null
          stage: string
          stage_entered_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_in_stage?: number | null
          deal_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          probability?: number | null
          stage?: string
          stage_entered_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'crm_pipeline_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'crm_leads'
            referencedColumns: ['id']
          },
        ]
      }
      crm_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          due_date: string
          id: string
          lead_id: string | null
          status: string | null
          task_description: string
          task_type: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          due_date: string
          id?: string
          lead_id?: string | null
          status?: string | null
          task_description: string
          task_type: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          due_date?: string
          id?: string
          lead_id?: string | null
          status?: string | null
          task_description?: string
          task_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'crm_tasks_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'crm_leads'
            referencedColumns: ['id']
          },
        ]
      }
      download_history: {
        Row: {
          created_at: string | null
          download_date: string | null
          file_size: number | null
          id: string
          product_id: string | null
          product_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          download_date?: string | null
          file_size?: number | null
          id?: string
          product_id?: string | null
          product_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          download_date?: string | null
          file_size?: number | null
          id?: string
          product_id?: string | null
          product_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'download_history_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      drive_arquivos: {
        Row: {
          caminho_pasta: string | null
          created_at: string
          file_id: string
          id: string
          link_drive: string | null
          mime_type: string
          modified_time: string | null
          nome: string
          status: string
          tamanho_bytes: number | null
          texto_extraido: string | null
          updated_at: string
        }
        Insert: {
          caminho_pasta?: string | null
          created_at?: string
          file_id: string
          id?: string
          link_drive?: string | null
          mime_type: string
          modified_time?: string | null
          nome: string
          status?: string
          tamanho_bytes?: number | null
          texto_extraido?: string | null
          updated_at?: string
        }
        Update: {
          caminho_pasta?: string | null
          created_at?: string
          file_id?: string
          id?: string
          link_drive?: string | null
          mime_type?: string
          modified_time?: string | null
          nome?: string
          status?: string
          tamanho_bytes?: number | null
          texto_extraido?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          is_free: boolean | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_free?: boolean | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_free?: boolean | null
          title?: string
        }
        Relationships: []
      }
      email_subscriptions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          subscribed_at: string | null
          subscription_status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          subscribed_at?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          subscribed_at?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      lead_analytics: {
        Row: {
          average_days_to_conversion: number | null
          average_lead_score: number | null
          conversion_rate: number | null
          converted_leads: number | null
          created_at: string | null
          date: string | null
          id: string
          new_leads: number | null
          qualified_leads: number | null
          total_leads: number | null
        }
        Insert: {
          average_days_to_conversion?: number | null
          average_lead_score?: number | null
          conversion_rate?: number | null
          converted_leads?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          new_leads?: number | null
          qualified_leads?: number | null
          total_leads?: number | null
        }
        Update: {
          average_days_to_conversion?: number | null
          average_lead_score?: number | null
          conversion_rate?: number | null
          converted_leads?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          new_leads?: number | null
          qualified_leads?: number | null
          total_leads?: number | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          lead_source: string | null
          lead_status: string | null
          name: string
          notes: string | null
          phone: string | null
          product_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          lead_source?: string | null
          lead_status?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          product_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          lead_source?: string | null
          lead_status?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          product_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads_cursos: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      leads_seguros: {
        Row: {
          created_at: string
          email: string
          id: string
          interest: string | null
          name: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interest?: string | null
          name: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interest?: string | null
          name?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      meta_webhook_events: {
        Row: {
          created_at: string
          event_type: string | null
          id: string
          payload: Json
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          id?: string
          payload?: Json
        }
        Update: {
          created_at?: string
          event_type?: string | null
          id?: string
          payload?: Json
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          author?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          estimated_price: number | null
          file_url: string | null
          hotmart_id: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number | null
          product_type: string | null
          status: string | null
          stripe_product_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          estimated_price?: number | null
          file_url?: string | null
          hotmart_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price?: number | null
          product_type?: string | null
          status?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          estimated_price?: number | null
          file_url?: string | null
          hotmart_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number | null
          product_type?: string | null
          status?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          id: string
          payment_method: string | null
          product_id: string | null
          purchased_at: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          product_id?: string | null
          purchased_at?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          product_id?: string | null
          purchased_at?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'purchases_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      report_deliveries: {
        Row: {
          created_at: string | null
          delivery_status: string | null
          id: string
          open_date: string | null
          recipient_email: string
          report_id: string | null
          sent_date: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          open_date?: string | null
          recipient_email: string
          report_id?: string | null
          sent_date?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          open_date?: string | null
          recipient_email?: string
          report_id?: string | null
          sent_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'report_deliveries_report_id_fkey'
            columns: ['report_id']
            isOneToOne: false
            referencedRelation: 'reports'
            referencedColumns: ['id']
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          id: string
          last_generated: string | null
          next_scheduled: string | null
          recipients: string[] | null
          report_name: string
          report_type: string
          schedule: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_generated?: string | null
          next_scheduled?: string | null
          recipients?: string[] | null
          report_name: string
          report_type: string
          schedule: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_generated?: string | null
          next_scheduled?: string | null
          recipients?: string[] | null
          report_name?: string
          report_type?: string
          schedule?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          value?: Json
        }
        Relationships: []
      }
      user_courses: {
        Row: {
          access_until: string | null
          course_id: string | null
          created_at: string | null
          enrolled_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_until?: string | null
          course_id?: string | null
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_until?: string | null
          course_id?: string | null
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_courses_course_id_fkey'
            columns: ['course_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          email: string
          id: string
          marketing: boolean
          newsletter: boolean
          updated_at: string
          whatsapp: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          marketing?: boolean
          newsletter?: boolean
          updated_at?: string
          whatsapp?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          marketing?: boolean
          newsletter?: boolean
          updated_at?: string
          whatsapp?: boolean
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completion_percentage: number | null
          course_id: string | null
          created_at: string | null
          id: string
          last_accessed: string | null
          module_id: string
          time_spent_minutes: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completion_percentage?: number | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          module_id: string
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completion_percentage?: number | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          module_id?: string
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_progress_course_id_fkey'
            columns: ['course_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      vendas: {
        Row: {
          amount: number
          buyer_email: string | null
          created_at: string
          id: string
          product_name: string
          status: string
        }
        Insert: {
          amount: number
          buyer_email?: string | null
          created_at?: string
          id?: string
          product_name: string
          status?: string
        }
        Update: {
          amount?: number
          buyer_email?: string | null
          created_at?: string
          id?: string
          product_name?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_blog_view: { Args: { post_slug: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
