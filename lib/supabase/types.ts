/**
 * Hand-written Database types - replace with `supabase gen types typescript` when CLI is linked.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      video_categories: {
        Row: {
          id: string;
          title_en: string;
          title_he: string;
          slug: string;
          sort_order: number;
          initial_visible_count: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_he: string;
          slug: string;
          sort_order?: number;
          initial_visible_count?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_en?: string;
          title_he?: string;
          slug?: string;
          sort_order?: number;
          initial_visible_count?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      video_works: {
        Row: {
          id: string;
          category_id: string | null;
          title_en: string;
          title_he: string;
          youtube_url: string;
          youtube_id: string | null;
          thumbnail_url: string | null;
          custom_cover_url: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          title_en: string;
          title_he: string;
          youtube_url: string;
          youtube_id?: string | null;
          thumbnail_url?: string | null;
          custom_cover_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          title_en?: string;
          title_he?: string;
          youtube_url?: string;
          youtube_id?: string | null;
          thumbnail_url?: string | null;
          custom_cover_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_works_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "video_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      still_images: {
        Row: {
          id: string;
          image_url: string;
          storage_path: string | null;
          alt_en: string | null;
          alt_he: string | null;
          width: number | null;
          height: number | null;
          aspect_ratio: number | null;
          sort_order: number;
          is_published: boolean;
          show_in_hero: boolean;
          exclude_from_hero: boolean;
          collage_layout: import("@/lib/stills/collage-layout").CollageLayout | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          storage_path?: string | null;
          alt_en?: string | null;
          alt_he?: string | null;
          width?: number | null;
          height?: number | null;
          aspect_ratio?: number | null;
          sort_order?: number;
          is_published?: boolean;
          show_in_hero?: boolean;
          exclude_from_hero?: boolean;
          collage_layout?: import("@/lib/stills/collage-layout").CollageLayout | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          storage_path?: string | null;
          alt_en?: string | null;
          alt_he?: string | null;
          width?: number | null;
          height?: number | null;
          aspect_ratio?: number | null;
          sort_order?: number;
          is_published?: boolean;
          show_in_hero?: boolean;
          exclude_from_hero?: boolean;
          collage_layout?: import("@/lib/stills/collage-layout").CollageLayout | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title_en: string;
          title_he: string;
          description_en: string | null;
          description_he: string | null;
          icon_key: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_he: string;
          description_en?: string | null;
          description_he?: string | null;
          icon_key?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_en?: string;
          title_he?: string;
          description_en?: string | null;
          description_he?: string | null;
          icon_key?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          id: string;
          key: string;
          value_en: string | null;
          value_he: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value_en?: string | null;
          value_he?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value_en?: string | null;
          value_he?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string;
          service_type: string | null;
          message: string | null;
          language: string;
          privacy_accepted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email: string;
          service_type?: string | null;
          message?: string | null;
          language?: string;
          privacy_accepted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          email?: string;
          service_type?: string | null;
          message?: string | null;
          language?: string;
          privacy_accepted?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      set_updated_at: { Args: Record<string, never>; Returns: undefined };
    };
    Enums: Record<string, never>;
  };
}
