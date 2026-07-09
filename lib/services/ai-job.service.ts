import { createClient } from "../supabase/client";


// Service to interact with the Supabase ai_jobs table
export const aiJobService = {
  /**
   * Creates a new AI generation job in the database.
   * The Express worker will pick this up automatically.
   */
  async createJob(prompt: string, projectId?: string): Promise<string> {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be authenticated to run AI jobs");

    const { data, error } = await supabase
      .from("ai_jobs")
      .insert({
        user_id: user.id,
        project_id: projectId || null,
        prompt: prompt,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw error;
    
    return data.id;
  },

  /**
   * Subscribes to real-time updates for a specific job ID.
   */
  subscribeToJob(jobId: string, onUpdate: (payload: any) => void) {
    const supabase = createClient();
    
    const channel = supabase
      .channel(`job-${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ai_jobs",
          filter: `id=eq.${jobId}`,
        },
        (payload) => {
          onUpdate(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
