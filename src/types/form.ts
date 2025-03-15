import { LucideIcon } from 'lucide-react';

// Base properties that all components will have
export interface BaseComponentProps {
  label: string;
  required: boolean;
  helperText?: string;
  className?: string;
}

// Component configuration used in sidebar and properties panel
export type BaseComponentConfig<TProps, TCustomOptions> = {
  name: string;
  description?: string;
  component: React.FC<TProps>;
  icon: LucideIcon;
  defaultProps: Required<Partial<TProps>>;
  customOptions: TCustomOptions; // Configuration options that don't affect rendering or used in props but affect code generation
  renderPropertiesEditor: (
    props: TProps,
    onChange: (props: TProps) => void,
    customOptions: TCustomOptions,
    onCustomOptionsChange: (options: TCustomOptions) => void,
  ) => React.ReactNode;
  generateJSXCode: (component: Component<TProps, TCustomOptions>) => string;
  generateSchemaCode: (component: Component<TProps, TCustomOptions>) => string;
  generateImportCode: () => string;
};

// Category of components for the sidebar
export interface FormComponentsCategory {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: BaseComponentConfig<any, any>[];
}

// Component object used in the store
export interface Component<
  TProps = BaseComponentProps,
  TCustomOptions = Record<string, unknown>,
> {
  id: string;
  name: string;
  component: React.FC<TProps>;
  props: TProps;
  config: BaseComponentConfig<TProps, TCustomOptions>;
}
