import { create } from 'zustand'

export type SheetType = 'edit-workspace' | 'edit-project' | null

interface SheetState {
  isOpen: boolean
  type: SheetType
  data: any // Can hold workspace or project object
  openSheet: (type: SheetType, data?: any) => void
  closeSheet: () => void
}

export const useSheetStore = create<SheetState>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openSheet: (type, data = null) => set({ isOpen: true, type, data }),
  closeSheet: () => set({ isOpen: false, type: null, data: null }),
}))
