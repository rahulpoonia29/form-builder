import { FormComponentsCategory } from '@/types/formComponent';
import textInputConfig from './inputs/text-input';

// Registry of all form components
export const formComponentsRegistry: FormComponentsCategory[] = [
  {
    name: 'Input Fields',
    components: [textInputConfig],
  },
  {
    name: 'Selectors',
    components: [],
  },
  {
    name: 'Buttons',
    components: [],
  },
];

// Helper to get all component configs for the sidebar
export const getSidebarComponentConfigs = () => {
  return Object.values(formComponentsRegistry).map(
    ({ name, icon, description }) => ({
      name,
      icon,
      description,
    }),
  );
};

// Generate code for a component
export const generateComponentCode = (type: string, props: unknown) => {
  // Implementation will depend on component type
  // This is just a placeholder
  return `// Generate code for ${type} with props: ${JSON.stringify(props, null, 2)}`;
};
