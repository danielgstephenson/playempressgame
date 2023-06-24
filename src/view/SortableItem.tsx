import type { CSSProperties } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import HandSchemeView from './HandScheme'

export function SortableItem ({
  id
}: {
  id: string
}): JSX.Element {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
    touchAction: 'none'
  }

  return (
    <HandSchemeView
      {...attributes}
      {...listeners}
      id={id}
      ref={setNodeRef}
      style={style}
    />
  )
}
