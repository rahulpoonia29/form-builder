import { PropertyInput } from '@/components/form-builder/properties';
import BaseComponent from '@/components/form-components/base/baseComponent';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';

// Props for text input component
interface TextInputProps extends BaseComponentProps {
  placeholder?: string;
}

// Custom options for text input
interface TextInputCustomOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
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
  customOptions: TextInputCustomOptions,
  onCustomOptionsChange: (options: TextInputCustomOptions) => void,
) => {
  return (
    <>
      <PropertyInput
        label="Placeholder"
        name="placeholder"
        type="text"
        value={props.placeholder}
        onChange={(value) => onChange({ ...props, placeholder: String(value) })}
      />

      <div className="mt-4 grid grid-cols-2 gap-4">
        <PropertyInput
          label="Min Length"
          name="minLength"
          type="number"
          value={customOptions.minLength}
          onChange={(value) =>
            onCustomOptionsChange({
              ...customOptions,
              minLength: value ? Number(value) : undefined,
            })
          }
        />

        <PropertyInput
          label="Max Length"
          name="maxLength"
          type="number"
          value={customOptions.maxLength}
          onChange={(value) =>
            onCustomOptionsChange({
              ...customOptions,
              maxLength: value ? Number(value) : undefined,
            })
          }
        />
      </div>

      <PropertyInput
        label="Validation Pattern (RegEx)"
        name="pattern"
        type="text"
        value={customOptions.pattern}
        onChange={(value) =>
          onCustomOptionsChange({ ...customOptions, pattern: String(value) })
        }
      />
    </>
  );
};

// Generate Zod schema code for validation
const generateSchemaCode = (
  component: Component<TextInputProps, TextInputCustomOptions>,
): string => {
  const { required, label } = component.props;
  const { minLength, maxLength, pattern } = component.config.customOptions;

  let code = `${component.name}: z.string()`;

  if (required) {
    code += `.min(1, { message: "${label || 'This field'} is required" })`;
  }

  if (minLength !== undefined && minLength > (required ? 1 : 0)) {
    code += `.min(${minLength}, { message: "${label || 'This field'} must be at least ${minLength} characters" })`;
  }

  if (maxLength !== undefined) {
    code += `.max(${maxLength}, { message: "${label || 'This field'} must not exceed ${maxLength} characters" })`;
  }

  if (pattern) {
    code += `.regex(new RegExp("${pattern}"), { message: "${label || 'This field'} format is invalid" })`;
  }

  if (!required) {
    code += `.optional()`;
  }

  return `${code},`;
};

// Generate JSX code for the component
const generateJSXCode = (
  component: Component<TextInputProps, TextInputCustomOptions>,
): string => {
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
const textInputConfig: BaseComponentConfig<
  TextInputProps,
  TextInputCustomOptions
> = {
  name: 'name',
  description: 'Simple text input field',
  component: TextInput,
  defaultProps: {
    label: 'Name',
    required: false,
    helperText: 'Enter your name',
    placeholder: 'Enter your name',
    className: '',
  },
  customOptions: {
    minLength: undefined,
    maxLength: undefined,
    pattern: undefined,
  },
  renderPropertiesEditor,
  generateSchemaCode,
  generateJSXCode,
  generateImportCode,
};

export default textInputConfig;
