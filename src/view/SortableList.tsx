import React, { FC, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  DropAnimation,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import type { Active } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove
} from '@dnd-kit/sortable'

import SchemesContainerView from './SchemesContainer'
import { BaseItem } from '../types'

export function SortableList<T extends BaseItem> ({
  ItemView,
  items,
  setItems
}: {
  ItemView: FC<{ id: string }>
  items: T[]
  setItems: (items: T[]) => void
}): JSX.Element {
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
  const sortableItems = items.map((item) => (
    <ItemView key={item.id} id={item.id} />
  ))

  const sortableActiveItem = (activeItem != null)
    ? <ItemView id={activeItem.id} />
    : null

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

          setItems(arrayMove(items, activeIndex, overIndex))
        }
        setActive(null)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
    >
      <SortableContext items={items}>
        <SchemesContainerView>
          {sortableItems}
        </SchemesContainerView>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {sortableActiveItem}
      </DragOverlay>
    </DndContext>
  )
}
