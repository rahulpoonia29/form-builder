import BaseComponent from '@/components/form-components/base/baseComponent';
import { PropertyInput } from '@/components/form-builder/properties';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';
import { ChevronDownIcon, CircleX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Props for select input component
interface SelectInputProps extends BaseComponentProps {
  placeholder?: string;
}

// Custom options for select input
interface SelectInputCustomOptions {
  options: Array<{ label: string; value: string }>;
}

// The actual select input component
export function SelectInput({
  label,
  required,
  helperText,
  placeholder,
  className,
  customOptions,
}: SelectInputProps & { customOptions?: SelectInputCustomOptions }) {
  const options = customOptions?.options || [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' },
  ];

  return (
    <BaseComponent {...{ label, required, helperText }}>
      <Select>
        <SelectTrigger className={cn('w-full', className)}>
          <SelectValue placeholder={placeholder || 'Select a country'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseComponent>
  );
}

// Custom properties editor for select input
const renderPropertiesEditor = (
  props: SelectInputProps,
  onChange: (props: SelectInputProps) => void,
  customOptions: SelectInputCustomOptions,
  onCustomOptionsChange: (options: SelectInputCustomOptions) => void,
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
        <label className="text-sm font-medium">Select Options</label>
        <div className="space-y-2">
          {customOptions.options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option.label}
                placeholder="Label"
                onChange={(e) => {
                  const newOptions = [...customOptions.options];
                  newOptions[index] = {
                    ...newOptions[index],
                    label: e.target.value,
                  };
                  onCustomOptionsChange({
                    ...customOptions,
                    options: newOptions,
                  });
                }}
              />
              <Input
                value={option.value}
                placeholder="Value"
                onChange={(e) => {
                  const newOptions = [...customOptions.options];
                  newOptions[index] = {
                    ...newOptions[index],
                    value: e.target.value,
                  };
                  onCustomOptionsChange({
                    ...customOptions,
                    options: newOptions,
                  });
                }}
              />
              <Button
                variant={'outline'}
                size={'icon'}
                className='hover:bg-destructive hover:text-primary-foreground cursor-pointer transition-colors'
                onClick={() => {
                  const newOptions = customOptions.options.filter(
                    (_, i) => i !== index,
                  );
                  onCustomOptionsChange({
                    ...customOptions,
                    options: newOptions,
                  });
                }}
              >
                <CircleX />
              </Button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2 rounded-md px-3 py-2 text-sm"
          onClick={() => {
            onCustomOptionsChange({
              ...customOptions,
              options: [
                ...customOptions.options,
                {
                  label: 'New Option',
                  value: `option${customOptions.options.length + 1}`,
                },
              ],
            });
          }}
        >
          Add Option
        </button>
      </div>
    </>
  );
};

// Generate Zod schema code for validation
const generateSchemaCode = (
  component: Component<SelectInputProps, SelectInputCustomOptions>,
): string => {
  const { required, label } = component.props;
  const { options } = component.config.customOptions;

  // Create array of valid values for enum validation
  const valuesArray = options.map((option) => `"${option.value}"`).join(', ');

  return required
    ? `${component.name}: z.enum([${valuesArray}], { 
      required_error: "${label || 'This field'} is required" 
    }),`
    : `${component.name}: z.enum([${valuesArray}]).optional(),`;
};

// Generate JSX code for the component
const generateJSXCode = (
  component: Component<SelectInputProps, SelectInputCustomOptions>,
): string => {
  const { label, helperText, required, placeholder, className } =
    component.props;
  const { options } = component.config.customOptions;

  // Generate items JSX
  const itemsJsx = options
    .map(
      (option) =>
        `<SelectItem value="${option.value}">${option.label}</SelectItem>`,
    )
    .join('\n        ');

  return `<FormField
  control={form.control}
  name="${component.name}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${label}${required ? ' *' : ''}</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="${className || ''}">
            <SelectValue placeholder="${placeholder || 'Select an option'}" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
        ${itemsJsx}
        </SelectContent>
      </Select>
      ${helperText ? `<FormDescription>${helperText}</FormDescription>` : ''}
      <FormMessage />
    </FormItem>
  )}
/>`;
};

// Generate import code
const generateImportCode = () => {
  return `import {
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";`;
};

// Component configuration
const selectInputConfig: BaseComponentConfig<
  SelectInputProps,
  SelectInputCustomOptions
> = {
  name: 'select',
  description: 'Dropdown select field',
  component: SelectInput,
  icon: ChevronDownIcon,
  defaultProps: {
    label: 'Select Option',
    required: false,
    helperText: 'Select an option from the dropdown',
    placeholder: 'Select an option',
    className: '',
  },
  customOptions: {
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  },
  renderPropertiesEditor,
  generateSchemaCode,
  generateJSXCode,
  generateImportCode,
};

export default selectInputConfig;
