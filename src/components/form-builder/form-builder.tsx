import { useFormBuilderStore } from '@/store/formBuilder';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Sliders } from 'lucide-react';
import { FormBuilderCanvas } from './canvas';
import { Header } from './header';
import PropertiesPanel from './properties';
import { FormBuilderSidebar } from './sidebar';
import { ScrollArea } from '../ui/scroll-area';

export function FormBuilder() {
  const { components, reorderComponents, reset } = useFormBuilderStore();

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
      {/* Pass the active drag state to the canvas component */}
      <div className="flex h-screen w-full overflow-hidden font-mono">
        {/* Sidebar on the left */}
        <FormBuilderSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          {/* Header at the top */}
          <Header reset={reset} />

          {/* Canvas and Properties Panel */}
          <div className="flex flex-1 overflow-hidden">
            <ScrollArea className="flex-1 overflow-hidden">
              <SortableContext items={components.map((c) => c.id)}>
                <div className="flex-1 overflow-hidden">
                  <FormBuilderCanvas />
                </div>
              </SortableContext>
            </ScrollArea>

            <div className="bg-muted/20 w-[450px] border-l">
              <div className="flex items-center border-b px-4 py-3">
                <Sliders size={16} className="mr-2" />
                <h3 className="font-medium">Properties</h3>
              </div>
              <div className="h-[calc(100vh-152px)]">
                <PropertiesPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
