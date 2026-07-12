import React from "react";
import { createClient } from "@/lib/supabase/server";
import { CanvasEditor, CanvasHydrator, CanvasPageClient } from "@/components/canvas";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }: { params: { id: string, projectId: string } }) {
  const supabase = createClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.projectId)
    .single();

  if (error || !project) {
    console.error(error);
    redirect(`/workspaces/${params.id}`);
  }

  // Ensure canvas_state is always an object, not null
  if (!project.canvas_state) {
    project.canvas_state = { elements: [], settings: { backgroundColor: "#ffffff", width: project.width || 1920, height: project.height || 1080 } };
  }

  return (
    <>
      <CanvasPageClient />
      <CanvasHydrator project={project} />
      <CanvasEditor projectName={project.name} workspaceId={project.workspace_id} />
    </>
  );
}
