
> @acme/nextjs@0.1.0 with-env /Users/toycrane/projects/effortless-earning/go-parkgolf/apps/nextjs
> dotenv -e ../../.env -- "npx" "supabase" "gen" "types" "typescript" "--project-id" "nlclqihmkqqmdmflexer" "--schema" "public"

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
      contacts: {
        Row: {
          created_at: string
          golf_course_id: string
          id: string
          phone_number: string
        }
        Insert: {
          created_at?: string
          golf_course_id: string
          id?: string
          phone_number: string
        }
        Update: {
          created_at?: string
          golf_course_id?: string
          id?: string
          phone_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: false
            referencedRelation: "golf_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          golf_course_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          golf_course_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          golf_course_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: false
            referencedRelation: "golf_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      game_courses: {
        Row: {
          created_at: string
          game_id: string
          hole_count: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          game_id: string
          hole_count: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          game_id?: string
          hole_count?: number
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_courses_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_player_scores: {
        Row: {
          created_at: string
          game_player_id: string
          game_score_id: string
          id: string
          score: number
        }
        Insert: {
          created_at?: string
          game_player_id: string
          game_score_id: string
          id?: string
          score: number
        }
        Update: {
          created_at?: string
          game_player_id?: string
          game_score_id?: string
          id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_player_scores_game_player_id_fkey"
            columns: ["game_player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_player_scores_game_score_id_fkey"
            columns: ["game_score_id"]
            isOneToOne: false
            referencedRelation: "game_scores"
            referencedColumns: ["id"]
          },
        ]
      }
      game_players: {
        Row: {
          created_at: string
          game_id: string
          id: string
          nickname: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          nickname: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          nickname?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scores: {
        Row: {
          created_at: string
          game_course_id: string
          hole_number: number
          id: string
          par: number
        }
        Insert: {
          created_at?: string
          game_course_id: string
          hole_number: number
          id?: string
          par: number
        }
        Update: {
          created_at?: string
          game_course_id?: string
          hole_number?: number
          id?: string
          par?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_game_course_id_fkey"
            columns: ["game_course_id"]
            isOneToOne: false
            referencedRelation: "game_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string
          golf_course_id: string
          id: string
          started_at: string
          status: Database["public"]["Enums"]["game_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          golf_course_id: string
          id?: string
          started_at: string
          status?: Database["public"]["Enums"]["game_status"]
          user_id?: string
        }
        Update: {
          created_at?: string
          golf_course_id?: string
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["game_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: false
            referencedRelation: "golf_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      golf_course_qnas: {
        Row: {
          content: string
          created_at: string
          golf_course_id: string
          id: string
          level: number
          parent_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          golf_course_id: string
          id?: string
          level?: number
          parent_id?: string | null
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          golf_course_id?: string
          id?: string
          level?: number
          parent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "golf_course_qnas_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: false
            referencedRelation: "golf_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "golf_course_qnas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      golf_course_reviews: {
        Row: {
          course_condition_rating: number
          course_difficulty_rating: number
          created_at: string
          facilities_rating: number
          golf_course_id: string
          id: string
          text: string
          user_id: string
        }
        Insert: {
          course_condition_rating: number
          course_difficulty_rating: number
          created_at?: string
          facilities_rating: number
          golf_course_id: string
          id?: string
          text: string
          user_id?: string
        }
        Update: {
          course_condition_rating?: number
          course_difficulty_rating?: number
          created_at?: string
          facilities_rating?: number
          golf_course_id?: string
          id?: string
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "golf_course_reviews_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: false
            referencedRelation: "golf_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "golf_course_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      golf_courses: {
        Row: {
          created_at: string
          hole_count: number
          id: string
          lat: number
          lng: number
          location: unknown | null
          lot_number_address_name: string | null
          name: string
          publish_status: Database["public"]["Enums"]["publish_status"]
          road_address_name: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          hole_count: number
          id?: string
          lat: number
          lng: number
          location?: unknown | null
          lot_number_address_name?: string | null
          name?: string
          publish_status?: Database["public"]["Enums"]["publish_status"]
          road_address_name?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          hole_count?: number
          id?: string
          lat?: number
          lng?: number
          location?: unknown | null
          lot_number_address_name?: string | null
          name?: string
          publish_status?: Database["public"]["Enums"]["publish_status"]
          road_address_name?: string | null
          slug?: string
        }
        Relationships: []
      }
      holes: {
        Row: {
          course_id: string
          created_at: string
          distance: number | null
          hole_number: number
          id: string
          par: number
        }
        Insert: {
          course_id: string
          created_at?: string
          distance?: number | null
          hole_number: number
          id?: string
          par: number
        }
        Update: {
          course_id?: string
          created_at?: string
          distance?: number | null
          hole_number?: number
          id?: string
          par?: number
        }
        Relationships: [
          {
            foreignKeyName: "holes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lot_number_addresses: {
        Row: {
          address_name: string | null
          b_code: string | null
          golf_course_id: string
          h_code: string | null
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
          golf_course_id: string
          h_code?: string | null
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
          golf_course_id?: string
          h_code?: string | null
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
            foreignKeyName: "lot_number_addresses_golf_course_id_fkey"
            columns: ["golf_course_id"]
            isOneToOne: true
            referencedRelation: "golf_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      operations: {
        Row: {
          created_at: string
          golf_course_id: string
          opening_hours: string | null
          reference: string | null
          registration_method: string | null
          regular_closed_days: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          golf_course_id: string
          opening_hours?: string | null
          reference?: string | null
          registration_method?: string | null
          regular_closed_days?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          golf_course_id?: string
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
            referencedRelation: "golf_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          id: string
          name: string
          username: string
        }
        Insert: {
          avatar_url: string
          created_at?: string
          id: string
          name: string
          username: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          id?: string
          name?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      road_addresses: {
        Row: {
          address_name: string | null
          building_name: string | null
          golf_course_id: string
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
          golf_course_id: string
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
          golf_course_id?: string
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
            isOneToOne: true
            referencedRelation: "golf_courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_game_summary: {
        Args: {
          input_game_id: string
        }
        Returns: {
          game_player_id: string
          player_name: string
          game_course: string
          total_score: number
        }[]
      }
      insert_courses: {
        Args: {
          data: Json
        }
        Returns: undefined
      }
      nearby_golf_courses: {
        Args: {
          latitude: number
          longitude: number
          max_results: number
        }
        Returns: {
          id: string
          created_at: string
          name: string
          hole_count: number
          slug: string
          lot_number_address_name: string
          road_address_name: string
          lng: number
          lat: number
          publish_status: Database["public"]["Enums"]["publish_status"]
          location: unknown
          dist_meters: number
        }[]
      }
    }
    Enums: {
      game_status: "draft" | "in_progress" | "completed" | "deleted"
      publish_status: "draft" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
