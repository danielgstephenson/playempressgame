import { useDraggable } from '@dnd-kit/core'
import { CSSProperties } from 'react'
import { DndDraggable } from '../types'

export default function useDndDraggable ({ id }: { id: string }): DndDraggable {
  const draggable = useDraggable({ id })
  const style: CSSProperties = {
    opacity: draggable.isDragging ? 0.4 : undefined,
    touchAction: 'none'
  }
  return { style, ...draggable }
}
