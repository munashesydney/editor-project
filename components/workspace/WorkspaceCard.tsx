"use client";

import React from "react";
import Link from "next/link";
import { Users, Folder, MoreVertical, Star } from "lucide-react";
import { WorkspaceWithMeta } from "@/lib/models/workspace.model";
import { useSheetStore } from "@/lib/store/sheet-store";

interface WorkspaceCardProps {
  workspace: WorkspaceWithMeta;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const { openSheet } = useSheetStore();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the workspace
    openSheet('edit-workspace', workspace);
  };

  return (
    <Link 
      href={`/workspaces/${workspace.id}`} 
      className="group bg-white rounded-none border-2 border-zinc-200 p-5 hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(24,24,27,1)] hover:border-zinc-900 transition-all duration-200 relative flex flex-col h-[200px]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-lg group-hover:bg-zinc-900 group-hover:text-white transition-colors">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 transition-colors">{workspace.name}</h2>
            <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-none border border-zinc-200 inline-block mt-1 group-hover:border-zinc-300">
              Team Workspace
            </span>
          </div>
        </div>
        <button 
          className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors"
          onClick={handleEdit}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Folder className="w-4 h-4" /> {workspace.project_count || 0}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> {workspace.member_count || 1}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">
            {new Date(workspace.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
