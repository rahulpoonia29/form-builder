import { FormComponentsCategory } from '@/types/form';
import textInputConfig from './inputs/text-input';
import passwordInputConfig from './inputs/password-input';
import emailInputConfig from './inputs/email-input';
import numberInputConfig from './inputs/number-input';
import textareaInputConfig from './inputs/textarea-input';
import phoneInputConfig from './inputs/phone-input';
import selectInputConfig from './selectors/select-input';

// Registry of all form components
const formComponents: FormComponentsCategory[] = [
  {
    name: 'Input Fields',
    components: [
      textInputConfig,
      passwordInputConfig,
      emailInputConfig,
      numberInputConfig,
      textareaInputConfig,
      phoneInputConfig,
    ],
  },
  {
    name: 'Selectors',
    components: [selectInputConfig],
  },
  {
    name: 'Buttons',
    components: [],
  },
];

export default formComponents;
