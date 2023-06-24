import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties } from 'react'
import { DndSortable } from '../types'

export default function useDnd ({ id }: { id: string }): DndSortable {
  const sortable = useSortable({ id })
  const style: CSSProperties = {
    opacity: sortable.isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(sortable.transform),
    transition: sortable.transition,
    touchAction: 'none'
  }
  return { style, ...sortable }
}
