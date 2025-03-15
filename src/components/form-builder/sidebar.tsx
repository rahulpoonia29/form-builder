import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFormBuilderStore } from '@/store/formBuilder';
import { BaseComponentConfig } from '@/types/form';
import { ChevronDown, ChevronRight, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import formComponents from '../form-components';

// Component for a collapsible category
const ComponentCategory = ({
  category,
}: {
  category: {
    name: string;
    components: (typeof formComponents)[0]['components'];
  };
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { addComponent } = useFormBuilderStore();

  if (category.components.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div
        className="hover:bg-accent hover:border-border flex cursor-pointer items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="text-sm font-medium">{category.name}</span>
        </div>
        <span className="text-muted-foreground text-xs font-semibold">
          {category.components.length}
        </span>
      </div>

      {isOpen && (
        <div className="mt-1 space-y-2 ps-4">
          {category.components.map((config) => (
            <ComponentItem
              key={config.name}
              config={config}
              onAdd={() => addComponent(config)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual component item with Add button
const ComponentItem = ({
  config,
  onAdd,
}: {
  config: BaseComponentConfig<unknown, unknown>;
  onAdd: () => void;
}) => {
  const Icon = config.icon;

  return (
    <div className="group hover:bg-accent hover:border-border flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="text-primary size-4" />
        <span className="text-sm">{config.name}</span>
      </div>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
            >
              <PlusCircle size={14} className="text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="dark bg-secondary text-secondary-foreground px-2 py-1 text-xs">
            Add {config.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

// Updated Sidebar Component
export const FormBuilderSidebar = () => {
  return (
    <div className="flex h-full w-68 flex-col overflow-hidden border-r select-none">
      <div className="border-b px-4 py-4 pb-3">
        <h2 className="text-lg font-semibold">Components</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Add components to your form
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {formComponents.map((category) => (
          <ComponentCategory key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
};
