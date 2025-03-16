import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFormBuilderStore } from '@/store/formBuilder';
import { BaseComponentConfig, FormComponentsCategory } from '@/types/form';
import { ChevronDown, ChevronRight, PlusCircle } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import {
  getComponentCategories,
  getComponentMetadata,
} from '../form-components';

// Memoized component category to prevent unnecessary re-renders
const ComponentCategory = memo(
  ({
    category,
    onAddComponent,
  }: {
    category: FormComponentsCategory;
    onAddComponent: (config: BaseComponentConfig<unknown, unknown>) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(true);

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
          <div className="mt-1 ps-4">
            {' '}
            {category.components.map((config) => (
              <ComponentItem
                key={config.name}
                config={config}
                onAdd={() => onAddComponent(config)}
              />
            ))}{' '}
          </div>
        )}
      </div>
    );
  },
);

// Memoized component item
const ComponentItem = memo(
  ({
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
                className="h-6 w-6 cursor-pointer transition-opacity"
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
  },
);

// Updated Sidebar Component with lazy loading
export const FormBuilderSidebar = () => {
  const [categories, setCategories] = useState<FormComponentsCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addComponent } = useFormBuilderStore();

  // Memoize the addComponent function to prevent unnecessary re-renders
  const handleAddComponent = useCallback(
    (config: BaseComponentConfig<unknown, unknown>) => {
      addComponent(config);
    },
    [addComponent],
  );

  useEffect(() => {
    // Initially, just show loading skeleton based on metadata
    const metadata = getComponentMetadata();
    setCategories(
      metadata.map((meta) => ({
        name: meta.name,
        components: Array(meta.componentsCount).fill(null),
      })),
    );

    // Then load the actual components
    getComponentCategories().then((loadedCategories) => {
      setCategories(loadedCategories);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex h-full w-58 flex-col overflow-hidden border-r select-none">
      <div className="border-b px-3 pt-3 pb-2 text-center">
        <h2 className="text-lg font-semibold">Components</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Add components to build your form
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading
          ? // Show loading skeletons
            categories.map((category, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center justify-between rounded-md px-3 py-2">
                  <div className="bg-muted/40 h-4 w-24 rounded" />
                  <div className="bg-muted/40 h-4 w-4 rounded" />
                </div>
                <div className="mt-1 space-y-2 ps-4">
                  {Array(Math.min(category.components.length, 3))
                    .fill(0)
                    .map((_, j) => (
                      <div
                        key={j}
                        className="flex items-center justify-between rounded-md px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-muted/40 h-4 w-4 rounded" />
                          <div className="bg-muted/40 h-4 w-20 rounded" />
                        </div>
                        <div className="bg-muted/40 h-4 w-4 rounded" />
                      </div>
                    ))}
                </div>
              </div>
            ))
          : // Show actual components
            categories.map((category) => (
              <ComponentCategory
                key={category.name}
                category={category}
                onAddComponent={handleAddComponent}
              />
            ))}
      </div>
    </div>
  );
};
