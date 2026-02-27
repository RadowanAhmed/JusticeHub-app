// shared/types/database.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          user_type: 'client' | 'lawyer' | 'admin';
          full_name: string;
          phone: string;
          avatar_url: string | null;
          specialization: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          user_type: 'client' | 'lawyer' | 'admin';
          full_name: string;
          phone: string;
          avatar_url?: string | null;
          specialization?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          user_type?: 'client' | 'lawyer' | 'admin';
          full_name?: string;
          phone?: string;
          avatar_url?: string | null;
          specialization?: string | null;
          updated_at?: string;
        };
      };
      cases: {
        Row: {
          id: string;
          client_id: string;
          lawyer_id: string | null;
          title: string;
          description: string;
          case_number: string;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high';
          category: string;
          court: string | null;
          next_hearing: string | null;
          documents: string[];
          created_at: string;
          updated_at: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          case_id: string;
          lawyer_id: string;
          client_id: string;
          date_time: string;
          duration_minutes: number;
          status: 'scheduled' | 'completed' | 'cancelled';
          meeting_link: string | null;
          notes: string | null;
          created_at: string;
        };
      };
      legal_documents: {
        Row: {
          id: string;
          case_id: string;
          title: string;
          content: string;
          document_type: string;
          ai_generated: boolean;
          version: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}