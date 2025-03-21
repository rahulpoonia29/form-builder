import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFormBuilderStore } from '@/store/formBuilder';
import { BaseComponentProps } from '@/types/form';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2Icon } from 'lucide-react';
import React, { memo, useCallback } from 'react';

// Container for the form builder canvas
const FormCanvasContainer = memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <div
        className={cn(
          'border-muted-foreground/20 relative m-3 min-h-[200px] rounded-lg border-2 border-dashed p-4 transition-all',
        )}
      >
        {children}
      </div>
    );
  },
);

// Individual form component inside the canvas
const FormCanvasComponent = memo(
  ({
    id,
    component: Component,
    props,
    isSelected,
    onSelect,
    onRemove,
  }: {
    id: string;
    name: string;
    component: React.FC<BaseComponentProps>;
    props: BaseComponentProps;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 10 : undefined,
    };

    const handleRemove = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove();
      },
      [onRemove],
    );

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'hover:bg-muted/20 group relative mb-3 rounded border border-transparent p-3',
          isDragging ? 'opacity-50' : '',
          isSelected ? 'border-primary bg-muted/30' : '',
        )}
        onClick={onSelect}
      >
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'absolute top-1 right-2 h-7 w-7 cursor-pointer opacity-0 transition-opacity',
            'hover:border-destructive hover:text-destructive-foreground',
            'focus:opacity-100',
            (isSelected || isDragging) && 'opacity-100',
            'group-hover:opacity-100',
          )}
          onClick={handleRemove}
        >
          <Trash2Icon size={14} />
        </Button>

        <div className="flex items-start gap-3">
          <div
            {...attributes}
            {...listeners}
            className="hover:bg-accent mt-1 cursor-grab rounded p-1 active:cursor-grabbing"
          >
            <GripVertical size={16} className="text-muted-foreground" />
          </div>

          <div className="flex-1">
            <Component {...props} />
          </div>
        </div>
      </div>
    );
  },
);

// Empty state when no components are added
const EmptyCanvasState = memo(() => (
  <div className="flex h-[200px] flex-col items-center justify-center text-center">
    <p className="text-muted-foreground mb-2">
      Click the "+" button on components in the sidebar to add them to your form
    </p>
  </div>
));

export const FormBuilderCanvas = memo(() => {
  const {
    components,
    selectedComponent,
    setSelectedComponent,
    removeComponent,
  } = useFormBuilderStore();

  const handleSelectComponent = useCallback(
    (id: string) => {
      setSelectedComponent(id);
    },
    [setSelectedComponent],
  );

  const handleRemoveComponent = useCallback(
    (id: string) => {
      removeComponent(id);
    },
    [removeComponent],
  );

  return (
    <FormCanvasContainer>
      {components.length === 0 ? (
        <EmptyCanvasState />
      ) : (
        <SortableContext
          items={components.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="relative overflow-auto"
            style={{ height: '100%', maxHeight: 'calc(100vh - 200px)' }}
          >
            {components.map(({ id, name, component, props }) => (
              <FormCanvasComponent
                key={id}
                id={id}
                name={name}
                component={component}
                props={props}
                isSelected={selectedComponent === id}
                onSelect={() => handleSelectComponent(id)}
                onRemove={() => handleRemoveComponent(id)}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </FormCanvasContainer>
  );
});
