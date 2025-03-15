import { BaseComponentConfig, Component } from '@/types/form';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

interface FormBuilderState {
  components: Component[];
  selectedComponent: string | null;

  // Actions
  addComponent: (type: BaseComponentConfig<unknown>) => void;
  removeComponent: (id: string) => void;
  updateComponentName: (id: string, name: string) => void;
  updateComponentProps: (id: string, props: Partial<unknown>) => void;
  setSelectedComponent: (id: string | null) => void;
  reorderComponents: (activeId: string, overId: string) => void;
  reset: () => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
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

    set((state) => ({
      components: [...state.components, newComponent],
      selectedComponent: newComponent.id,
    }));
  },

  removeComponent: (id) => {
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedComponent:
        state.selectedComponent === id ? null : state.selectedComponent,
    }));
  },

  updateComponentName: (id, name) => {
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, name } : c,
      ),
    }));
  },

  updateComponentProps: (id, props) => {
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, props: { ...c.props, ...props } } : c,
      ),
    }));
  },

  setSelectedComponent: (id) => {
    set({ selectedComponent: id });
  },

  reorderComponents: (activeId, overId) => {
    set((state) => {
      const oldIndex = state.components.findIndex((c) => c.id === activeId);
      const newIndex = state.components.findIndex((c) => c.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      const newComponents = [...state.components];
      const [movedComponent] = newComponents.splice(oldIndex, 1);
      newComponents.splice(newIndex, 0, movedComponent);

      return { components: newComponents };
    });
  },

  reset: () => {
    set({
      components: [],
      selectedComponent: null,
    });
  },
}));
