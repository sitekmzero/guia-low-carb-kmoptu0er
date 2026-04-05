// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      ab_tests: {
        Row: {
          active: boolean
          created_at: string
          id: string
          test_name: string
          variant_a_text: string
          variant_b_text: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          test_name: string
          variant_a_text: string
          variant_b_text: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          test_name?: string
          variant_a_text?: string
          variant_b_text?: string
        }
        Relationships: []
      }
      access_logs: {
        Row: {
          id: string
          ip_address: string | null
          login_attempt_time: string
          success: boolean
          user_email: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          login_attempt_time?: string
          success: boolean
          user_email: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          login_attempt_time?: string
          success?: boolean
          user_email?: string
        }
        Relationships: []
      }
      avaliacoes: {
        Row: {
          ativo: boolean
          avatar_url: string | null
          comentario: string
          created_at: string
          data_avaliacao: string
          id: string
          nome_cliente: string
          nota: number
          social_url: string | null
        }
        Insert: {
          ativo?: boolean
          avatar_url?: string | null
          comentario: string
          created_at?: string
          data_avaliacao: string
          id?: string
          nome_cliente: string
          nota: number
          social_url?: string | null
        }
        Update: {
          ativo?: boolean
          avatar_url?: string | null
          comentario?: string
          created_at?: string
          data_avaliacao?: string
          id?: string
          nome_cliente?: string
          nota?: number
          social_url?: string | null
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
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
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
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
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
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
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
      candidatos: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          resume_url: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          resume_url?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          resume_url?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
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
      conversion_events: {
        Row: {
          event_type: string
          id: string
          lead_id: string
          metadata: Json | null
          timestamp: string
        }
        Insert: {
          event_type: string
          id?: string
          lead_id: string
          metadata?: Json | null
          timestamp?: string
        }
        Update: {
          event_type?: string
          id?: string
          lead_id?: string
          metadata?: Json | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: 'conversion_events_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
      }
      corretora_config: {
        Row: {
          address: string | null
          aggilizador_integration: string | null
          cnpj: string | null
          color_blue: string | null
          color_gold: string | null
          contact_email: string | null
          id: string
          logo_url: string | null
          name: string | null
          phone: string | null
          resend_integration: string | null
          slack_integration: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          aggilizador_integration?: string | null
          cnpj?: string | null
          color_blue?: string | null
          color_gold?: string | null
          contact_email?: string | null
          id?: string
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          resend_integration?: string | null
          slack_integration?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          aggilizador_integration?: string | null
          cnpj?: string | null
          color_blue?: string | null
          color_gold?: string | null
          contact_email?: string | null
          id?: string
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          resend_integration?: string | null
          slack_integration?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cotacoes: {
        Row: {
          created_at: string
          detalhes: Json | null
          id: string
          lead_id: string
          quote_value: number | null
          status: string | null
        }
        Insert: {
          created_at?: string
          detalhes?: Json | null
          id?: string
          lead_id: string
          quote_value?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string
          detalhes?: Json | null
          id?: string
          lead_id?: string
          quote_value?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'cotacoes_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
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
      leads: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string
          gender: string | null
          id: string
          insurance_subtype: string | null
          lead_source: string | null
          lead_status: string | null
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          product_type: string
          profession: string | null
          status: string
          updated_at: string | null
          user_id: string | null
          variant_used: string | null
          vehicle_brand: string | null
          vehicle_model: string | null
          vehicle_plate: string | null
          vehicle_usage: string | null
          vehicle_year: string | null
          zip_code: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email: string
          gender?: string | null
          id?: string
          insurance_subtype?: string | null
          lead_source?: string | null
          lead_status?: string | null
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          product_type: string
          profession?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          variant_used?: string | null
          vehicle_brand?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_usage?: string | null
          vehicle_year?: string | null
          zip_code?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string
          gender?: string | null
          id?: string
          insurance_subtype?: string | null
          lead_source?: string | null
          lead_status?: string | null
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          product_type?: string
          profession?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          variant_used?: string | null
          vehicle_brand?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_usage?: string | null
          vehicle_year?: string | null
          zip_code?: string | null
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
          category: string
          created_at: string
          description: string
          estimated_price: number
          file_url: string | null
          hotmart_id: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number | null
          product_type: string | null
          status: string
          stripe_product_id: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          estimated_price: number
          file_url?: string | null
          hotmart_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price?: number | null
          product_type?: string | null
          status?: string
          stripe_product_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          estimated_price?: number
          file_url?: string | null
          hotmart_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number | null
          product_type?: string | null
          status?: string
          stripe_product_id?: string | null
          updated_at?: string
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
      reactivation_requests: {
        Row: {
          id: string
          request_date: string
          status: string
          user_email: string
        }
        Insert: {
          id?: string
          request_date?: string
          status?: string
          user_email: string
        }
        Update: {
          id?: string
          request_date?: string
          status?: string
          user_email?: string
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
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_admin: boolean
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          is_admin?: boolean
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_admin?: boolean
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
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

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: ab_tests
//   id: uuid (not null, default: gen_random_uuid())
//   test_name: text (not null)
//   variant_a_text: text (not null)
//   variant_b_text: text (not null)
//   active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
// Table: access_logs
//   id: uuid (not null, default: gen_random_uuid())
//   user_email: text (not null)
//   login_attempt_time: timestamp with time zone (not null, default: now())
//   success: boolean (not null)
//   ip_address: text (nullable)
// Table: avaliacoes
//   id: uuid (not null, default: gen_random_uuid())
//   nome_cliente: text (not null)
//   nota: integer (not null)
//   comentario: text (not null)
//   data_avaliacao: date (not null)
//   ativo: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   avatar_url: text (nullable)
//   social_url: text (nullable)
// Table: blog_categories
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   slug: text (not null)
//   description: text (nullable)
//   color: text (nullable)
//   icon: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: blog_posts
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   slug: text (not null)
//   excerpt: text (nullable)
//   content: text (nullable)
//   category: text (nullable)
//   tags: _text (nullable)
//   author: text (nullable)
//   featured_image_url: text (nullable)
//   published: boolean (nullable, default: false)
//   views: integer (nullable, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   published_date: timestamp with time zone (nullable, default: now())
//   reading_time_minutes: integer (nullable, default: 0)
// Table: candidatos
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   email: text (not null)
//   message: text (nullable)
//   resume_url: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: clients
//   id: uuid (not null)
//   email: text (not null)
//   name: text (not null)
//   status: text (not null, default: 'active'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: consultations
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   consultation_type: text (nullable)
//   scheduled_date: timestamp with time zone (nullable)
//   scheduled_time: text (nullable)
//   duration_minutes: integer (nullable, default: 60)
//   status: text (nullable)
//   notes: text (nullable)
//   zoom_link: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: conversion_events
//   id: uuid (not null, default: gen_random_uuid())
//   lead_id: uuid (not null)
//   event_type: text (not null)
//   timestamp: timestamp with time zone (not null, default: now())
//   metadata: jsonb (nullable)
// Table: corretora_config
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (nullable)
//   contact_email: text (nullable)
//   phone: text (nullable)
//   address: text (nullable)
//   cnpj: text (nullable)
//   logo_url: text (nullable)
//   color_gold: text (nullable, default: '#C8A24A'::text)
//   color_blue: text (nullable, default: '#0B1F3B'::text)
//   slack_integration: text (nullable)
//   resend_integration: text (nullable)
//   aggilizador_integration: text (nullable)
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: cotacoes
//   id: uuid (not null, default: gen_random_uuid())
//   lead_id: uuid (not null)
//   quote_value: numeric (nullable)
//   detalhes: jsonb (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   status: text (nullable, default: 'pending'::text)
// Table: ebooks
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   description: text (nullable)
//   file_url: text (nullable)
//   category: text (nullable)
//   is_free: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: email_subscriptions
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   email: text (not null)
//   name: text (nullable)
//   subscription_status: text (nullable)
//   subscribed_at: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: leads
//   id: uuid (not null, default: gen_random_uuid())
//   created_at: timestamp with time zone (not null, default: now())
//   name: text (not null)
//   email: text (not null)
//   phone: text (nullable)
//   product_type: text (not null)
//   message: text (nullable)
//   status: text (not null, default: 'novo'::text)
//   variant_used: text (nullable)
//   user_id: uuid (nullable)
//   insurance_subtype: text (nullable)
//   vehicle_brand: text (nullable)
//   vehicle_model: text (nullable)
//   vehicle_year: text (nullable)
//   vehicle_plate: text (nullable)
//   vehicle_usage: text (nullable)
//   birth_date: date (nullable)
//   zip_code: text (nullable)
//   gender: text (nullable)
//   profession: text (nullable)
//   lead_source: text (nullable)
//   lead_status: text (nullable, default: 'new'::text)
//   notes: text (nullable)
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: leads_cursos
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   email: text (not null)
//   whatsapp: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: leads_seguros
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   email: text (not null)
//   whatsapp: text (nullable)
//   interest: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: posts
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   content: text (not null)
//   category: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   author: text (nullable, default: 'Adriana'::text)
// Table: products
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (not null)
//   estimated_price: numeric (not null)
//   category: text (not null)
//   image_url: text (nullable)
//   status: text (not null, default: 'ativo'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   price: numeric (nullable)
//   product_type: text (nullable)
//   file_url: text (nullable)
//   hotmart_id: text (nullable)
//   stripe_product_id: text (nullable)
//   is_active: boolean (nullable, default: true)
// Table: purchases
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   product_id: uuid (nullable)
//   amount_paid: numeric (nullable)
//   payment_method: text (nullable)
//   transaction_id: text (nullable)
//   status: text (nullable)
//   purchased_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: reactivation_requests
//   id: uuid (not null, default: gen_random_uuid())
//   user_email: text (not null)
//   request_date: timestamp with time zone (not null, default: now())
//   status: text (not null, default: 'pending'::text)
// Table: settings
//   id: uuid (not null, default: gen_random_uuid())
//   key: text (not null)
//   value: jsonb (not null)
// Table: user_courses
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   course_id: uuid (nullable)
//   enrolled_at: timestamp with time zone (nullable, default: now())
//   access_until: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: user_profiles
//   id: uuid (not null)
//   full_name: text (not null)
//   avatar_url: text (nullable)
//   is_admin: boolean (not null, default: false)
//   email: text (nullable)
//   role: text (nullable, default: 'user'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: vendas
//   id: uuid (not null, default: gen_random_uuid())
//   product_name: text (not null)
//   amount: numeric (not null)
//   status: text (not null, default: 'pago'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   buyer_email: text (nullable)

// --- CONSTRAINTS ---
// Table: ab_tests
//   PRIMARY KEY ab_tests_pkey: PRIMARY KEY (id)
// Table: access_logs
//   PRIMARY KEY access_logs_pkey: PRIMARY KEY (id)
// Table: avaliacoes
//   CHECK avaliacoes_nota_check: CHECK (((nota >= 1) AND (nota <= 5)))
//   PRIMARY KEY avaliacoes_pkey: PRIMARY KEY (id)
// Table: blog_categories
//   UNIQUE blog_categories_name_key: UNIQUE (name)
//   PRIMARY KEY blog_categories_pkey: PRIMARY KEY (id)
//   UNIQUE blog_categories_slug_key: UNIQUE (slug)
// Table: blog_posts
//   PRIMARY KEY blog_posts_pkey: PRIMARY KEY (id)
//   UNIQUE blog_posts_slug_key: UNIQUE (slug)
// Table: candidatos
//   PRIMARY KEY candidatos_pkey: PRIMARY KEY (id)
// Table: clients
//   UNIQUE clients_email_key: UNIQUE (email)
//   PRIMARY KEY clients_pkey: PRIMARY KEY (id)
//   CHECK clients_status_check: CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'inactive'::text])))
// Table: consultations
//   CHECK consultations_consultation_type_check: CHECK ((consultation_type = ANY (ARRAY['nutrition'::text, 'protection'::text, 'bundle'::text])))
//   PRIMARY KEY consultations_pkey: PRIMARY KEY (id)
//   CHECK consultations_status_check: CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])))
//   FOREIGN KEY consultations_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: conversion_events
//   CHECK conversion_events_event_type_check: CHECK ((event_type = ANY (ARRAY['form_submitted'::text, 'iframe_loaded'::text, 'iframe_error'::text])))
//   FOREIGN KEY conversion_events_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   PRIMARY KEY conversion_events_pkey: PRIMARY KEY (id)
// Table: corretora_config
//   PRIMARY KEY corretora_config_pkey: PRIMARY KEY (id)
// Table: cotacoes
//   FOREIGN KEY cotacoes_lead_id_fkey: FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
//   PRIMARY KEY cotacoes_pkey: PRIMARY KEY (id)
// Table: ebooks
//   PRIMARY KEY ebooks_pkey: PRIMARY KEY (id)
// Table: email_subscriptions
//   UNIQUE email_subscriptions_email_key: UNIQUE (email)
//   PRIMARY KEY email_subscriptions_pkey: PRIMARY KEY (id)
//   CHECK email_subscriptions_subscription_status_check: CHECK ((subscription_status = ANY (ARRAY['active'::text, 'unsubscribed'::text])))
//   FOREIGN KEY email_subscriptions_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: leads
//   PRIMARY KEY leads_pkey: PRIMARY KEY (id)
//   FOREIGN KEY leads_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: leads_cursos
//   PRIMARY KEY leads_cursos_pkey: PRIMARY KEY (id)
// Table: leads_seguros
//   PRIMARY KEY leads_seguros_pkey: PRIMARY KEY (id)
// Table: posts
//   PRIMARY KEY posts_pkey: PRIMARY KEY (id)
// Table: products
//   PRIMARY KEY products_pkey: PRIMARY KEY (id)
//   CHECK products_status_check: CHECK ((status = ANY (ARRAY['ativo'::text, 'inativo'::text])))
// Table: purchases
//   CHECK purchases_payment_method_check: CHECK ((payment_method = ANY (ARRAY['stripe'::text, 'mercado_pago'::text, 'hotmart'::text])))
//   PRIMARY KEY purchases_pkey: PRIMARY KEY (id)
//   FOREIGN KEY purchases_product_id_fkey: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
//   CHECK purchases_status_check: CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text])))
//   FOREIGN KEY purchases_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: reactivation_requests
//   PRIMARY KEY reactivation_requests_pkey: PRIMARY KEY (id)
//   CHECK reactivation_requests_status_check: CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))
// Table: settings
//   UNIQUE settings_key_key: UNIQUE (key)
//   PRIMARY KEY settings_pkey: PRIMARY KEY (id)
// Table: user_courses
//   FOREIGN KEY user_courses_course_id_fkey: FOREIGN KEY (course_id) REFERENCES products(id) ON DELETE CASCADE
//   PRIMARY KEY user_courses_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_courses_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: user_profiles
//   FOREIGN KEY user_profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY user_profiles_pkey: PRIMARY KEY (id)
// Table: vendas
//   PRIMARY KEY vendas_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: ab_tests
//   Policy "Allow admin all ab_tests" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow public read ab_tests" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: access_logs
//   Policy "Allow admin to select access_logs" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow public insert on access_logs" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
// Table: avaliacoes
//   Policy "Allow admin all avaliacoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow authenticated full access to avaliacoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "Allow public read access to active avaliacoes" (SELECT, PERMISSIVE) roles={public}
//     USING: (ativo = true)
//   Policy "Allow public read active avaliacoes" (SELECT, PERMISSIVE) roles={public}
//     USING: (ativo = true)
// Table: blog_categories
//   Policy "blog_categories_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "blog_categories_public" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: blog_posts
//   Policy "blog_posts_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "blog_posts_public" (SELECT, PERMISSIVE) roles={public}
//     USING: (published = true)
// Table: candidatos
//   Policy "Allow admin reads on candidatos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow anon inserts on candidatos" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
// Table: clients
//   Policy "Allow admin to select clients" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow admin to update clients" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow users to read own client data" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
// Table: consultations
//   Policy "consultations_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "consultations_user_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
// Table: conversion_events
//   Policy "Allow admin select on conversion_events" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow public insert on conversion_events" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
// Table: corretora_config
//   Policy "Admin full access on corretora_config" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
// Table: cotacoes
//   Policy "Allow authenticated all on cotacoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: ebooks
//   Policy "ebooks_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "ebooks_public" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: email_subscriptions
//   Policy "email_subscriptions_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "email_subscriptions_user_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR (email = auth.email()))
// Table: leads
//   Policy "Allow anon insert on leads" (INSERT, PERMISSIVE) roles={anon}
//     WITH CHECK: true
//   Policy "Allow authenticated insert on leads" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "Allow users to delete own leads" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: ((auth.uid() = user_id) OR (EXISTS ( SELECT 1    FROM user_profiles up   WHERE ((up.id = auth.uid()) AND (up.is_admin = true)))))
//   Policy "Allow users to select own leads" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((auth.uid() = user_id) OR (user_id IS NULL) OR (EXISTS ( SELECT 1    FROM user_profiles up   WHERE ((up.id = auth.uid()) AND (up.is_admin = true)))))
//   Policy "Allow users to update own leads" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((auth.uid() = user_id) OR (EXISTS ( SELECT 1    FROM user_profiles up   WHERE ((up.id = auth.uid()) AND (up.is_admin = true)))))
// Table: leads_cursos
//   Policy "admin_all_leads_cursos" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "public_insert_leads_cursos" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
// Table: leads_seguros
//   Policy "admin_all_leads_seguros" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "public_insert_leads_seguros" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
// Table: posts
//   Policy "admin_all_posts" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "public_read_posts" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: products
//   Policy "Allow admin full access to products" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow public read access to products" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "products_public_select" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: purchases
//   Policy "purchases_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "purchases_user_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
// Table: reactivation_requests
//   Policy "Allow admin delete on reactivation_requests" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow admin select on reactivation_requests" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow admin update on reactivation_requests" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "Allow public insert on reactivation_requests" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
// Table: settings
//   Policy "admin_all_settings" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "public_read_settings" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: user_courses
//   Policy "user_courses_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))
//   Policy "user_courses_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())
// Table: user_profiles
//   Policy "admin_all_user_profiles" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin()
//   Policy "auth_read_own_profile" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (id = auth.uid())
//   Policy "public_read_user_profiles" (SELECT, PERMISSIVE) roles={public}
//     USING: (is_admin = false)
// Table: vendas
//   Policy "admin_all_vendas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM user_profiles   WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.is_admin = true))))

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     -- Insert into user_profiles
//     INSERT INTO public.user_profiles (id, full_name)
//     VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Cliente'))
//     ON CONFLICT (id) DO NOTHING;
//
//     -- Insert into clients
//     INSERT INTO public.clients (id, email, name, status)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'full_name', 'Cliente'),
//       'pending'
//     )
//     ON CONFLICT (id) DO NOTHING;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION increment_blog_view(text)
//   CREATE OR REPLACE FUNCTION public.increment_blog_view(post_slug text)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     UPDATE public.blog_posts
//     SET views = views + 1
//     WHERE slug = post_slug;
//   END;
//   $function$
//
// FUNCTION is_admin()
//   CREATE OR REPLACE FUNCTION public.is_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT COALESCE((SELECT is_admin FROM public.user_profiles WHERE id = auth.uid() LIMIT 1), false);
//   $function$
//
// FUNCTION notify_admin_login_failure()
//   CREATE OR REPLACE FUNCTION public.notify_admin_login_failure()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     failed_count integer;
//   BEGIN
//     IF NEW.success = false THEN
//       SELECT COUNT(*)
//       INTO failed_count
//       FROM public.access_logs
//       WHERE user_email = NEW.user_email
//         AND success = false
//         AND login_attempt_time >= NOW() - INTERVAL '30 minutes';
//
//       -- Trigger exactly on the 6th failure to avoid spamming the admin
//       IF failed_count = 6 THEN
//         PERFORM net.http_post(
//           url := 'https://idtvwxzbmnqjcyxquqdk.supabase.co/functions/v1/send-admin-notification',
//           body := json_build_object(
//             'event_type', 'login_attempt_failed',
//             'payload', json_build_object(
//               'email', NEW.user_email,
//               'count', failed_count
//             )
//           )::jsonb,
//           headers := '{"Content-Type": "application/json"}'::jsonb
//         );
//       END IF;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION notify_admin_new_signup()
//   CREATE OR REPLACE FUNCTION public.notify_admin_new_signup()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF NEW.status = 'pending' THEN
//       PERFORM net.http_post(
//         url := 'https://idtvwxzbmnqjcyxquqdk.supabase.co/functions/v1/send-admin-notification',
//         body := json_build_object(
//           'event_type', 'new_signup',
//           'payload', json_build_object(
//             'email', NEW.email,
//             'name', NEW.name
//           )
//         )::jsonb,
//         headers := '{"Content-Type": "application/json"}'::jsonb
//       );
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION notify_admin_reactivation_request()
//   CREATE OR REPLACE FUNCTION public.notify_admin_reactivation_request()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF NEW.status = 'pending' THEN
//       PERFORM net.http_post(
//         url := 'https://idtvwxzbmnqjcyxquqdk.supabase.co/functions/v1/send-admin-notification',
//         body := json_build_object(
//           'event_type', 'reactivation_request',
//           'payload', json_build_object(
//             'email', NEW.user_email
//           )
//         )::jsonb,
//         headers := '{"Content-Type": "application/json"}'::jsonb
//       );
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION notify_error_webhook()
//   CREATE OR REPLACE FUNCTION public.notify_error_webhook()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF NEW.event_type = 'iframe_error' THEN
//       PERFORM net.http_post(
//         url := 'https://idtvwxzbmnqjcyxquqdk.supabase.co/functions/v1/monitor-quotation-errors',
//         body := json_build_object('type', 'INSERT', 'record', row_to_json(NEW))::jsonb,
//         headers := '{"Content-Type": "application/json"}'::jsonb
//       );
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION notify_lead_webhook()
//   CREATE OR REPLACE FUNCTION public.notify_lead_webhook()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     PERFORM net.http_post(
//       url := 'https://idtvwxzbmnqjcyxquqdk.supabase.co/functions/v1/notify-lead',
//       body := json_build_object(
//         'type', 'INSERT',
//         'record', row_to_json(NEW)
//       )::jsonb,
//       headers := '{"Content-Type": "application/json"}'::jsonb
//     );
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION notify_new_candidate()
//   CREATE OR REPLACE FUNCTION public.notify_new_candidate()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     PERFORM net.http_post(
//       url := 'https://idtvwxzbmnqjcyxquqdk.supabase.co/functions/v1/notify-new-candidate',
//       body := json_build_object(
//         'type', 'INSERT',
//         'record', row_to_json(NEW)
//       )::jsonb,
//       headers := '{"Content-Type": "application/json"}'::jsonb
//     );
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION set_current_timestamp_updated_at()
//   CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     NEW.updated_at = NOW();
//     RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: access_logs
//   on_login_failure: CREATE TRIGGER on_login_failure AFTER INSERT ON public.access_logs FOR EACH ROW EXECUTE FUNCTION notify_admin_login_failure()
// Table: candidatos
//   on_candidate_inserted: CREATE TRIGGER on_candidate_inserted AFTER INSERT ON public.candidatos FOR EACH ROW EXECUTE FUNCTION notify_new_candidate()
// Table: clients
//   on_client_signup: CREATE TRIGGER on_client_signup AFTER INSERT ON public.clients FOR EACH ROW EXECUTE FUNCTION notify_admin_new_signup()
// Table: conversion_events
//   on_conversion_error: CREATE TRIGGER on_conversion_error AFTER INSERT ON public.conversion_events FOR EACH ROW EXECUTE FUNCTION notify_error_webhook()
// Table: leads
//   on_lead_inserted: CREATE TRIGGER on_lead_inserted AFTER INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION notify_lead_webhook()
// Table: products
//   set_products_updated_at: CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at()
// Table: reactivation_requests
//   on_reactivation_request: CREATE TRIGGER on_reactivation_request AFTER INSERT ON public.reactivation_requests FOR EACH ROW EXECUTE FUNCTION notify_admin_reactivation_request()

// --- INDEXES ---
// Table: access_logs
//   CREATE INDEX idx_access_logs_user_email ON public.access_logs USING btree (user_email)
// Table: blog_categories
//   CREATE UNIQUE INDEX blog_categories_name_key ON public.blog_categories USING btree (name)
//   CREATE UNIQUE INDEX blog_categories_slug_key ON public.blog_categories USING btree (slug)
// Table: blog_posts
//   CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts USING btree (slug)
// Table: clients
//   CREATE UNIQUE INDEX clients_email_key ON public.clients USING btree (email)
//   CREATE INDEX clients_status_idx ON public.clients USING btree (status)
// Table: email_subscriptions
//   CREATE UNIQUE INDEX email_subscriptions_email_key ON public.email_subscriptions USING btree (email)
// Table: reactivation_requests
//   CREATE INDEX idx_reactivation_requests_status ON public.reactivation_requests USING btree (status)
//   CREATE INDEX idx_reactivation_requests_user_email ON public.reactivation_requests USING btree (user_email)
// Table: settings
//   CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key)
