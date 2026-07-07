"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { projectService } from "@/lib/services/project.service";
import { useRouter } from "next/navigation";

interface NewProjectButtonProps {
  workspaceId: string;
}

export function NewProjectButton({ workspaceId }: NewProjectButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const project = await projectService.createProject(workspaceId, "Untitled Project");
      router.push(`/workspaces/${workspaceId}/project/${project.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCreate}
      disabled={loading}
      className="group flex flex-col items-center justify-center h-[240px] rounded-none border-2 border-dashed border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer"
    >
      <div className="w-12 h-12 rounded-none bg-zinc-100 group-hover:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors mb-3">
        <Plus className="w-6 h-6" />
      </div>
      <span className="font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors">
        {loading ? "Creating..." : "Blank Canvas"}
      </span>
    </button>
  );
}
