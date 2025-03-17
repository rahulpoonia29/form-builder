import { PropertyInput } from '@/components/form-builder/properties';
import BaseComponent from '@/components/form-components/base/baseComponent';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';

// Props for number input component
interface NumberInputProps extends BaseComponentProps {
  placeholder?: string;
}

// Custom options for number input
interface NumberInputCustomOptions {
  min?: number;
  max?: number;
  step?: number;
}

// The actual number input component
export function NumberInput({
  label,
  required,
  helperText,
  placeholder,
  className,
}: NumberInputProps) {
  return (
    <BaseComponent {...{ label, required, helperText }}>
      <Input
        type="number"
        placeholder={placeholder || ''}
        className={cn(className)}
      />
    </BaseComponent>
  );
}

// Custom properties editor for number input
const renderPropertiesEditor = (
  props: NumberInputProps,
  onChange: (props: NumberInputProps) => void,
  customOptions: NumberInputCustomOptions,
  onCustomOptionsChange: (options: NumberInputCustomOptions) => void,
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
        <div className="space-y-2">
          <label htmlFor="min" className="text-sm font-medium">
            Minimum Value
          </label>
          <input
            id="min"
            type="number"
            className="border-input w-full rounded-md border px-3 py-2 text-sm"
            value={customOptions.min ?? ''}
            placeholder="No min"
            onChange={(e) =>
              onCustomOptionsChange({
                ...customOptions,
                min: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="max" className="text-sm font-medium">
            Maximum Value
          </label>
          <input
            id="max"
            type="number"
            className="border-input w-full rounded-md border px-3 py-2 text-sm"
            value={customOptions.max ?? ''}
            placeholder="No max"
            onChange={(e) =>
              onCustomOptionsChange({
                ...customOptions,
                max: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="step" className="text-sm font-medium">
          Step Value
        </label>
        <input
          id="step"
          type="number"
          className="border-input w-full rounded-md border px-3 py-2 text-sm"
          value={customOptions.step ?? ''}
          placeholder="Default: 1"
          onChange={(e) =>
            onCustomOptionsChange({
              ...customOptions,
              step: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>
    </>
  );
};

// Generate Zod schema code for validation based on custom options
const generateSchemaCode = (
  component: Component<NumberInputProps, NumberInputCustomOptions>,
): string => {
  const { required, label } = component.props;
  const { min, max } = component.config.customOptions;

  let codeStart = required
    ? `${component.name}: z.coerce.number()`
    : `${component.name}: z.coerce.number()`;

  // Add min validation
  if (min !== undefined) {
    codeStart += `.min(${min}, { message: "${label || 'Number'} must be at least ${min}" })`;
  }

  // Add max validation
  if (max !== undefined) {
    codeStart += `.max(${max}, { message: "${label || 'Number'} must be at most ${max}" })`;
  }

  // Add required or optional
  const codeEnd = required ? `` : `.optional()`;

  return `${codeStart}${codeEnd},`;
};

// Generate JSX code for the component
const generateJSXCode = (
  component: Component<NumberInputProps, NumberInputCustomOptions>,
): string => {
  const { label, helperText, required, placeholder, className } =
    component.props;
  const { min, max, step } = component.config.customOptions;

  const minAttr = min !== undefined ? ` min="${min}"` : '';
  const maxAttr = max !== undefined ? ` max="${max}"` : '';
  const stepAttr = step !== undefined ? ` step="${step}"` : '';

  return `<FormField
  control={form.control}
  name="${component.name}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${label}${required ? ' *' : ''}</FormLabel>
      <FormControl>
        <Input 
          type="number"${minAttr}${maxAttr}${stepAttr}
          placeholder="${placeholder || ''}" 
          className="${className || ''}"
          {...field} 
          onChange={(e) => field.onChange(Number(e.target.value))}
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
const numberInputConfig: BaseComponentConfig<
  NumberInputProps,
  NumberInputCustomOptions
> = {
  name: 'number',
  description: 'Number input field with min/max validation',
  component: NumberInput,
  defaultProps: {
    label: 'Number',
    required: false,
    helperText: 'Enter a number',
    placeholder: 'Enter a number',
    className: '',
  },
  customOptions: {
    min: undefined,
    max: undefined,
    step: undefined,
  },
  renderPropertiesEditor,
  generateSchemaCode,
  generateJSXCode,
  generateImportCode,
};

export default numberInputConfig;
