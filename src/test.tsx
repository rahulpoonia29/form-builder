import {
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

function App() {
  const [isDropped, setIsDropped] = useState(false);
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    // If dropped on a droppable
    if (over) {
      setIsDropped(true);
      setParent(over.id);
    } else {
      // If dropped outside of droppable area
      setIsDropped(false);
      setParent(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-xl mb-4">DND Kit Basic Example</h1>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <p className="mb-2">
              Draggable Area {isDropped && '(Element dropped)'}
            </p>
            {!isDropped && <Draggable>Drag me!</Draggable>}
          </div>

          <div className="w-full md:w-1/2">
            <p className="mb-2">Droppable Area</p>
            <Droppable>
              {parent === 'droppable' && <Draggable>Dropped!</Draggable>}
            </Droppable>
          </div>
        </div>
      </DndContext>
    </div>
  );
}

function Droppable({ children }: { children?: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-52 border-2 border-dashed rounded-lg p-4 transition-colors ${
        isOver ? 'border-green-500 bg-green-100' : 'border-gray-300'
      }`}
    >
      {isOver ? 'Drop here!' : 'Drop target'}
      {children}
    </div>
  );
}

function Draggable({ children }: { children?: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: 'draggable',
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 rounded cursor-grab active:cursor-grabbing ${
        isDragging ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
      }`}
    >
      {children || 'Drag me'}
    </button>
  );
}

export default App;
