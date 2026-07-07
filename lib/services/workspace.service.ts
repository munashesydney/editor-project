import { createClient } from '../supabase/client'
import { Workspace, WorkspaceWithMeta } from '../models/workspace.model'

export const workspaceService = {
  async getWorkspaces(): Promise<WorkspaceWithMeta[]> {
    const supabase = createClient()
    
    // In a real app we'd also aggregate project counts here
    // For now we just fetch the workspaces
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Add dummy project counts just for the UI until we do aggregate queries
    return (data as Workspace[]).map(w => ({
      ...w,
      project_count: 0,
      member_count: 1
    }))
  },

  async getWorkspace(id: string): Promise<Workspace> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Workspace
  },

  async createWorkspace(name: string): Promise<Workspace> {
    const supabase = createClient()
    const { data: userResp, error: userErr } = await supabase.auth.getUser()
    if (userErr) throw userErr

    const { data, error } = await supabase
      .from('workspaces')
      .insert([
        { name, owner_id: userResp.user.id }
      ])
      .select()
      .single()

    if (error) throw error
    return data as Workspace
  },

  async updateWorkspace(id: string, name: string): Promise<Workspace> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workspaces')
      .update({ name })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Workspace
  },

  async deleteWorkspace(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
