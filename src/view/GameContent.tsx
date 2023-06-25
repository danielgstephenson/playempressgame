import { Fragment, useContext, useMemo, useState } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PalaceView from './Palace'
import StaticCircleAreaView from './StaticCircleArea'
import Cloud from './Cloud'
import playContext from '../context/play'
import { Box, Stack } from '@chakra-ui/react'
import { Active, defaultDropAnimationSideEffects, DndContext, DragOverlay, DropAnimation, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import HandSchemeView from './HandScheme'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const showContent = gameState.phase !== 'join'
  const timeline = gameState.timeline?.slice()
  const { hand, setHand, taken, trash, removeFromTrash } = useContext(playContext)
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
        if (over != null && active.id !== over.id) {
          if (over.id === 'trashArea') {
            console.log('trash')
            trash?.(String(active.id))
            return
          }
          console.log('not trash')
          const activeIndex = hand.findIndex(({ id }) => id === active.id)
          console.log('activeIndex', activeIndex)
          const overIndex = hand.findIndex(({ id }) => id === over.id)
          console.log('overIndex', overIndex)
          removeFromTrash?.(String(active.id))
          setHand(arrayMove(hand, activeIndex, overIndex))
        }
        setActive(null)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
    >
      <Box>
        <Stack direction='row'>
          <Curtain open={showContent}>
            <PalaceView />
            <StaticCircleAreaView label='Timeline' schemes={timeline} />
          </Curtain>
        </Stack>
      </Box>
      <Cloud
        fn='court'
        props={{ gameId: gameState.id, schemeIds: taken }}
      >
        Ready
      </Cloud>
      <ProfilesView />
      <DragOverlay dropAnimation={dropAnimationConfig}>
        xyz
        {sortableActiveItem}
      </DragOverlay>
    </DndContext>
  )
}
