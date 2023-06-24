import React, { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  DropAnimation,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import type { Active, UniqueIdentifier } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove
} from '@dnd-kit/sortable'

import { SortableItem } from './SortableItem'

interface BaseItem {
  id: UniqueIdentifier
}

interface Props<T extends BaseItem> {
  items: T[]
  onChange: (items: T[]) => void
}

export function SortableList<T extends BaseItem> ({
  items,
  onChange
}: Props<T>): JSX.Element {
  const [active, setActive] = useState<Active | null>(null)
  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  )
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  )
  const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4'
        }
      }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active)
      }}
      onDragEnd={({ active, over }) => {
        if ((over != null) && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id)
          const overIndex = items.findIndex(({ id }) => id === over.id)

          onChange(arrayMove(items, activeIndex, overIndex))
        }
        setActive(null)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
    >
      <SortableContext items={items}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '0',
            listStyle: 'none'
          }}
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {(activeItem != null) ? <SortableItem id={activeItem.id} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
