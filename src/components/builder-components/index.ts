import { FormComponentsCategory } from '@/types/form';
import textInputConfig from './inputs/text-input';

// Registry of all form components
const formComponents: FormComponentsCategory[] = [
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

export default formComponents;
