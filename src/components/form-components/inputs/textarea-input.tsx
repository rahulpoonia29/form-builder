import { PropertyInput } from '@/components/form-builder/properties';
import BaseComponent from '@/components/form-components/base/baseComponent';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';

// Props for textarea component
interface TextareaInputProps extends BaseComponentProps {
  placeholder?: string;
  rows?: number;
}

// Custom options for textarea validation
interface TextareaInputCustomOptions {
  minLength?: number;
  maxLength?: number;
}

// The actual textarea component
export function TextareaInput({
  label,
  required,
  helperText,
  placeholder,
  rows,
  className,
}: TextareaInputProps) {
  return (
    <BaseComponent {...{ label, required, helperText }}>
      <Textarea
        placeholder={placeholder || ''}
        rows={rows || 3}
        className={cn(className)}
      />
    </BaseComponent>
  );
}

// Custom properties editor for textarea
const renderPropertiesEditor = (
  props: TextareaInputProps,
  onChange: (props: TextareaInputProps) => void,
  customOptions: TextareaInputCustomOptions,
  onCustomOptionsChange: (options: TextareaInputCustomOptions) => void,
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

      <div className="mt-4 space-y-2">
        <label htmlFor="rows" className="text-sm font-medium">
          Number of Rows
        </label>
        <input
          id="rows"
          type="number"
          min="1"
          className="border-input w-full rounded-md border px-3 py-2 text-sm"
          value={props.rows || 3}
          onChange={(e) =>
            onChange({
              ...props,
              rows: Number(e.target.value) || 3,
            })
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="minLength" className="text-sm font-medium">
            Min Length
          </label>
          <input
            id="minLength"
            type="number"
            min="0"
            className="border-input w-full rounded-md border px-3 py-2 text-sm"
            value={customOptions.minLength ?? ''}
            placeholder="No min"
            onChange={(e) =>
              onCustomOptionsChange({
                ...customOptions,
                minLength: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="maxLength" className="text-sm font-medium">
            Max Length
          </label>
          <input
            id="maxLength"
            type="number"
            min="0"
            className="border-input w-full rounded-md border px-3 py-2 text-sm"
            value={customOptions.maxLength ?? ''}
            placeholder="No max"
            onChange={(e) =>
              onCustomOptionsChange({
                ...customOptions,
                maxLength: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>
    </>
  );
};

// Generate Zod schema code for validation based on custom options
const generateSchemaCode = (
  component: Component<TextareaInputProps, TextareaInputCustomOptions>,
): string => {
  const { required, label } = component.props;
  const { minLength, maxLength } = component.config.customOptions;

  let code = `${component.name}: z.string()`;

  // Add required validation
  if (required) {
    code += `.min(1, { message: "${label || 'Text'} is required" })`;
  }

  // Add min length validation if specified and different from required check
  if (minLength !== undefined && minLength > 1) {
    code += `.min(${minLength}, { message: "${label || 'Text'} must be at least ${minLength} characters" })`;
  }

  // Add max length validation if specified
  if (maxLength !== undefined) {
    code += `.max(${maxLength}, { message: "${label || 'Text'} must not exceed ${maxLength} characters" })`;
  }

  // Add optional if not required
  if (!required) {
    code += `.optional()`;
  }

  return `${code},`;
};

// Generate JSX code for the component
const generateJSXCode = (
  component: Component<TextareaInputProps, TextareaInputCustomOptions>,
): string => {
  const { label, helperText, required, placeholder, rows, className } =
    component.props;

  return `<FormField
  control={form.control}
  name="${component.name}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${label}${required ? ' *' : ''}</FormLabel>
      <FormControl>
        <Textarea 
          placeholder="${placeholder || ''}" 
          rows={${rows || 3}}
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
  return `import { Textarea } from "@/components/ui/textarea";`;
};

// Component configuration
const textareaInputConfig: BaseComponentConfig<
  TextareaInputProps,
  TextareaInputCustomOptions
> = {
  name: 'textarea',
  description: 'Multi-line text input field',
  component: TextareaInput,
  defaultProps: {
    label: 'Description',
    required: false,
    helperText: 'Enter your details',
    placeholder: 'Type your description here',
    rows: 3,
    className: '',
  },
  customOptions: {
    minLength: undefined,
    maxLength: undefined,
  },
  renderPropertiesEditor,
  generateSchemaCode,
  generateJSXCode,
  generateImportCode,
};

export default textareaInputConfig;
