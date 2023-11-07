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
            foreignKeyName: "contacts_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: true
            referencedRelation: "golf_course"
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
            foreignKeyName: "operations_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: true
            referencedRelation: "golf_course"
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
