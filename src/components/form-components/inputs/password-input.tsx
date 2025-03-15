import { PropertyInput } from '@/components/form-builder/properties';
import BaseComponent from '@/components/form-components/base/baseComponent';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';
import { KeyIcon } from 'lucide-react';

// Props for password input component
interface PasswordInputProps extends BaseComponentProps {
  placeholder?: string;
}

// Custom options for password validation
interface PasswordInputCustomOptions {
  validationLevel: 'none' | 'medium' | 'strict';
}

// The actual password input component
export function PasswordInput({
  label,
  required,
  helperText,
  placeholder,
  className,
}: PasswordInputProps) {
  return (
    <BaseComponent {...{ label, required, helperText }}>
      <Input
        type="password"
        placeholder={placeholder || ''}
        className={cn(className)}
      />
    </BaseComponent>
  );
}

// Custom properties editor for password input
const renderPropertiesEditor = (
  props: PasswordInputProps,
  onChange: (props: PasswordInputProps) => void,
  customOptions: PasswordInputCustomOptions,
  onCustomOptionsChange: (options: PasswordInputCustomOptions) => void,
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
        <label htmlFor="validationLevel" className="text-sm font-medium">
          Password Validation Level
        </label>
        <Select
          value={customOptions.validationLevel}
          onValueChange={(value) =>
            onCustomOptionsChange({
              ...customOptions,
              validationLevel: value as 'none' | 'medium' | 'strict',
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select validation level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Validation Level</SelectLabel>
              <SelectItem value="none">None (any input)</SelectItem>
              <SelectItem value="medium">
                Medium (uppercase & lowercase)
              </SelectItem>
              <SelectItem value="strict">
                Strict (uppercase, lowercase & special character)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

// Generate Zod schema code for validation based on custom options
const generateSchemaCode = (
  component: Component<PasswordInputProps, PasswordInputCustomOptions>,
): string => {
  const { required, label } = component.props;
  const { validationLevel } = component.config.customOptions;

  let validationCode = '';

  switch (validationLevel) {
    case 'none':
      validationCode = required
        ? `${component.name}: z.string().min(1, { message: "${label || 'Password'} is required" }),`
        : `${component.name}: z.string().optional(),`;
      break;

    case 'medium':
      validationCode = `${component.name}: z.string()
        ${required ? '.min(1, { message: "' + (label || 'Password') + ' is required" })' : ''}
        .regex(/(?=.*[a-z])(?=.*[A-Z])/, { 
          message: "${label || 'Password'} must contain at least one uppercase and one lowercase letter" 
        })${!required ? '.optional()' : ''},`;
      break;

    case 'strict':
      validationCode = `${component.name}: z.string()
        ${required ? '.min(1, { message: "' + (label || 'Password') + ' is required" })' : ''}
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, { 
          message: "${label || 'Password'} must contain uppercase, lowercase, and special characters" 
        })${!required ? '.optional()' : ''},`;
      break;
  }

  return validationCode;
};

// Generate JSX code for the component
const generateJSXCode = (
  component: Component<PasswordInputProps, PasswordInputCustomOptions>,
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
          type="password"
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
const passwordInputConfig: BaseComponentConfig<
  PasswordInputProps,
  PasswordInputCustomOptions
> = {
  name: 'password',
  description: 'Password input field with validation options',
  component: PasswordInput,
  icon: KeyIcon,
  defaultProps: {
    label: 'Password',
    required: true,
    helperText: 'Enter your password',
    placeholder: 'Enter password',
    className: '',
  },
  customOptions: {
    validationLevel: 'none',
  },
  renderPropertiesEditor,
  generateSchemaCode,
  generateJSXCode,
  generateImportCode,
};

export default passwordInputConfig;
