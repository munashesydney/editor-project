"use client";

import React from "react";
import Link from "next/link";
import { LayoutTemplate, Clock, MoreVertical } from "lucide-react";
import { Project } from "@/lib/models/project.model";
import { useSheetStore } from "@/lib/store/sheet-store";
import { cn } from "@/lib/utils";
import { ProjectPreview } from "../canvas/ProjectPreview";

interface ProjectCardProps {
  project: Project;
  onProjectDeleted?: (projectId: string) => void;
}

export function ProjectCard({ project, onProjectDeleted }: ProjectCardProps) {
  const { openSheet } = useSheetStore();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    openSheet('edit-project', { ...project, onProjectDeleted });
  };

  return (
    <Link
      href={`/workspaces/${project.workspace_id}/project/${project.id}`}
      className="group bg-white rounded-none border-2 border-zinc-200 overflow-hidden hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(24,24,27,1)] hover:border-zinc-900 transition-all duration-200 flex flex-col h-[240px]"
    >
      <div className={cn("flex-1 min-h-0 flex items-center justify-center relative bg-zinc-100 p-4")}>
        <div className="w-full h-full relative group-hover:scale-[1.02] transition-transform duration-500 shadow-sm border border-black/10 bg-white">
          <ProjectPreview
            elements={project.canvas_state?.elements || []}
            width={project.width || 1920}
            height={project.height || 1080}
            backgroundColor={project.canvas_state?.settings?.backgroundColor || "#ffffff"}
          />
        </div>
        {/* Hover overlay for open button */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-zinc-900 text-white font-semibold px-4 py-2 rounded-none shadow-sm translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            Open Project
          </span>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-zinc-100 flex justify-between items-start shrink-0">
        <div>
          <h3 className="font-semibold text-zinc-900 text-sm truncate w-[160px] uppercase">{project.name}</h3>
          <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1 font-mono uppercase">
            <Clock className="w-3 h-3" /> {new Date(project.updated_at).toLocaleDateString()}
          </p>
        </div>
        <button 
          onClick={handleEdit}
          className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
}
