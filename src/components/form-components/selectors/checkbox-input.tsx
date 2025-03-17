import BaseComponent from '@/components/form-components/base/baseComponent';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';

// Props for checkbox input component
type CheckboxInputProps = BaseComponentProps;

// Custom options for checkbox input
interface CheckboxInputCustomOptions {
  defaultChecked?: boolean;
}

// The actual checkbox input component
export function CheckboxInput({
  label,
  required,
  helperText,
  className,
}: CheckboxInputProps) {
  return (
    <BaseComponent {...{ label, required, helperText }}>
      <div className={cn('flex items-center space-x-2', className)}>
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
      </div>
    </BaseComponent>
  );
}

// Generate Zod schema code for validation
const generateSchemaCode = (
  component: Component<CheckboxInputProps, CheckboxInputCustomOptions>,
): string => {
  const { required } = component.props;

  let code = `${component.name}: z.boolean()`;

  if (!required) {
    code += `.optional()`;
  }

  return `${code},`;
};

// Generate JSX code for the component
const generateJSXCode = (
  component: Component<CheckboxInputProps, CheckboxInputCustomOptions>,
): string => {
  const { label, helperText, required, className } = component.props;

  return `<FormField
  control={form.control}
  name="${component.name}"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          className="${className || ''}"
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>${label}${required ? ' *' : ''}</FormLabel>
        ${helperText ? `<FormDescription>${helperText}</FormDescription>` : ''}
        <FormMessage />
      </div>
    </FormItem>
  )}
/>`;
};

// Generate import code
const generateImportCode = () => {
  return `import { Checkbox } from "@/components/ui/checkbox";`;
};

// Component configuration
const checkboxInputConfig: BaseComponentConfig<
  CheckboxInputProps,
  CheckboxInputCustomOptions
> = {
  name: 'checkbox',
  description: 'Simple checkbox input field',
  component: CheckboxInput,
  defaultProps: {
    label: '',
    required: false,
    helperText: '',
    className: '',
  },
  customOptions: {
    defaultChecked: false,
  },
  generateSchemaCode,
  generateJSXCode,
  generateImportCode,
};

export default checkboxInputConfig;
