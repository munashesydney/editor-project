export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface WorkspaceWithMeta extends Workspace {
  project_count?: number;
  member_count?: number;
}
