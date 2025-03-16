import { BaseComponentConfig, Component } from '@/types/form';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface FormBuilderState {
  components: Component[];
  selectedComponent: string | null;

  // Actions
  addComponent: (type: BaseComponentConfig<unknown, unknown>) => void;
  removeComponent: (id: string) => void;
  updateComponentName: (id: string, name: string) => void;
  updateComponentProps: (id: string, props: Partial<unknown>) => void;
  updateComponentCustomOptions: (
    id: string,
    customOptions: Record<string, unknown>,
  ) => void;
  setSelectedComponent: (id: string | null) => void;
  reorderComponents: (activeId: string, overId: string) => void;
  reset: () => void;
}

// Use immer middleware for more efficient updates
export const useFormBuilderStore = create<FormBuilderState>()(
  immer((set) => ({
    components: [],
    selectedComponent: null,

    addComponent: (config) => {
      if (!config) return;

      const id = nanoid();
      const suffix = id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3);

      const newComponent = {
        id,
        name: `${config.name.toLowerCase()}_${suffix}`,
        component: config.component,
        props: config.defaultProps,
        config,
      } as Component;

      set((state) => {
        state.components.push(newComponent);
        state.selectedComponent = newComponent.id;
      });
    },

    removeComponent: (id) => {
      set((state) => {
        state.components = state.components.filter((c) => c.id !== id);
        if (state.selectedComponent === id) {
          state.selectedComponent = null;
        }
      });
    },

    updateComponentName: (id, name) => {
      set((state) => {
        const component = state.components.find((c) => c.id === id);
        if (component) {
          component.name = name;
        }
      });
    },

    updateComponentProps: (id, props) => {
      set((state) => {
        const component = state.components.find((c) => c.id === id);
        if (component) {
          component.props = { ...component.props, ...props };
        }
      });
    },

    updateComponentCustomOptions: (id, customOptions) => {
      set((state) => {
        const component = state.components.find((c) => c.id === id);
        if (component) {
          component.config.customOptions = {
            ...component.config.customOptions,
            ...customOptions,
          };
        }
      });
    },

    setSelectedComponent: (id) => {
      set((state) => {
        state.selectedComponent = id;
      });
    },

    reorderComponents: (activeId, overId) => {
      set((state) => {
        const oldIndex = state.components.findIndex((c) => c.id === activeId);
        const newIndex = state.components.findIndex((c) => c.id === overId);

        if (oldIndex === -1 || newIndex === -1) return;

        const movedComponent = state.components[oldIndex];
        state.components.splice(oldIndex, 1);
        state.components.splice(newIndex, 0, movedComponent);
      });
    },

    reset: () => {
      set((state) => {
        state.components = [];
        state.selectedComponent = null;
      });
    },
  })),
);

// Create memoized selectors to prevent unnecessary re-renders
export const useSelectedComponent = () =>
  useFormBuilderStore((state) => {
    const selectedId = state.selectedComponent;
    return selectedId
      ? state.components.find((c) => c.id === selectedId)
      : null;
  });

export const useComponentIds = () =>
  useFormBuilderStore((state) => state.components.map((c) => c.id));
