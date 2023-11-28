
> @acme/nextjs@0.1.0 with-env /Users/toycrane/projects/effortless-earning/go-parkgolf/apps/nextjs
> dotenv -e ../../.env -- "npx" "supabase" "gen" "types" "typescript" "--project-id" "nlclqihmkqqmdmflexer" "--schema" "public"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      address: {
        Row: {
          address_name: string | null
          b_code: string | null
          golf_course_id: number | null
          h_code: string | null
          id: number
          main_address_no: string | null
          mountain_yn: string | null
          region_1depth_name: string | null
          region_2depth_name: string | null
          region_3depth_h_name: string | null
          region_3depth_name: string | null
          sub_address_no: string | null
          x: number | null
          y: number | null
        }
        Insert: {
          address_name?: string | null
          b_code?: string | null
          golf_course_id?: number | null
          h_code?: string | null
          id?: number
          main_address_no?: string | null
          mountain_yn?: string | null
          region_1depth_name?: string | null
          region_2depth_name?: string | null
          region_3depth_h_name?: string | null
          region_3depth_name?: string | null
          sub_address_no?: string | null
          x?: number | null
          y?: number | null
        }
        Update: {
          address_name?: string | null
          b_code?: string | null
          golf_course_id?: number | null
          h_code?: string | null
          id?: number
          main_address_no?: string | null
          mountain_yn?: string | null
          region_1depth_name?: string | null
          region_2depth_name?: string | null
          region_3depth_h_name?: string | null
          region_3depth_name?: string | null
          sub_address_no?: string | null
          x?: number | null
          y?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: false
            referencedRelation: "golf_course"
            referencedColumns: ["id"]
          }
        ]
      }
      contact: {
        Row: {
          golf_course_id: number | null
          id: number
          phone_number: string | null
        }
        Insert: {
          golf_course_id?: number | null
          id?: number
          phone_number?: string | null
        }
        Update: {
          golf_course_id?: number | null
          id?: number
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: false
            referencedRelation: "golf_course"
            referencedColumns: ["id"]
          }
        ]
      }
      game: {
        Row: {
          course_id: number | null
          id: number
          start_date: string | null
        }
        Insert: {
          course_id?: number | null
          id?: number
          start_date?: string | null
        }
        Update: {
          course_id?: number | null
          id?: number
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "golf_course"
            referencedColumns: ["id"]
          }
        ]
      }
      game_course: {
        Row: {
          game_id: number | null
          hole_count: number | null
          id: number
          name: string | null
        }
        Insert: {
          game_id?: number | null
          hole_count?: number | null
          id?: number
          name?: string | null
        }
        Update: {
          game_id?: number | null
          hole_count?: number | null
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_course_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          }
        ]
      }
      golf_course: {
        Row: {
          hole_count: number
          id: number
          name: string
          searchable_address: string
          slug: string
        }
        Insert: {
          hole_count: number
          id?: number
          name: string
          searchable_address: string
          slug: string
        }
        Update: {
          hole_count?: number
          id?: number
          name?: string
          searchable_address?: string
          slug?: string
        }
        Relationships: []
      }
      operation: {
        Row: {
          golf_course_id: number | null
          id: number
          opening_hours: string | null
          reference: string | null
          registration_method: string | null
          regular_closed_days: string | null
          website: string | null
        }
        Insert: {
          golf_course_id?: number | null
          id?: number
          opening_hours?: string | null
          reference?: string | null
          registration_method?: string | null
          regular_closed_days?: string | null
          website?: string | null
        }
        Update: {
          golf_course_id?: number | null
          id?: number
          opening_hours?: string | null
          reference?: string | null
          registration_method?: string | null
          regular_closed_days?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operation_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: false
            referencedRelation: "golf_course"
            referencedColumns: ["id"]
          }
        ]
      }
      participant: {
        Row: {
          game_id: number
          id: number
          nickname: string | null
          user_id: number | null
        }
        Insert: {
          game_id: number
          id?: number
          nickname?: string | null
          user_id?: number | null
        }
        Update: {
          game_id?: number
          id?: number
          nickname?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          }
        ]
      }
      player_score: {
        Row: {
          participant_id: number
          player_score: number | null
          score_id: number
        }
        Insert: {
          participant_id: number
          player_score?: number | null
          score_id: number
        }
        Update: {
          participant_id?: number
          player_score?: number | null
          score_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_score_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_score_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "score"
            referencedColumns: ["id"]
          }
        ]
      }
      road_address: {
        Row: {
          address_name: string | null
          building_name: string | null
          golf_course_id: number | null
          id: number
          main_building_no: string | null
          region_1depth_name: string | null
          region_2depth_name: string | null
          region_3depth_name: string | null
          road_name: string | null
          sub_building_no: string | null
          underground_yn: string | null
          x: number | null
          y: number | null
          zone_no: string | null
        }
        Insert: {
          address_name?: string | null
          building_name?: string | null
          golf_course_id?: number | null
          id?: number
          main_building_no?: string | null
          region_1depth_name?: string | null
          region_2depth_name?: string | null
          region_3depth_name?: string | null
          road_name?: string | null
          sub_building_no?: string | null
          underground_yn?: string | null
          x?: number | null
          y?: number | null
          zone_no?: string | null
        }
        Update: {
          address_name?: string | null
          building_name?: string | null
          golf_course_id?: number | null
          id?: number
          main_building_no?: string | null
          region_1depth_name?: string | null
          region_2depth_name?: string | null
          region_3depth_name?: string | null
          road_name?: string | null
          sub_building_no?: string | null
          underground_yn?: string | null
          x?: number | null
          y?: number | null
          zone_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "road_addresses_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: false
            referencedRelation: "golf_course"
            referencedColumns: ["id"]
          }
        ]
      }
      score: {
        Row: {
          game_id: number
          hole_number: number
          id: number
          par: number
        }
        Insert: {
          game_id: number
          hole_number: number
          id?: number
          par: number
        }
        Update: {
          game_id?: number
          hole_number?: number
          id?: number
          par?: number
        }
        Relationships: [
          {
            foreignKeyName: "score_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
