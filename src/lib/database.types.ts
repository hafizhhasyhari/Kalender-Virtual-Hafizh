export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          end_date: string
          fact_table_id: string
          id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          fact_table_id: string
          id?: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          fact_table_id?: string
          id?: string
          start_date?: string
          updated_at?: string
        }
      }
      fact_table: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          property_id: string
          role_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          property_id: string
          role_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          property_id?: string
          role_id?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          last_sign_in_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          last_sign_in_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_sign_in_at?: string | null
          updated_at?: string | null
        }
      }
      properties: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
      }
      roles: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      booking_exists:
        | {
            Args: { sdate: string; edate: string; propid: string }
            Returns: {
              property_id: string
              start_date: string
              end_date: string
            }[]
          }
        | {
            Args: {
              sdate: string
              edate: string
              propid: string
              statusid: string
            }
            Returns: {
              property_id: string
              start_date: string
              end_date: string
            }[]
          }
      delete_avatar: {
        Args: { avatar_url: string }
        Returns: Record<string, unknown>[]
      }
      delete_storage_object: {
        Args: { bucket: string; object: string }
        Returns: Record<string, unknown>[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

