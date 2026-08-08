export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          active: boolean
          avatar_color: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_color?: string
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_color?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Relationships: []
      }
      agency_settings: {
        Row: {
          address: string
          dark_mode: boolean
          email: string
          id: number
          name: string
          notify_new_booking: boolean
          notify_new_event: boolean
          notify_new_visa: boolean
          notify_payment_late: boolean
          phone: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string
          dark_mode?: boolean
          email?: string
          id?: number
          name?: string
          notify_new_booking?: boolean
          notify_new_event?: boolean
          notify_new_visa?: boolean
          notify_payment_late?: boolean
          phone?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string
          dark_mode?: boolean
          email?: string
          id?: number
          name?: string
          notify_new_booking?: boolean
          notify_new_event?: boolean
          notify_new_visa?: boolean
          notify_payment_late?: boolean
          phone?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          cover_image: string
          created_at: string
          excerpt: string
          id: string
          published_at: string | null
          read_time_minutes: number
          slug: string
          status: Database["public"]["Enums"]["blog_post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          category?: string
          content: string
          cover_image: string
          created_at?: string
          excerpt?: string
          id?: string
          published_at?: string | null
          read_time_minutes?: number
          slug: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          cover_image?: string
          created_at?: string
          excerpt?: string
          id?: string
          published_at?: string | null
          read_time_minutes?: number
          slug?: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_documents: {
        Row: {
          booking_id: string
          id: string
          name: string
          type: string
          uploaded_at: string
          url: string
        }
        Insert: {
          booking_id: string
          id?: string
          name: string
          type: string
          uploaded_at?: string
          url: string
        }
        Update: {
          booking_id?: string
          id?: string
          name?: string
          type?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_documents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_messages: {
        Row: {
          author: string
          booking_id: string
          content: string
          created_at: string
          from_client: boolean
          id: string
        }
        Insert: {
          author: string
          booking_id: string
          content: string
          created_at?: string
          from_client?: boolean
          id?: string
        }
        Update: {
          author?: string
          booking_id?: string
          content?: string
          created_at?: string
          from_client?: boolean
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_notes: {
        Row: {
          author: string
          booking_id: string
          content: string
          created_at: string
          id: string
        }
        Insert: {
          author: string
          booking_id: string
          content: string
          created_at?: string
          id?: string
        }
        Update: {
          author?: string
          booking_id?: string
          content?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_notes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_timeline: {
        Row: {
          actor: string
          booking_id: string
          created_at: string
          detail: string | null
          id: string
          label: string
        }
        Insert: {
          actor: string
          booking_id: string
          created_at?: string
          detail?: string | null
          id?: string
          label: string
        }
        Update: {
          actor?: string
          booking_id?: string
          created_at?: string
          detail?: string | null
          id?: string
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_timeline_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          agent_id: string | null
          booking_number: string
          client_id: string
          created_at: string
          depart_date: string | null
          destination_name: string | null
          id: string
          paid_xof: number
          passengers: number
          payment_status: Database["public"]["Enums"]["payment_status"]
          reference_id: string
          reference_label: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price_xof: number
          type: Database["public"]["Enums"]["booking_type"]
          updated_at: string
          urgent: boolean
        }
        Insert: {
          agent_id?: string | null
          booking_number?: string
          client_id: string
          created_at?: string
          depart_date?: string | null
          destination_name?: string | null
          id?: string
          paid_xof?: number
          passengers?: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference_id: string
          reference_label: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price_xof: number
          type: Database["public"]["Enums"]["booking_type"]
          updated_at?: string
          urgent?: boolean
        }
        Update: {
          agent_id?: string | null
          booking_number?: string
          client_id?: string
          created_at?: string
          depart_date?: string | null
          destination_name?: string | null
          id?: string
          paid_xof?: number
          passengers?: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference_id?: string
          reference_label?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price_xof?: number
          type?: Database["public"]["Enums"]["booking_type"]
          updated_at?: string
          urgent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "bookings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      circuit_departures: {
        Row: {
          circuit_id: string
          departure_date: string
          id: string
          seats_booked: number
          seats_total: number
          status: Database["public"]["Enums"]["departure_status"]
        }
        Insert: {
          circuit_id: string
          departure_date: string
          id?: string
          seats_booked?: number
          seats_total: number
          status?: Database["public"]["Enums"]["departure_status"]
        }
        Update: {
          circuit_id?: string
          departure_date?: string
          id?: string
          seats_booked?: number
          seats_total?: number
          status?: Database["public"]["Enums"]["departure_status"]
        }
        Relationships: [
          {
            foreignKeyName: "circuit_departures_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      circuit_itinerary_days: {
        Row: {
          accommodation: string | null
          circuit_id: string
          day_number: number
          description: string
          id: string
          meals: string | null
          position: number
          title: string
        }
        Insert: {
          accommodation?: string | null
          circuit_id: string
          day_number: number
          description: string
          id?: string
          meals?: string | null
          position?: number
          title: string
        }
        Update: {
          accommodation?: string | null
          circuit_id?: string
          day_number?: number
          description?: string
          id?: string
          meals?: string | null
          position?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "circuit_itinerary_days_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      circuit_options: {
        Row: {
          circuit_id: string
          id: string
          label: string
          position: number
          price_xof: number
        }
        Insert: {
          circuit_id: string
          id?: string
          label: string
          position?: number
          price_xof: number
        }
        Update: {
          circuit_id?: string
          id?: string
          label?: string
          position?: number
          price_xof?: number
        }
        Relationships: [
          {
            foreignKeyName: "circuit_options_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      circuit_price_tiers: {
        Row: {
          circuit_id: string
          id: string
          label: string
          max_pax: number | null
          min_pax: number
          position: number
          price_xof: number
        }
        Insert: {
          circuit_id: string
          id?: string
          label: string
          max_pax?: number | null
          min_pax: number
          position?: number
          price_xof: number
        }
        Update: {
          circuit_id?: string
          id?: string
          label?: string
          max_pax?: number | null
          min_pax?: number
          position?: number
          price_xof?: number
        }
        Relationships: [
          {
            foreignKeyName: "circuit_price_tiers_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      circuits: {
        Row: {
          category: Database["public"]["Enums"]["circuit_category"]
          created_at: string
          destination_id: string
          duration_days: number
          excluded: string[]
          guide_id: string | null
          id: string
          images: string[]
          included: string[]
          is_featured: boolean
          price_eur: number | null
          price_xof: number
          seo_description: string | null
          seo_title: string | null
          slug: string
          theme: string
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["circuit_category"]
          created_at?: string
          destination_id: string
          duration_days: number
          excluded?: string[]
          guide_id?: string | null
          id?: string
          images?: string[]
          included?: string[]
          is_featured?: boolean
          price_eur?: number | null
          price_xof: number
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          theme: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["circuit_category"]
          created_at?: string
          destination_id?: string
          duration_days?: number
          excluded?: string[]
          guide_id?: string | null
          id?: string
          images?: string[]
          included?: string[]
          is_featured?: boolean
          price_eur?: number | null
          price_xof?: number
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          theme?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circuits_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circuits_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          author: string
          client_id: string
          content: string
          created_at: string
          id: string
        }
        Insert: {
          author: string
          client_id: string
          content: string
          created_at?: string
          id?: string
        }
        Update: {
          author?: string
          client_id?: string
          content?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          created_at: string
          email: string
          id: string
          loyalty_note: string | null
          name: string
          phone: string
          preferred_contact: Database["public"]["Enums"]["contact_method"]
          tags: string[]
          updated_at: string
          vip_tier: Database["public"]["Enums"]["vip_tier"]
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          id?: string
          loyalty_note?: string | null
          name: string
          phone: string
          preferred_contact?: Database["public"]["Enums"]["contact_method"]
          tags?: string[]
          updated_at?: string
          vip_tier?: Database["public"]["Enums"]["vip_tier"]
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          id?: string
          loyalty_note?: string | null
          name?: string
          phone?: string
          preferred_contact?: Database["public"]["Enums"]["contact_method"]
          tags?: string[]
          updated_at?: string
          vip_tier?: Database["public"]["Enums"]["vip_tier"]
        }
        Relationships: []
      }
      cms_seo_settings: {
        Row: {
          id: number
          meta_description: string
          og_image: string | null
          site_title: string
          updated_at: string
        }
        Insert: {
          id?: number
          meta_description?: string
          og_image?: string | null
          site_title?: string
          updated_at?: string
        }
        Update: {
          id?: number
          meta_description?: string
          og_image?: string | null
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      communication_templates: {
        Row: {
          body: string
          channel: Database["public"]["Enums"]["comm_channel"]
          created_at: string
          id: string
          name: string
          phase: Database["public"]["Enums"]["task_phase"] | null
          scope: Database["public"]["Enums"]["comm_template_scope"]
          subject: string | null
          updated_at: string
        }
        Insert: {
          body: string
          channel: Database["public"]["Enums"]["comm_channel"]
          created_at?: string
          id?: string
          name: string
          phase?: Database["public"]["Enums"]["task_phase"] | null
          scope: Database["public"]["Enums"]["comm_template_scope"]
          subject?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          channel?: Database["public"]["Enums"]["comm_channel"]
          created_at?: string
          id?: string
          name?: string
          phase?: Database["public"]["Enums"]["task_phase"] | null
          scope?: Database["public"]["Enums"]["comm_template_scope"]
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      destination_points_of_interest: {
        Row: {
          description: string
          destination_id: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          position: number
        }
        Insert: {
          description: string
          destination_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          position?: number
        }
        Update: {
          description?: string
          destination_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "destination_points_of_interest_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          best_period: string
          climate: string
          country: string
          created_at: string
          description: string
          highlights: string[]
          id: string
          images: string[]
          is_featured: boolean
          is_international: boolean
          latitude: number | null
          longitude: number | null
          name: string
          rating: number
          region: string | null
          reviews_count: number
          seo_description: string | null
          seo_title: string | null
          slug: string
          starting_price_xof: number
          updated_at: string
        }
        Insert: {
          best_period: string
          climate: string
          country: string
          created_at?: string
          description: string
          highlights?: string[]
          id?: string
          images?: string[]
          is_featured?: boolean
          is_international?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          rating?: number
          region?: string | null
          reviews_count?: number
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          starting_price_xof?: number
          updated_at?: string
        }
        Update: {
          best_period?: string
          climate?: string
          country?: string
          created_at?: string
          description?: string
          highlights?: string[]
          id?: string
          images?: string[]
          is_featured?: boolean
          is_international?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          rating?: number
          region?: string | null
          reviews_count?: number
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          starting_price_xof?: number
          updated_at?: string
        }
        Relationships: []
      }
      event_requests: {
        Row: {
          agent_id: string | null
          budget_xof: number
          client_id: string
          created_at: string
          event_date: string
          guest_count: number
          id: string
          location: string | null
          quote_amount_xof: number | null
          quote_file: string | null
          services: string[]
          status: Database["public"]["Enums"]["event_status"]
          type: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          budget_xof: number
          client_id: string
          created_at?: string
          event_date: string
          guest_count: number
          id?: string
          location?: string | null
          quote_amount_xof?: number | null
          quote_file?: string | null
          services?: string[]
          status?: Database["public"]["Enums"]["event_status"]
          type: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          budget_xof?: number
          client_id?: string
          created_at?: string
          event_date?: string
          guest_count?: number
          id?: string
          location?: string | null
          quote_amount_xof?: number | null
          quote_file?: string | null
          services?: string[]
          status?: Database["public"]["Enums"]["event_status"]
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_requests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      event_timeline: {
        Row: {
          actor: string
          created_at: string
          detail: string | null
          event_request_id: string
          id: string
          label: string
        }
        Insert: {
          actor: string
          created_at?: string
          detail?: string | null
          event_request_id: string
          id?: string
          label: string
        }
        Update: {
          actor?: string
          created_at?: string
          detail?: string | null
          event_request_id?: string
          id?: string
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_timeline_event_request_id_fkey"
            columns: ["event_request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_bookings: {
        Row: {
          client_id: string
          created_at: string
          depart_date: string
          destination: string
          flight_class: string
          id: string
          origin: string
          passengers: number
          pnr_code: string | null
          price_xof: number
          return_date: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          depart_date: string
          destination: string
          flight_class?: string
          id?: string
          origin: string
          passengers?: number
          pnr_code?: string | null
          price_xof: number
          return_date?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          depart_date?: string
          destination?: string
          flight_class?: string
          id?: string
          origin?: string
          passengers?: number
          pnr_code?: string | null
          price_xof?: number
          return_date?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_content: {
        Row: {
          featured_circuit: Json
          featured_destinations: Json
          footer: Json
          hero: Json
          id: number
          newsletter: Json
          sections_order: Json
          services: Json
          stats: Json
          testimonials_config: Json
          updated_at: string
          why_us: Json
        }
        Insert: {
          featured_circuit?: Json
          featured_destinations?: Json
          footer?: Json
          hero?: Json
          id?: number
          newsletter?: Json
          sections_order?: Json
          services?: Json
          stats?: Json
          testimonials_config?: Json
          updated_at?: string
          why_us?: Json
        }
        Update: {
          featured_circuit?: Json
          featured_destinations?: Json
          footer?: Json
          hero?: Json
          id?: number
          newsletter?: Json
          sections_order?: Json
          services?: Json
          stats?: Json
          testimonials_config?: Json
          updated_at?: string
          why_us?: Json
        }
        Relationships: []
      }
      homepage_content_versions: {
        Row: {
          actor: string
          content: Json
          created_at: string
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["homepage_version_status"]
        }
        Insert: {
          actor: string
          content: Json
          created_at?: string
          id?: string
          published_at?: string | null
          status: Database["public"]["Enums"]["homepage_version_status"]
        }
        Update: {
          actor?: string
          content?: Json
          created_at?: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["homepage_version_status"]
        }
        Relationships: []
      }
      loyalty_offers: {
        Row: {
          active: boolean
          created_at: string
          description: string
          discount_percent: number | null
          id: string
          tier_required: Database["public"]["Enums"]["vip_tier"]
          title: string
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          discount_percent?: number | null
          id?: string
          tier_required?: Database["public"]["Enums"]["vip_tier"]
          title: string
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          discount_percent?: number | null
          id?: string
          tier_required?: Database["public"]["Enums"]["vip_tier"]
          title?: string
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      payment_schedules: {
        Row: {
          amount_xof: number
          booking_id: string
          created_at: string
          due_date: string
          id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["schedule_status"]
        }
        Insert: {
          amount_xof: number
          booking_id: string
          created_at?: string
          due_date: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["schedule_status"]
        }
        Update: {
          amount_xof?: number
          booking_id?: string
          created_at?: string
          due_date?: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["schedule_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payment_schedules_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_xof: number
          booking_id: string
          created_at: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_ref: string | null
        }
        Insert: {
          amount_xof: number
          booking_id: string
          created_at?: string
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
        }
        Update: {
          amount_xof?: number
          booking_id?: string
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          admin_notes: string | null
          agent_id: string | null
          booking_id: string | null
          channel: Database["public"]["Enums"]["ticket_channel"]
          client_id: string
          created_at: string
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          trip_id: string | null
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          agent_id?: string | null
          booking_id?: string | null
          channel: Database["public"]["Enums"]["ticket_channel"]
          client_id: string
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          trip_id?: string | null
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          agent_id?: string | null
          booking_id?: string | null
          channel?: Database["public"]["Enums"]["ticket_channel"]
          client_id?: string
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          trip_id?: string | null
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      task_template_items: {
        Row: {
          assignee_role: string
          category: Database["public"]["Enums"]["task_category"]
          communication_template_id: string | null
          communication_trigger:
            | Database["public"]["Enums"]["comm_trigger_mode"]
            | null
          due_offset_days: number
          id: string
          phase: Database["public"]["Enums"]["task_phase"]
          position: number
          priority: Database["public"]["Enums"]["task_priority"]
          sub_items: string[]
          supplier_tag: string | null
          task_template_id: string
          title: string
        }
        Insert: {
          assignee_role: string
          category: Database["public"]["Enums"]["task_category"]
          communication_template_id?: string | null
          communication_trigger?:
            | Database["public"]["Enums"]["comm_trigger_mode"]
            | null
          due_offset_days: number
          id?: string
          phase: Database["public"]["Enums"]["task_phase"]
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          sub_items?: string[]
          supplier_tag?: string | null
          task_template_id: string
          title: string
        }
        Update: {
          assignee_role?: string
          category?: Database["public"]["Enums"]["task_category"]
          communication_template_id?: string | null
          communication_trigger?:
            | Database["public"]["Enums"]["comm_trigger_mode"]
            | null
          due_offset_days?: number
          id?: string
          phase?: Database["public"]["Enums"]["task_phase"]
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          sub_items?: string[]
          supplier_tag?: string | null
          task_template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_template_items_communication_template_id_fkey"
            columns: ["communication_template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_template_items_task_template_id_fkey"
            columns: ["task_template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          circuit_theme: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          circuit_theme?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          circuit_theme?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_id: string | null
          content: string
          created_at: string
          destination_id: string | null
          id: string
          rating: number
          status: Database["public"]["Enums"]["testimonial_status"]
          trip_title: string | null
          user_avatar: string | null
          user_name: string
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string
          destination_id?: string | null
          id?: string
          rating?: number
          status?: Database["public"]["Enums"]["testimonial_status"]
          trip_title?: string | null
          user_avatar?: string | null
          user_name: string
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string
          destination_id?: string | null
          id?: string
          rating?: number
          status?: Database["public"]["Enums"]["testimonial_status"]
          trip_title?: string | null
          user_avatar?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          author: string
          channel: Database["public"]["Enums"]["ticket_channel"]
          content: string
          created_at: string
          from_client: boolean
          id: string
          ticket_id: string
        }
        Insert: {
          author: string
          channel: Database["public"]["Enums"]["ticket_channel"]
          content: string
          created_at?: string
          from_client?: boolean
          id?: string
          ticket_id: string
        }
        Update: {
          author?: string
          channel?: Database["public"]["Enums"]["ticket_channel"]
          content?: string
          created_at?: string
          from_client?: boolean
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_timeline: {
        Row: {
          actor: string | null
          created_at: string
          detail: string | null
          id: string
          label: string
          ticket_id: string
        }
        Insert: {
          actor?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          label: string
          ticket_id: string
        }
        Update: {
          actor?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          label?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_timeline_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_checkins: {
        Row: {
          day: number
          done: boolean
          participant_id: string
          trip_id: string
        }
        Insert: {
          day: number
          done?: boolean
          participant_id: string
          trip_id: string
        }
        Update: {
          day?: number
          done?: boolean
          participant_id?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_checkins_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "trip_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_checkins_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_communications: {
        Row: {
          body: string
          channel: Database["public"]["Enums"]["comm_channel"]
          created_at: string
          created_by: string
          id: string
          recipient_participant_ids: string[]
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["comm_status"]
          subject: string | null
          task_id: string | null
          template_id: string | null
          trip_id: string
        }
        Insert: {
          body: string
          channel: Database["public"]["Enums"]["comm_channel"]
          created_at?: string
          created_by: string
          id?: string
          recipient_participant_ids?: string[]
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["comm_status"]
          subject?: string | null
          task_id?: string | null
          template_id?: string | null
          trip_id: string
        }
        Update: {
          body?: string
          channel?: Database["public"]["Enums"]["comm_channel"]
          created_at?: string
          created_by?: string
          id?: string
          recipient_participant_ids?: string[]
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["comm_status"]
          subject?: string | null
          task_id?: string | null
          template_id?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_communications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "trip_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_communications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_communications_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_feedbacks: {
        Row: {
          author: string
          comment: string
          id: string
          rating: number
          submitted_at: string
          trip_id: string
        }
        Insert: {
          author: string
          comment: string
          id?: string
          rating?: number
          submitted_at?: string
          trip_id: string
        }
        Update: {
          author?: string
          comment?: string
          id?: string
          rating?: number
          submitted_at?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_feedbacks_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_media: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          trip_id: string
          type: Database["public"]["Enums"]["media_type"]
          uploaded_by: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          trip_id: string
          type?: Database["public"]["Enums"]["media_type"]
          uploaded_by: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          trip_id?: string
          type?: Database["public"]["Enums"]["media_type"]
          uploaded_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_media_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_participants: {
        Row: {
          checklist: Json
          client_id: string | null
          created_at: string
          emergency_contact: string | null
          id: string
          name: string
          trip_id: string
        }
        Insert: {
          checklist?: Json
          client_id?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          name: string
          trip_id: string
        }
        Update: {
          checklist?: Json
          client_id?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          name?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_participants_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_participants_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_report_action_items: {
        Row: {
          created_at: string
          done: boolean
          id: string
          label: string
          report_id: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          id?: string
          label: string
          report_id: string
        }
        Update: {
          created_at?: string
          done?: boolean
          id?: string
          label?: string
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_report_action_items_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "trip_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_reports: {
        Row: {
          finalized_at: string | null
          finalized_by: string | null
          generated_at: string
          generated_by: string
          id: string
          manual: Json
          status: Database["public"]["Enums"]["trip_report_status"]
          trip_id: string
          updated_at: string
        }
        Insert: {
          finalized_at?: string | null
          finalized_by?: string | null
          generated_at?: string
          generated_by: string
          id?: string
          manual?: Json
          status?: Database["public"]["Enums"]["trip_report_status"]
          trip_id: string
          updated_at?: string
        }
        Update: {
          finalized_at?: string | null
          finalized_by?: string | null
          generated_at?: string
          generated_by?: string
          id?: string
          manual?: Json
          status?: Database["public"]["Enums"]["trip_report_status"]
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_reports_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_tasks: {
        Row: {
          assignee_id: string | null
          attachments: Json
          category: Database["public"]["Enums"]["task_category"]
          communication_template_id: string | null
          communication_trigger:
            | Database["public"]["Enums"]["comm_trigger_mode"]
            | null
          created_at: string
          due_date: string
          id: string
          phase: Database["public"]["Enums"]["task_phase"]
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          sub_items: Json
          supplier_tag: string | null
          template_item_id: string | null
          title: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          attachments?: Json
          category: Database["public"]["Enums"]["task_category"]
          communication_template_id?: string | null
          communication_trigger?:
            | Database["public"]["Enums"]["comm_trigger_mode"]
            | null
          created_at?: string
          due_date: string
          id?: string
          phase: Database["public"]["Enums"]["task_phase"]
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          sub_items?: Json
          supplier_tag?: string | null
          template_item_id?: string | null
          title: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          attachments?: Json
          category?: Database["public"]["Enums"]["task_category"]
          communication_template_id?: string | null
          communication_trigger?:
            | Database["public"]["Enums"]["comm_trigger_mode"]
            | null
          created_at?: string
          due_date?: string
          id?: string
          phase?: Database["public"]["Enums"]["task_phase"]
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          sub_items?: Json
          supplier_tag?: string | null
          template_item_id?: string | null
          title?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_tasks_communication_template_id_fkey"
            columns: ["communication_template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_tasks_template_item_id_fkey"
            columns: ["template_item_id"]
            isOneToOne: false
            referencedRelation: "task_template_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_tasks_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_timeline: {
        Row: {
          actor: string | null
          date: string
          detail: string | null
          id: string
          label: string
          trip_id: string
        }
        Insert: {
          actor?: string | null
          date?: string
          detail?: string | null
          id?: string
          label: string
          trip_id: string
        }
        Update: {
          actor?: string | null
          date?: string
          detail?: string | null
          id?: string
          label?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_timeline_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_updates: {
        Row: {
          author: string
          author_id: string | null
          created_at: string
          id: string
          media_urls: string[]
          message: string
          trip_id: string
        }
        Insert: {
          author: string
          author_id?: string | null
          created_at?: string
          id?: string
          media_urls?: string[]
          message: string
          trip_id: string
        }
        Update: {
          author?: string
          author_id?: string | null
          created_at?: string
          id?: string
          media_urls?: string[]
          message?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_updates_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          booking_id: string
          created_at: string
          end_date: string
          guide_id: string | null
          id: string
          start_date: string
          status: Database["public"]["Enums"]["trip_status"]
          type: Database["public"]["Enums"]["trip_type"]
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          end_date: string
          guide_id?: string | null
          id?: string
          start_date: string
          status?: Database["public"]["Enums"]["trip_status"]
          type?: Database["public"]["Enums"]["trip_type"]
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          end_date?: string
          guide_id?: string | null
          id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["trip_status"]
          type?: Database["public"]["Enums"]["trip_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_documents: {
        Row: {
          id: string
          name: string
          uploaded_at: string
          url: string
          visa_request_id: string
        }
        Insert: {
          id?: string
          name: string
          uploaded_at?: string
          url: string
          visa_request_id: string
        }
        Update: {
          id?: string
          name?: string
          uploaded_at?: string
          url?: string
          visa_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visa_documents_visa_request_id_fkey"
            columns: ["visa_request_id"]
            isOneToOne: false
            referencedRelation: "visa_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_requests: {
        Row: {
          admin_notes: string | null
          agent_id: string | null
          client_id: string
          country: string
          fee_xof: number
          id: string
          status: Database["public"]["Enums"]["visa_status"]
          submitted_at: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          agent_id?: string | null
          client_id: string
          country: string
          fee_xof: number
          id?: string
          status?: Database["public"]["Enums"]["visa_status"]
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          agent_id?: string | null
          client_id?: string
          country?: string
          fee_xof?: number
          id?: string
          status?: Database["public"]["Enums"]["visa_status"]
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visa_requests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visa_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_timeline: {
        Row: {
          actor: string
          created_at: string
          detail: string | null
          id: string
          label: string
          visa_request_id: string
        }
        Insert: {
          actor: string
          created_at?: string
          detail?: string | null
          id?: string
          label: string
          visa_request_id: string
        }
        Update: {
          actor?: string
          created_at?: string
          detail?: string | null
          id?: string
          label?: string
          visa_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visa_timeline_visa_request_id_fkey"
            columns: ["visa_request_id"]
            isOneToOne: false
            referencedRelation: "visa_requests"
            referencedColumns: ["id"]
          },
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
      admin_role: "SUPER_ADMIN" | "AGENT" | "GUIDE"
      blog_post_status: "DRAFT" | "PUBLISHED"
      booking_status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
      booking_type: "CIRCUIT" | "FLIGHT" | "EVENT"
      circuit_category:
        | "ESCAPADE_LOCALE"
        | "GRAND_CIRCUIT_BENIN"
        | "REGIONAL"
        | "INTERNATIONAL"
        | "EVENEMENTIEL"
      comm_channel: "EMAIL" | "SMS" | "PUSH"
      comm_status:
        | "PROGRAMMEE"
        | "EN_ATTENTE_VALIDATION"
        | "ENVOYEE"
        | "ANNULEE"
      comm_template_scope: "TRIP" | "SYSTEM"
      comm_trigger_mode: "AUTO" | "VALIDATION" | "MANUEL"
      contact_method: "EMAIL" | "PHONE" | "WHATSAPP"
      departure_status: "OPEN" | "COMPLET" | "ANNULE"
      event_status:
        | "DRAFT"
        | "REQUESTED"
        | "QUOTED"
        | "CONFIRMED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
      homepage_icon_key:
        | "COMPASS"
        | "PLANE"
        | "FILE_CHECK"
        | "PARTY_POPPER"
        | "HEADPHONES"
        | "WALLET"
      homepage_version_status: "DRAFT" | "PUBLISHED"
      media_type: "PHOTO" | "VIDEO"
      payment_method:
        | "MOBILE_MONEY_MTN"
        | "MOBILE_MONEY_MOOV"
        | "FEDAPAY"
        | "STRIPE_CARD"
        | "BANK_TRANSFER"
        | "CASH"
      payment_status: "PENDING" | "PARTIAL" | "PAID" | "FAILED" | "REFUNDED"
      schedule_status: "PENDING" | "PAID" | "LATE"
      task_category:
        | "LOGISTIQUE"
        | "FOURNISSEURS"
        | "DOCUMENTS_CLIENT"
        | "COMMUNICATION"
        | "FINANCE"
      task_phase: "AVANT" | "PENDANT" | "APRES"
      task_priority: "NORMALE" | "URGENTE"
      task_status: "A_FAIRE" | "EN_COURS" | "FAIT" | "BLOQUE"
      testimonial_status: "PENDING" | "APPROVED" | "REJECTED"
      ticket_channel: "CHAT" | "EMAIL" | "TELEPHONE"
      ticket_priority: "NORMALE" | "URGENTE"
      ticket_status: "OUVERT" | "EN_COURS" | "RESOLU" | "FERME" | "REJETE"
      ticket_type: "SUPPORT" | "RECLAMATION"
      trip_report_status: "DRAFT" | "FINALIZED"
      trip_status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"
      trip_type: "INDIVIDUAL" | "GROUP"
      vip_tier: "STANDARD" | "SILVER" | "GOLD" | "PLATINUM"
      visa_status: "SUBMITTED" | "PROCESSING" | "APPROVED" | "REJECTED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["SUPER_ADMIN", "AGENT", "GUIDE"],
      blog_post_status: ["DRAFT", "PUBLISHED"],
      booking_status: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      booking_type: ["CIRCUIT", "FLIGHT", "EVENT"],
      circuit_category: [
        "ESCAPADE_LOCALE",
        "GRAND_CIRCUIT_BENIN",
        "REGIONAL",
        "INTERNATIONAL",
        "EVENEMENTIEL",
      ],
      comm_channel: ["EMAIL", "SMS", "PUSH"],
      comm_status: [
        "PROGRAMMEE",
        "EN_ATTENTE_VALIDATION",
        "ENVOYEE",
        "ANNULEE",
      ],
      comm_template_scope: ["TRIP", "SYSTEM"],
      comm_trigger_mode: ["AUTO", "VALIDATION", "MANUEL"],
      contact_method: ["EMAIL", "PHONE", "WHATSAPP"],
      departure_status: ["OPEN", "COMPLET", "ANNULE"],
      event_status: [
        "DRAFT",
        "REQUESTED",
        "QUOTED",
        "CONFIRMED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      homepage_icon_key: [
        "COMPASS",
        "PLANE",
        "FILE_CHECK",
        "PARTY_POPPER",
        "HEADPHONES",
        "WALLET",
      ],
      homepage_version_status: ["DRAFT", "PUBLISHED"],
      media_type: ["PHOTO", "VIDEO"],
      payment_method: [
        "MOBILE_MONEY_MTN",
        "MOBILE_MONEY_MOOV",
        "FEDAPAY",
        "STRIPE_CARD",
        "BANK_TRANSFER",
        "CASH",
      ],
      payment_status: ["PENDING", "PARTIAL", "PAID", "FAILED", "REFUNDED"],
      schedule_status: ["PENDING", "PAID", "LATE"],
      task_category: [
        "LOGISTIQUE",
        "FOURNISSEURS",
        "DOCUMENTS_CLIENT",
        "COMMUNICATION",
        "FINANCE",
      ],
      task_phase: ["AVANT", "PENDANT", "APRES"],
      task_priority: ["NORMALE", "URGENTE"],
      task_status: ["A_FAIRE", "EN_COURS", "FAIT", "BLOQUE"],
      testimonial_status: ["PENDING", "APPROVED", "REJECTED"],
      ticket_channel: ["CHAT", "EMAIL", "TELEPHONE"],
      ticket_priority: ["NORMALE", "URGENTE"],
      ticket_status: ["OUVERT", "EN_COURS", "RESOLU", "FERME", "REJETE"],
      ticket_type: ["SUPPORT", "RECLAMATION"],
      trip_report_status: ["DRAFT", "FINALIZED"],
      trip_status: ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"],
      trip_type: ["INDIVIDUAL", "GROUP"],
      vip_tier: ["STANDARD", "SILVER", "GOLD", "PLATINUM"],
      visa_status: ["SUBMITTED", "PROCESSING", "APPROVED", "REJECTED"],
    },
  },
} as const
