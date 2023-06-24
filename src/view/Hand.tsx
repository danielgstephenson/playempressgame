import React, { Fragment, useContext, useMemo, useState } from 'react'
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
import HandSchemeView from './HandScheme'
import playContext from '../context/play'
import { Heading } from '@chakra-ui/react'

export default function HandView (): JSX.Element {
  const {
    hand, trashSchemeId, playSchemeId, setHand
  } = useContext(playContext)
  const [active, setActive] = useState<Active | null>(null)
  const activeItem = useMemo(
    () => hand?.find((scheme) => scheme.id === active?.id),
    [active, hand]
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
  const sortableItems = hand?.map((scheme) => {
    if (scheme.id === trashSchemeId || scheme.id === playSchemeId) {
      return <Fragment key={scheme.id} />
    }
    return (
      <HandSchemeView key={scheme.id} id={scheme.id} />
    )
  })

  const sortableActiveItem = (activeItem != null)
    ? <HandSchemeView active id={activeItem.id} />
    : null

  if (hand == null || setHand == null) {
    return <></>
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active)
      }}
      onDragEnd={({ active, over }) => {
        if (over != null && active.id !== over?.id) {
          const activeIndex = hand.findIndex(({ id }) => id === active.id)
          const overIndex = hand.findIndex(({ id }) => id === over.id)

          setHand(arrayMove(hand, activeIndex, overIndex))
        }
        setActive(null)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
    >
      <Heading size='sm'>Hand</Heading>
      <SortableContext items={hand}>
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
