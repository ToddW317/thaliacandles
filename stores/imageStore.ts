import { create } from 'zustand'

interface ProductImage {
  id?: string
  url: string
  file?: File
  order: number
}

interface ImageHistoryState {
  past: ProductImage[][]
  present: ProductImage[]
  future: ProductImage[][]
  canUndo: boolean
  canRedo: boolean
  setImages: (images: ProductImage[]) => void
  undo: () => void
  redo: () => void
  addToHistory: (images: ProductImage[]) => void
}

export const useImageStore = create<ImageHistoryState>((set) => ({
  past: [],
  present: [],
  future: [],
  canUndo: false,
  canRedo: false,

  setImages: (images) => set({ present: images }),

  addToHistory: (images) => 
    set((state) => ({
      past: [...state.past, state.present],
      present: images,
      future: [],
      canUndo: true,
      canRedo: false,
    })),

  undo: () => 
    set((state) => {
      if (state.past.length === 0) return state

      const previous = state.past[state.past.length - 1]
      const newPast = state.past.slice(0, -1)

      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
        canUndo: newPast.length > 0,
        canRedo: true,
      }
    }),

  redo: () => 
    set((state) => {
      if (state.future.length === 0) return state

      const next = state.future[0]
      const newFuture = state.future.slice(1)

      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      }
    }),
})) 