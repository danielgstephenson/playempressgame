import type { CSSProperties, PropsWithChildren } from 'react'
import type {
  UniqueIdentifier
} from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  id: UniqueIdentifier
}

export function SortableItem ({ id }: PropsWithChildren<Props>): JSX.Element {
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
    background: 'red',
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
    alignItems: 'center',
    padding: '18px 20px',
    backgroundColor: 'red',
    touchAction: 'none'
  }

  function handleClick (): void {
    console.log('click', id)
  }

  return (
    <li
      {...attributes}
      {...listeners}
      onClick={handleClick}
      ref={setNodeRef}
      style={style}
    >
      {id}
    </li>
  )
}
