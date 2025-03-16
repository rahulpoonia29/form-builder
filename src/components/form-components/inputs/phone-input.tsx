import BaseComponent from '@/components/form-components/base/baseComponent';
import { PropertyInput } from '@/components/form-builder/properties';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';
import { PhoneIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Props for phone input component
interface PhoneInputProps extends BaseComponentProps {
  placeholder?: string;
}

// Custom options for phone number validation
interface PhoneInputCustomOptions {
  format: 'international' | 'national' | 'any';
  countryCode?: string;
}

// The actual phone input component
export function PhoneInput({
  label,
  required,
  helperText,
  placeholder,
  className,
}: PhoneInputProps) {
  return (
    <BaseComponent {...{ label, required, helperText }}>
      <Input
        type="tel"
        placeholder={placeholder || 'Enter phone number'}
        className={cn(className)}
      />
    </BaseComponent>
  );
}

// Custom properties editor for phone input
const renderPropertiesEditor = (
  props: PhoneInputProps,
  onChange: (props: PhoneInputProps) => void,
  customOptions: PhoneInputCustomOptions,
  onCustomOptionsChange: (options: PhoneInputCustomOptions) => void,
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
        <label htmlFor="format" className="text-sm font-medium">
          Phone Number Format
        </label>
        <Select
          value={customOptions.format}
          onValueChange={(value) =>
            onCustomOptionsChange({
              ...customOptions,
              format: value as 'international' | 'national' | 'any',
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Format</SelectLabel>
              <SelectItem value="international">
                International (+1 234 567 8900)
              </SelectItem>
              <SelectItem value="national">National (234-567-8900)</SelectItem>
              <SelectItem value="any">Any Format</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {customOptions.format === 'international' && (
        <div className="mt-4 space-y-2">
          <label htmlFor="countryCode" className="text-sm font-medium">
            Default Country Code
          </label>
          <input
            id="countryCode"
            type="text"
            className="border-input w-full rounded-md border px-3 py-2 text-sm"
            value={customOptions.countryCode || ''}
            placeholder="+1"
            onChange={(e) =>
              onCustomOptionsChange({
                ...customOptions,
                countryCode: e.target.value,
              })
            }
          />
        </div>
      )}
    </>
  );
};

// Generate Zod schema code for validation based on custom options
const generateSchemaCode = (
  component: Component<PhoneInputProps, PhoneInputCustomOptions>,
): string => {
  const { required, label } = component.props;
  const { format } = component.config.customOptions;

  let regexPattern = '';
  let errorMessage = '';

  switch (format) {
    case 'international':
      regexPattern = '\\+?[1-9]\\d{1,14}';
      errorMessage = 'Please enter a valid international phone number';
      break;
    case 'national':
      regexPattern = '[0-9]{3}[-. ]?[0-9]{3}[-. ]?[0-9]{4}';
      errorMessage = 'Please enter a valid phone number (e.g. 555-123-4567)';
      break;
    case 'any':
    default:
      regexPattern = '[0-9\\+\\-\\(\\) ]{6,}';
      errorMessage = 'Please enter a valid phone number';
      break;
  }

  let code = `${component.name}: z.string()`;

  // Add required validation
  if (required) {
    code += `.min(1, { message: "${label || 'Phone'} is required" })`;
  }

  // Add phone format validation
  code += `.regex(new RegExp("^${regexPattern}$"), { message: "${errorMessage}" })`;

  // Add optional if not required
  if (!required) {
    code += `.optional()`;
  }

  return `${code},`;
};

// Generate JSX code for the component
const generateJSXCode = (
  component: Component<PhoneInputProps, PhoneInputCustomOptions>,
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
          type="tel" 
          placeholder="${placeholder}" 
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
const phoneInputConfig: BaseComponentConfig<
  PhoneInputProps,
  PhoneInputCustomOptions
> = {
  name: 'phone',
  description: 'Phone number input with format validation',
  component: PhoneInput,
  icon: PhoneIcon,
  defaultProps: {
    label: 'Phone Number',
    required: false,
    helperText: 'Enter your phone number',
    placeholder: 'Enter phone number',
    className: '',
  },
  customOptions: {
    format: 'any',
    countryCode: '',
  },
  renderPropertiesEditor,
  generateSchemaCode,
  generateJSXCode,
  generateImportCode,
};

export default phoneInputConfig;
