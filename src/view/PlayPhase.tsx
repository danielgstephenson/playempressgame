import { HStack, VStack } from '@chakra-ui/react'
import { Active, defaultDropAnimationSideEffects, DndContext, DragOverlay, DropAnimation, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useContext, useState, useMemo } from 'react'
import playContext from '../context/play'
import dragReturn from '../service/dragReturn'
import ChoiceView from './Choice'
import HandView from './Hand'
import HandSchemeView from './HandScheme'
import PlayAreaView from './PlayArea'
import PlayerGoldView from './PlayerGold'
import PlayerSilverView from './PlayerSilver'
import PlayReadyView from './PlayReady'
import TrashAreaView from './TrashArea'

export default function PlayPhaseView (): JSX.Element {
  const {
    hand,
    handClone,
    play,
    playSchemeId,
    setHand,
    setPlaySchemeId,
    setTrashSchemeId,
    trash,
    trashSchemeId
  } = useContext(playContext)
  const [active, setActive] = useState<Active | null>(null)
  const activeScheme = useMemo(
    () => handClone?.find((scheme) => scheme.id === active?.id),
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

  const sortableActiveItem = (activeScheme != null)
    ? <HandSchemeView active id={activeScheme.id} />
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
      onDragOver={({ active, over }) => {
        const overNothing = over?.id == null
        if (overNothing) {
          return
        }
        if (activeScheme == null) {
          throw new Error('Active scheme is not in hand')
        }
        const activeTrash = active.id === trashSchemeId
        const activePlay = active.id === playSchemeId
        const overTrashScheme = over.id === trashSchemeId
        const overTrash = over.id === 'trashArea' || overTrashScheme
        const overPlayScheme = over.id === playSchemeId
        const overPlay = over.id === 'playArea' || overPlayScheme
        const overHand = !overTrash && !overPlay
        if (overHand) {
          if (activeTrash) {
            setTrashSchemeId?.(undefined)
          }
          if (activePlay) {
            setPlaySchemeId?.(undefined)
          }
          setHand(current => {
            const activeIndex = current.findIndex((scheme) => scheme.id === active.id)
            const overIndex = current.findIndex((scheme) => scheme.id === over.id)
            if (current.some(scheme => scheme.id === active.id)) {
              return arrayMove(hand, activeIndex, overIndex)
            } else {
              const overIndex = current.findIndex((scheme) => scheme.id === over.id)
              const beforeIndex = current.slice(0, overIndex)
              const afterIndex = current.slice(overIndex)
              const newHand = [...beforeIndex, activeScheme, ...afterIndex]
              return newHand
            }
          })
        } else if (overTrash) {
          trash?.(String(active.id))
          setPlaySchemeId?.(current => current === active.id ? undefined : current)
          setHand(current => {
            return dragReturn({
              active,
              over,
              overScheme: overTrashScheme,
              hand: current,
              handClone
            })
          })
        } else if (overPlay) {
          console.log('overPlay over.id', over.id)
          console.log('overPlay active.id', active.id)
          console.log('overPlay playSchemeId', playSchemeId)
          play?.(String(active.id))
          setTrashSchemeId?.(current => current === active.id ? undefined : current)
          setHand(current => {
            return dragReturn({
              active,
              append: false,
              over,
              overScheme: overPlayScheme,
              hand: current,
              handClone
            })
          })
        }
      }}
      onDragEnd={({ active, over }) => {
        // if (over != null && active.id !== over.id) {
        //   if (over.id === 'trashArea' || over.id === trashSchemeId) {
        //     trash?.(String(active.id))
        //     setHand(current => current.filter((scheme) => scheme.id !== active.id))
        //     return
        //   }
        //   if (over.id === 'playArea' || over.id === playSchemeId) {
        //     play?.(String(active.id))
        //     setHand(current => current.filter((scheme) => scheme.id !== active.id))
        //     return
        //   }
        //   if (activeScheme == null) {
        //     throw new Error('Active scheme is not in hand')
        //   }
        //   const activeIndex = hand.findIndex(({ id }) => id === active.id)
        //   const overIndex = hand.findIndex(({ id }) => id === over.id)
        //   setPlaySchemeId?.(current => active.id === current ? undefined : current)
        //   setTrashSchemeId?.(current => active.id === current ? undefined : current)
        //   setHand(current => {
        //     if (current.some(scheme => scheme.id === active.id)) {
        //       return arrayMove(hand, activeIndex, overIndex)
        //     } else {
        //       const overIndex = current.findIndex((scheme) => scheme.id === over.id)
        //       const beforeIndex = current.slice(0, overIndex)
        //       const afterIndex = current.slice(overIndex)
        //       const newHand = [...beforeIndex, activeScheme, ...afterIndex]
        //       return newHand
        //     }
        //   })
        // }
        setActive(null)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
    >
      <HStack alignItems='start'>
        <PlayAreaView />
        <VStack direction='column' flexGrow='1'>
          <PlayerGoldView />
          <PlayerSilverView />
          <PlayReadyView />
        </VStack>
        <TrashAreaView />
      </HStack>
      <ChoiceView />
      <HandView />
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {sortableActiveItem}
      </DragOverlay>
    </DndContext>
  )
}
