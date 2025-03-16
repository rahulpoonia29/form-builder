import { useFormBuilderStore } from '@/store/formBuilder';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Sliders } from 'lucide-react';
import { memo } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { FormBuilderCanvas } from './canvas';
import { Header } from './header';
import PropertiesPanel from './properties';
import { FormBuilderSidebar } from './sidebar';

// Use memo to prevent unnecessary re-renders of static components
const MemoizedHeader = memo(({ reset }: { reset: () => void }) => (
  <Header reset={reset} />
));

const MemoizedSidebar = memo(FormBuilderSidebar);
const MemoizedPropertiesPanel = memo(PropertiesPanel);

export function FormBuilder() {
  const { reorderComponents, reset } = useFormBuilderStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 3 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    // Handle reordering components within the canvas
    if (active.id !== over.id) {
      reorderComponents(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-full overflow-hidden font-mono">
        {/* Sidebar with memoization */}
        <MemoizedSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          {/* Header at the top */}
          <MemoizedHeader reset={reset} />

          {/* Canvas and Properties Panel */}
          <div className="flex flex-1 overflow-hidden">
            <ScrollArea className="flex-1 overflow-hidden">
              <FormBuilderCanvas />
            </ScrollArea>

            <div className="bg-muted/20 w-[400px] border-l">
              <div className="flex items-center border-b px-4 py-3">
                <Sliders size={16} className="mr-2" />
                <h3 className="font-medium">Properties</h3>
              </div>
              <div className="h-[calc(100vh-152px)]">
                <MemoizedPropertiesPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
