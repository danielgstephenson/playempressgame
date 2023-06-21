import { closestCenter, DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { Dispatch, ReactNode, SetStateAction } from 'react'

export default function SortablesView <Item extends { id: string }> ({
  children,
  items,
  setItems
}: {
  children: ReactNode
  items: Item[]
  setItems?: Dispatch<SetStateAction<Item[]>>
}): JSX.Element {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  function handleDragEnd (event: any): void {
    const { active, over } = event
    if (active.id !== over.id) {
      setItems?.((currentItems) => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id)
        const newIndex = currentItems.findIndex(scheme => scheme.id === over.id)
        const newDeck = arrayMove(currentItems, oldIndex, newIndex)
        return newDeck
      })
    }
  }
  return (
    <DndContext
      autoScroll={false}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}
