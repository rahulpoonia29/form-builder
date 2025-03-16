import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useFormBuilderStore } from '@/store/formBuilder';

// Component property input renderer
export function PropertyInput({
  name,
  label,
  type,
  value,
  onChange,
}: {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'boolean' | 'number';
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>

      {type === 'text' && (
        <Input
          id={name}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {type === 'textarea' && (
        <Textarea
          id={name}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
        />
      )}

      {type === 'boolean' && (
        <Switch
          id={name}
          checked={(value as boolean) || false}
          onCheckedChange={onChange}
        />
      )}

      {type === 'number' && (
        <Input
          id={name}
          type="number"
          value={(value as number) || 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )}
    </div>
  );
}

export default function PropertiesPanel() {
  const {
    components,
    selectedComponent,
    updateComponentProps,
    updateComponentName,
    updateComponentCustomOptions,
  } = useFormBuilderStore();

  const selectedComponentData = components.find(
    (c) => c.id === selectedComponent,
  );

  if (!selectedComponentData) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  // Get the component definition from the registry
  const componentConfig = selectedComponentData.config;

  // Add debug output if component config is not found
  if (!componentConfig) {
    console.error(
      `Component config not found for: ${selectedComponentData.name}`,
      { selectedComponentData },
    );

    return (
      <div className="text-muted-foreground p-4 text-center">
        <p>Could not load properties for this component</p>
        <pre className="bg-muted mt-2 overflow-auto rounded-md p-2 text-xs">
          {JSON.stringify(selectedComponentData, null, 2)}
        </pre>
      </div>
    );
  }

  const updateField = (field: string, value: unknown) => {
    updateComponentProps(selectedComponentData.id, { [field]: value });
  };

  const updateCustomOptions = (options: Record<string, unknown>) => {
    updateComponentCustomOptions(selectedComponentData.id, options);
  };

  // List of default properties we handle separately
  const defaultPropertyNames = [
    'label',
    'name',
    'helperText',
    'required',
    'className',
  ];

  // Get custom properties by filtering out the default ones
  const customProps = componentConfig.defaultProps
    ? Object.keys(componentConfig.defaultProps).filter(
        (key) => !defaultPropertyNames.includes(key),
      )
    : [];

  const customOptions = componentConfig.customOptions
    ? Object.keys(componentConfig.customOptions).filter(
        (key) => !defaultPropertyNames.includes(key),
      )
    : [];

  // Determine if we need to show the custom properties section
  const hasCustomProperties =
    customProps.concat(customOptions).length > 0 ||
    componentConfig.renderPropertiesEditor;

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="mb-4 text-base font-semibold">
        {selectedComponentData.name} Properties
      </h2>

      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-medium">
          General Settings
        </h3>

        <PropertyInput
          name="name"
          label="Component Name"
          type="text"
          value={selectedComponentData.name}
          onChange={(value) => {
            const sanitized = (value as string)
              .replace(/[^\w]/g, '') // Remove non-alphanumeric characters
              .replace(/^\d/, ''); // Remove leading digit if present
            updateComponentName(
              selectedComponentData.id,
              sanitized.toLowerCase(),
            );
          }}
        />

        <PropertyInput
          name="label"
          label="Label"
          type="text"
          value={selectedComponentData.props.label}
          onChange={(value) => updateField('label', value)}
        />

        <PropertyInput
          name="helperText"
          label="Helper Text"
          type="textarea"
          value={selectedComponentData.props.helperText}
          onChange={(value) => updateField('helperText', value)}
        />

        <PropertyInput
          name="required"
          label="Required"
          type="boolean"
          value={selectedComponentData.props.required}
          onChange={(value) => updateField('required', value)}
        />

        <PropertyInput
          name="className"
          label="CSS Class"
          type="text"
          value={selectedComponentData.props.className}
          onChange={(value) => updateField('className', value)}
        />

        {/* Separator and custom properties section if needed */}
        {hasCustomProperties && (
          <>
            <Separator className="my-4" />
            <h3 className="text-muted-foreground text-sm font-medium">
              Component-Specific Settings
            </h3>

            <div className="space-y-4">
              {/* Custom component properties */}
              {componentConfig.renderPropertiesEditor(
                selectedComponentData.props,
                (props) =>
                  updateComponentProps(
                    selectedComponentData.id,
                    props as Partial<typeof selectedComponentData.props>,
                  ),
                selectedComponentData.config.customOptions,
                updateCustomOptions,
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
