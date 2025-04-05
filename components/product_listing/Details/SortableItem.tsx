"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";

export function SortableItem({
  id,
  index,
  handleRemoveImage,
}: {
  id: string;
  index: number;
  handleRemoveImage: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-grab"
    >
      <img src={id} alt={`Product Image ${index + 1}`} className="object-cover w-full h-full" />
      
      <button
        onClick={() => handleRemoveImage(index)}
        className="absolute top-1 right-1 p-1 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition-all"
      >
        <X className="w-2 h-2" />
      </button>
    </div>
  );
}