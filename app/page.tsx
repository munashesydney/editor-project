"use client";

import { useState } from "react";
import { Canvas } from "../components/canvas";
import { Toolbar } from "../components/toolbar";
import { AIChatPanel } from "../components/chat";
import { Navbar } from "../components/layout";

const PANEL_WIDTH = 320; // px — matches w-80

export default function Home() {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-zinc-100">
      <Navbar chatPanelOpen={aiPanelOpen} />

      {/* Main layout wrapper */}
      <div className="flex-1 flex flex-row overflow-hidden pt-12 relative">

        {/* Main content */}
        <main className="flex-1 h-full flex relative">
        <Canvas />

        {/* Toolbar — centered */}
        <div
          className="absolute bottom-6 z-30"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Toolbar
            onOpenAI={() => setAiPanelOpen(!aiPanelOpen)}
            aiPanelOpen={aiPanelOpen}
          />
        </div>
        </main>

        {/* AI Panel */}
        <AIChatPanel open={aiPanelOpen} />
      </div>
    </div>
  );
}
