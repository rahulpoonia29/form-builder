import BaseComponent from '@/components/form-components/base/baseComponent';
import { PropertyInput } from '@/components/form-builder/properties';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';
import { AtSignIcon } from 'lucide-react';

// Props for email input component
interface EmailInputProps extends BaseComponentProps {
  placeholder?: string;
}

// Custom options for email validation
interface EmailInputCustomOptions {
  allowedDomains: string; // Comma-separated list of allowed domains
}

// The actual email input component
export function EmailInput({
  label,
  required,
  helperText,
  placeholder,
  className,
}: EmailInputProps) {
  return (
    <BaseComponent {...{ label, required, helperText }}>
      <Input
        type="email"
        placeholder={placeholder || ''}
        className={cn(className)}
      />
    </BaseComponent>
  );
}

// Custom properties editor for email input
const renderPropertiesEditor = (
  props: EmailInputProps,
  onChange: (props: EmailInputProps) => void,
  customOptions: EmailInputCustomOptions,
  onCustomOptionsChange: (options: EmailInputCustomOptions) => void,
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
        <label htmlFor="allowedDomains" className="text-sm font-medium">
          Allowed Domains (comma separated, leave empty for any)
        </label>
        <input
          id="allowedDomains"
          className="border-input w-full rounded-md border px-3 py-2 text-sm"
          value={customOptions.allowedDomains}
          placeholder="example.com, company.org"
          onChange={(e) =>
            onCustomOptionsChange({
              ...customOptions,
              allowedDomains: e.target.value,
            })
          }
        />
      </div>
    </>
  );
};

// Generate Zod schema code for validation based on custom options
const generateSchemaCode = (
  component: Component<EmailInputProps, EmailInputCustomOptions>,
): string => {
  const { required, label } = component.props;
  const { allowedDomains } = component.config.customOptions;

  let code = `${component.name}: z.string()`;

  // Add required validation
  if (required) {
    code += `.min(1, { message: "${label || 'Email'} is required" })`;
  }

  // Add email validation
  code += `.email({ message: "Please enter a valid email address" })`;

  // Add domain validation if specified
  if (allowedDomains.trim()) {
    const domains = allowedDomains
      .split(',')
      .map((domain) => domain.trim())
      .filter(Boolean)
      .map((domain) => `"@${domain.replace(/^@/, '')}"`)
      .join(', ');

    if (domains) {
      code += `
    .refine((email) => {
      if (!email) return ${!required}; // Allow empty if not required
      const domain = email.split('@')[1];
      return [${domains}].some((allowed) => allowed.endsWith(domain));
    }, { message: "Email domain not allowed. Use: ${allowedDomains.replace(/,/g, ', ')}" })`;
    }
  }

  // Add optional if not required
  if (!required) {
    code += `.optional()`;
  }

  return `${code},`;
};

// Generate JSX code for the component
const generateJSXCode = (
  component: Component<EmailInputProps, EmailInputCustomOptions>,
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
          type="email"
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
const emailInputConfig: BaseComponentConfig<
  EmailInputProps,
  EmailInputCustomOptions
> = {
  name: 'email',
  description: 'Email input field with validation',
  component: EmailInput,
  icon: AtSignIcon,
  defaultProps: {
    label: 'Email',
    required: true,
    helperText: 'Enter your email address',
    placeholder: 'user@example.com',
    className: '',
  },
  customOptions: {
    allowedDomains: '',
  },
  renderPropertiesEditor,
  generateSchemaCode,
  generateJSXCode,
  generateImportCode,
};

export default emailInputConfig;
