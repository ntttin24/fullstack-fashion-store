import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Attribute {
  id: string;
  name: string;
}

interface AttributesState {
  colors: Attribute[];
  sizes: Attribute[];
  addColor: (name: string) => void;
  updateColor: (id: string, name: string) => void;
  deleteColor: (id: string) => void;
  addSize: (name: string) => void;
  updateSize: (id: string, name: string) => void;
  deleteSize: (id: string) => void;
  initDefaults: () => void;
}

export const useAttributesStore = create<AttributesState>()(
  persist(
    (set, get) => ({
      colors: [],
      sizes: [],

      addColor: (name: string) => {
        const newColor: Attribute = {
          id: Date.now().toString(),
          name: name.trim(),
        };
        set((state) => ({ colors: [...state.colors, newColor] }));
      },

      updateColor: (id: string, name: string) => {
        set((state) => ({
          colors: state.colors.map((c) =>
            c.id === id ? { ...c, name: name.trim() } : c
          ),
        }));
      },

      deleteColor: (id: string) => {
        set((state) => ({
          colors: state.colors.filter((c) => c.id !== id),
        }));
      },

      addSize: (name: string) => {
        const newSize: Attribute = {
          id: Date.now().toString(),
          name: name.trim(),
        };
        set((state) => ({ sizes: [...state.sizes, newSize] }));
      },

      updateSize: (id: string, name: string) => {
        set((state) => ({
          sizes: state.sizes.map((s) =>
            s.id === id ? { ...s, name: name.trim() } : s
          ),
        }));
      },

      deleteSize: (id: string) => {
        set((state) => ({
          sizes: state.sizes.filter((s) => s.id !== id),
        }));
      },

      initDefaults: () => {
        const state = get();
        if (state.colors.length === 0 && state.sizes.length === 0) {
          // Default colors
          const defaultColors = [
            { id: '1', name: 'Đen' },
            { id: '2', name: 'Trắng' },
            { id: '3', name: 'Xanh' },
            { id: '4', name: 'Đỏ' },
            { id: '5', name: 'Vàng' },
          ];
          
          // Default sizes
          const defaultSizes = [
            { id: '1', name: 'S' },
            { id: '2', name: 'M' },
            { id: '3', name: 'L' },
            { id: '4', name: 'XL' },
            { id: '5', name: 'XXL' },
          ];

          set({ colors: defaultColors, sizes: defaultSizes });
        }
      },
    }),
    {
      name: 'attributes-storage',
    }
  )
);



