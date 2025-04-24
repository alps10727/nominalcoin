export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      completed_tasks: {
        Row: {
          completed_at: string | null
          id: number
          task_id: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: number
          task_id: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: number
          task_id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number | null
          created_at: string | null
          email: string
          id: string
          invited_by: string | null
          is_admin: boolean | null
          last_saved: number | null
          mining_active: boolean | null
          mining_end_time: number | null
          mining_period: number | null
          mining_rate: number | null
          mining_session: number | null
          mining_start_time: number | null
          mining_time: number | null
          name: string | null
          progress: number | null
          referral_code: string | null
          referral_count: number | null
          referrals: string[] | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          email: string
          id: string
          invited_by?: string | null
          is_admin?: boolean | null
          last_saved?: number | null
          mining_active?: boolean | null
          mining_end_time?: number | null
          mining_period?: number | null
          mining_rate?: number | null
          mining_session?: number | null
          mining_start_time?: number | null
          mining_time?: number | null
          name?: string | null
          progress?: number | null
          referral_code?: string | null
          referral_count?: number | null
          referrals?: string[] | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          email?: string
          id?: string
          invited_by?: string | null
          is_admin?: boolean | null
          last_saved?: number | null
          mining_active?: boolean | null
          mining_end_time?: number | null
          mining_period?: number | null
          mining_rate?: number | null
          mining_session?: number | null
          mining_start_time?: number | null
          mining_time?: number | null
          name?: string | null
          progress?: number | null
          referral_code?: string | null
          referral_count?: number | null
          referrals?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_audit: {
        Row: {
          code: string
          code_id: string | null
          created_at: string | null
          id: string
          invitee_id: string | null
          referrer_id: string | null
        }
        Insert: {
          code: string
          code_id?: string | null
          created_at?: string | null
          id?: string
          invitee_id?: string | null
          referrer_id?: string | null
        }
        Update: {
          code?: string
          code_id?: string | null
          created_at?: string | null
          id?: string
          invitee_id?: string | null
          referrer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_audit_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_audit_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_audit_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          owner: string | null
          used: boolean | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          owner?: string | null
          used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          owner?: string | null
          used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_codes_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          attachment_url: string | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          id: string
          progress: number | null
          reward: number | null
          title: string
          total_required: number | null
          user_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          reward?: number | null
          title: string
          total_required?: number | null
          user_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          reward?: number | null
          title?: string
          total_required?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      upgrades: {
        Row: {
          id: number
          level: number | null
          purchased_at: string | null
          rate_bonus: number | null
          upgrade_id: number
          user_id: string | null
        }
        Insert: {
          id?: number
          level?: number | null
          purchased_at?: string | null
          rate_bonus?: number | null
          upgrade_id: number
          user_id?: string | null
        }
        Update: {
          id?: number
          level?: number | null
          purchased_at?: string | null
          rate_bonus?: number | null
          upgrade_id?: number
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_balance: {
        Args: { p_user_id: string; p_amount: number; p_reason: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
