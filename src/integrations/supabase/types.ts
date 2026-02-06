export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blogs: {
        Row: {
          author_image: string | null;
          author_name: string | null;
          category_id: string | null;
          content: Json | null;
          created_at: string;
          excerpt: string | null;
          featured_image: string | null;
          id: string;
          is_featured: boolean;
          is_published: boolean;
          published_at: string | null;
          seo_description: string | null;
          seo_image: string | null;
          seo_title: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_image?: string | null;
          author_name?: string | null;
          category_id?: string | null;
          content?: Json | null;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          published_at?: string | null;
          seo_description?: string | null;
          seo_image?: string | null;
          seo_title?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_image?: string | null;
          author_name?: string | null;
          category_id?: string | null;
          content?: Json | null;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          published_at?: string | null;
          seo_description?: string | null;
          seo_image?: string | null;
          seo_title?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blogs_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      brands: {
        Row: {
          created_at: string;
          description: string | null;
          featured_image: string | null;
          id: string;
          is_active: boolean;
          logo_url: string | null;
          name: string;
          seo_description: string | null;
          seo_image: string | null;
          seo_title: string | null;
          slug: string;
          sort_order: number;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          featured_image?: string | null;
          id?: string;
          is_active?: boolean;
          logo_url?: string | null;
          name: string;
          seo_description?: string | null;
          seo_image?: string | null;
          seo_title?: string | null;
          slug: string;
          sort_order?: number;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          featured_image?: string | null;
          id?: string;
          is_active?: boolean;
          logo_url?: string | null;
          name?: string;
          seo_description?: string | null;
          seo_image?: string | null;
          seo_title?: string | null;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
      careers: {
        Row: {
          apply_form_fields: Json | null;
          created_at: string;
          department: string | null;
          description: string | null;
          employment_type: string | null;
          id: string;
          is_active: boolean;
          location: string | null;
          requirements: Json | null;
          responsibilities: Json | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          apply_form_fields?: Json | null;
          created_at?: string;
          department?: string | null;
          description?: string | null;
          employment_type?: string | null;
          id?: string;
          is_active?: boolean;
          location?: string | null;
          requirements?: Json | null;
          responsibilities?: Json | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          apply_form_fields?: Json | null;
          created_at?: string;
          department?: string | null;
          description?: string | null;
          employment_type?: string | null;
          id?: string;
          is_active?: boolean;
          location?: string | null;
          requirements?: Json | null;
          responsibilities?: Json | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          company: string | null;
          created_at: string;
          email: string;
          id: string;
          is_read: boolean;
          message: string;
          name: string;
          phone: string | null;
          subject: string | null;
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          is_read?: boolean;
          message: string;
          name: string;
          phone?: string | null;
          subject?: string | null;
        };
        Update: {
          company?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          is_read?: boolean;
          message?: string;
          name?: string;
          phone?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      domains: {
        Row: {
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          is_active: boolean;
          name: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_speakers: {
        Row: {
          bio: string | null;
          company: string | null;
          created_at: string;
          event_id: string;
          id: string;
          name: string;
          photo_url: string | null;
          sort_order: number;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          bio?: string | null;
          company?: string | null;
          created_at?: string;
          event_id: string;
          id?: string;
          name: string;
          photo_url?: string | null;
          sort_order?: number;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          bio?: string | null;
          company?: string | null;
          created_at?: string;
          event_id?: string;
          id?: string;
          name?: string;
          photo_url?: string | null;
          sort_order?: number;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_speakers_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      event_types: {
        Row: {
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          is_active: boolean;
          name: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          content: Json | null;
          created_at: string;
          description: string | null;
          end_date: string | null;
          event_date: string | null;
          event_type_id: string | null;
          featured_image: string | null;
          hero_image: string | null;
          id: string;
          is_featured: boolean;
          is_upcoming: boolean;
          location: string | null;
          registration_url: string | null;
          seo_description: string | null;
          seo_image: string | null;
          seo_title: string | null;
          slug: string;
          title: string;
          updated_at: string;
          venue: string | null;
        };
        Insert: {
          content?: Json | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          event_date?: string | null;
          event_type_id?: string | null;
          featured_image?: string | null;
          hero_image?: string | null;
          id?: string;
          is_featured?: boolean;
          is_upcoming?: boolean;
          location?: string | null;
          registration_url?: string | null;
          seo_description?: string | null;
          seo_image?: string | null;
          seo_title?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
          venue?: string | null;
        };
        Update: {
          content?: Json | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          event_date?: string | null;
          event_type_id?: string | null;
          featured_image?: string | null;
          hero_image?: string | null;
          id?: string;
          is_featured?: boolean;
          is_upcoming?: boolean;
          location?: string | null;
          registration_url?: string | null;
          seo_description?: string | null;
          seo_image?: string | null;
          seo_title?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
          venue?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_event_type_id_fkey";
            columns: ["event_type_id"];
            isOneToOne: false;
            referencedRelation: "event_types";
            referencedColumns: ["id"];
          },
        ];
      };
      gallery: {
        Row: {
          alt_text: string | null;
          caption: string | null;
          category: string | null;
          created_at: string;
          event_id: string | null;
          id: string;
          image_url: string;
          is_active: boolean;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          alt_text?: string | null;
          caption?: string | null;
          category?: string | null;
          created_at?: string;
          event_id?: string | null;
          id?: string;
          image_url: string;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          alt_text?: string | null;
          caption?: string | null;
          category?: string | null;
          created_at?: string;
          event_id?: string | null;
          id?: string;
          image_url?: string;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gallery_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      hero_sections: {
        Row: {
          background_image: string | null;
          created_at: string;
          cta_link: string | null;
          cta_text: string | null;
          headline: string;
          id: string;
          is_active: boolean;
          page_id: string | null;
          secondary_cta_link: string | null;
          secondary_cta_text: string | null;
          sort_order: number;
          subheadline: string | null;
          updated_at: string;
        };
        Insert: {
          background_image?: string | null;
          created_at?: string;
          cta_link?: string | null;
          cta_text?: string | null;
          headline: string;
          id?: string;
          is_active?: boolean;
          page_id?: string | null;
          secondary_cta_link?: string | null;
          secondary_cta_text?: string | null;
          sort_order?: number;
          subheadline?: string | null;
          updated_at?: string;
        };
        Update: {
          background_image?: string | null;
          created_at?: string;
          cta_link?: string | null;
          cta_text?: string | null;
          headline?: string;
          id?: string;
          is_active?: boolean;
          page_id?: string | null;
          secondary_cta_link?: string | null;
          secondary_cta_text?: string | null;
          sort_order?: number;
          subheadline?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hero_sections_page_id_fkey";
            columns: ["page_id"];
            isOneToOne: false;
            referencedRelation: "pages";
            referencedColumns: ["id"];
          },
        ];
      };
      job_applications: {
        Row: {
          applicant_email: string;
          applicant_name: string;
          applicant_phone: string | null;
          career_id: string;
          cover_letter: string | null;
          created_at: string;
          form_data: Json | null;
          id: string;
          resume_url: string | null;
          status: string | null;
          updated_at: string;
        };
        Insert: {
          applicant_email: string;
          applicant_name: string;
          applicant_phone?: string | null;
          career_id: string;
          cover_letter?: string | null;
          created_at?: string;
          form_data?: Json | null;
          id?: string;
          resume_url?: string | null;
          status?: string | null;
          updated_at?: string;
        };
        Update: {
          applicant_email?: string;
          applicant_name?: string;
          applicant_phone?: string | null;
          career_id?: string;
          cover_letter?: string | null;
          created_at?: string;
          form_data?: Json | null;
          id?: string;
          resume_url?: string | null;
          status?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "job_applications_career_id_fkey";
            columns: ["career_id"];
            isOneToOne: false;
            referencedRelation: "careers";
            referencedColumns: ["id"];
          },
        ];
      };
      navigation: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          link: string;
          name: string;
          parent_id: string | null;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          link: string;
          name: string;
          parent_id?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          link?: string;
          name?: string;
          parent_id?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "navigation_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "navigation";
            referencedColumns: ["id"];
          },
        ];
      };
      pages: {
        Row: {
          content: Json | null;
          created_at: string;
          id: string;
          is_published: boolean;
          seo_description: string | null;
          seo_image: string | null;
          seo_title: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          content?: Json | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          seo_description?: string | null;
          seo_image?: string | null;
          seo_title?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: Json | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          seo_description?: string | null;
          seo_image?: string | null;
          seo_title?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      partners: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          logo_url: string;
          name: string;
          sort_order: number;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          logo_url: string;
          name: string;
          sort_order?: number;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          logo_url?: string;
          name?: string;
          sort_order?: number;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          contact_address: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string;
          facebook_url: string | null;
          favicon_url: string | null;
          global_seo_description: string | null;
          global_seo_image: string | null;
          global_seo_title: string | null;
          id: string;
          instagram_url: string | null;
          linkedin_url: string | null;
          logo_url: string | null;
          site_tagline: string | null;
          site_title: string;
          twitter_url: string | null;
          updated_at: string;
          youtube_url: string | null;
        };
        Insert: {
          contact_address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          facebook_url?: string | null;
          favicon_url?: string | null;
          global_seo_description?: string | null;
          global_seo_image?: string | null;
          global_seo_title?: string | null;
          id?: string;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          logo_url?: string | null;
          site_tagline?: string | null;
          site_title?: string;
          twitter_url?: string | null;
          updated_at?: string;
          youtube_url?: string | null;
        };
        Update: {
          contact_address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          facebook_url?: string | null;
          favicon_url?: string | null;
          global_seo_description?: string | null;
          global_seo_image?: string | null;
          global_seo_title?: string | null;
          id?: string;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          logo_url?: string | null;
          site_tagline?: string | null;
          site_title?: string;
          twitter_url?: string | null;
          updated_at?: string;
          youtube_url?: string | null;
        };
        Relationships: [];
      };
      statistics: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          label: string;
          sort_order: number;
          updated_at: string;
          value: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          label: string;
          sort_order?: number;
          updated_at?: string;
          value: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          label?: string;
          sort_order?: number;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          company: string | null;
          content: string;
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          photo_url: string | null;
          rating: number | null;
          sort_order: number;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          company?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          photo_url?: string | null;
          rating?: number | null;
          sort_order?: number;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          company?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          photo_url?: string | null;
          rating?: number | null;
          sort_order?: number;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const;
