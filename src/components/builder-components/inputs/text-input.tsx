import BaseComponent from '@/components/builder-components/base/baseComponent';
import { PropertyInput } from '@/components/form-builder/properties';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';
import { TextCursorInputIcon } from 'lucide-react';

// Props for text input component
export interface TextInputProps extends BaseComponentProps {
  placeholder?: string;
}

// The actual text input component
export function TextInput({
  label,
  required,
  helperText,
  placeholder,
  className,
}: TextInputProps) {
  return (
    <BaseComponent {...{ label, required, helperText }}>
      <Input placeholder={placeholder || ''} className={cn(className)} />
    </BaseComponent>
  );
}

// Custom properties editor for text input
const renderPropertiesEditor = (
  props: TextInputProps,
  onChange: (props: TextInputProps) => void,
) => {
  return (
    <PropertyInput
      label="Placeholder"
      name="placeholder"
      type="text"
      value={props.placeholder}
      onChange={(value) => onChange({ ...props, placeholder: String(value) })}
    />
  );
};

// Generate Zod schema code for validation
const generateSchemaCode = (component: Component<TextInputProps>): string => {
  const { required, label } = component.props;

  return required
    ? `${component.name}: z.string().min(1, { message: "${label || 'This field'} is required" }),`
    : `${component.name}: z.string().optional(),`;
};

// Generate JSX code for the component
const generateJSXCode = (component: Component<TextInputProps>): string => {
  const { label, helperText, required, placeholder, className } =
    component.props;

  return `<FormField
  control={form.control}
  name="${component.name}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${label}${required ? ' *' : ''}</FormLabel>
      <FormControl>
        <Input 
          placeholder="${placeholder || ''}" 
          className="${className || ''}"
          {...field} 
        />
      </FormControl>
      ${helperText ? `<FormDescription>${helperText}</FormDescription>` : ''}
      <FormMessage />
    </FormItem>
  )}
/>`;
};

// Generate import code
const generateImportCode = () => {
  return `import { Input } from "@/components/ui/input";`;
};

// Component configuration
const textInputConfig: BaseComponentConfig<TextInputProps> = {
  name: 'textInput',
  description: 'Simple text input field',
  component: TextInput,
  icon: TextCursorInputIcon,
  defaultProps: {
    label: 'Name',
    required: false,
    helperText: 'Enter your name',
    placeholder: 'Enter your name',
    className: '',
  },
  properties: {},
  renderPropertiesEditor,
  generateSchemaCode,
  generateJSXCode,
  generateImportCode,
};

export default textInputConfig;
