"use client";

import { useEffect } from "react";
import { useModalStore } from "@/lib/store/modal-store";

export function CanvasPageClient() {
  const closeModal = useModalStore((s) => s.closeModal);

  useEffect(() => {
    closeModal();
  }, []);

  return null;
}
