import { LucideIcon } from 'lucide-react';

// Base properties that all components will have
export interface BaseComponentProps {
  label: string;
  required: boolean;
  helperText?: string;
  className?: string;
}

// Component configuration used in sidebar and properties panel
export type BaseComponentConfig<TProps> = {
  name: string;
  description?: string;
  component: React.FC<TProps>;
  icon: LucideIcon;
  defaultProps: Required<Partial<TProps>>;
  properties: Record<string, unknown>;
  renderPropertiesEditor?: (
    props: TProps,
    onChange: (props: TProps) => void,
  ) => React.ReactNode;
  generateJSXCode: (component: Component<TProps>) => string;
  generateSchemaCode: (component: Component<TProps>) => string;
  generateImportCode: () => string;
};

// Category of components for the sidebar
export interface FormComponentsCategory {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: BaseComponentConfig<any>[];
}

export interface Component<TProps = BaseComponentProps> {
  id: string;
  name: string;
  component: React.FC<TProps>;
  props: TProps;
  config: BaseComponentConfig<TProps>;
}
