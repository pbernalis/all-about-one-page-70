import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

type IdGetter<T> = (item: T, index: number) => string;
type RenderFn<T> = (item: T, index: number) => React.ReactNode;

const SortableItem = React.memo(({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle (desktop only) */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-0 -ml-8 top-1/2 -translate-y-1/2 px-2 h-7 rounded border text-xs bg-white hidden md:block"
        title="Drag to reorder"
        type="button"
        aria-roledescription="Draggable"
        aria-label="Reorder item"
      >
        ↕︎
      </button>
      {children}
    </div>
  );
});

export default function SortableArray<T>({
  items,
  getItemId,
  renderItem,
  onMove,
  disabled = false,
  className = "",
}: {
  items: T[];
  getItemId?: IdGetter<T>;
  renderItem: RenderFn<T>;
  onMove: (from: number, to: number) => void;
  disabled?: boolean;
  className?: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const ids = items.map((it, i) => (getItemId ? getItemId(it, i) : String(i)));
  const [activeId, setActiveId] = useState<string | null>(null);

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (disabled) return;
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1 || from === to) return;
    onMove(from, to);
  };

  return (
    <div className={className}>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        modifiers={[restrictToVerticalAxis]}
        accessibility={{
          announcements: {
            onDragStart({active}) { return `Picked up item ${active.id}.`; },
            onDragOver({over}) { return over ? `Over position ${over.id}.` : undefined; },
            onDragEnd({over}) { return over ? `Dropped on ${over.id}.` : `Drop cancelled.`; },
            onDragCancel() { return `Drag operation cancelled.`; },
          },
        }}
        onDragStart={onDragStart}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {items.map((it, i) => (
            <SortableItem key={ids[i]} id={ids[i]}>
              {renderItem(it, i)}
            </SortableItem>
          ))}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="opacity-80 shadow-lg rounded px-3 py-2 bg-white border border-primary/20">
              Moving item...
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}