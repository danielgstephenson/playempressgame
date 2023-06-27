import { HStack, VStack } from '@chakra-ui/react'
import { Active, defaultDropAnimationSideEffects, DndContext, DragOverlay, DropAnimation, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useContext, useState, useMemo } from 'react'
import playContext from '../context/play'
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
  console.log('sortableActiveItem', sortableActiveItem)

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
        const activeTrash = active.id === trashSchemeId
        const activePlay = active.id === playSchemeId
        const overTrash = over.id === 'trashArea' || over.id === trashSchemeId
        const overPlay = over.id === 'playArea' || over.id === playSchemeId
        const overHand = !overTrash && !overPlay
        if (overHand) {
          if (activeScheme == null) {
            throw new Error('Active scheme is not in hand')
          }

          setHand(current => {
            if (current.every((scheme) => scheme.id !== active.id)) {
              const overIndex = current.findIndex((scheme) => scheme.id === over.id)
              const beforeIndex = current.slice(0, overIndex)
              const afterIndex = current.slice(overIndex)
              const newHand = [...beforeIndex, activeScheme, ...afterIndex]
              return newHand
            }
            return current
          })
          if (activeTrash) {
            setTrashSchemeId?.(undefined)
          }
          if (activePlay) {
            setPlaySchemeId?.(undefined)
          }
        }
        if (overTrash) {
          trash?.(String(active.id))
          setHand(current => {
            const filtered = current.filter((scheme) => scheme.id !== active.id)
            const trashScheme = handClone?.find((scheme) => scheme.id === active.id)
            if (trashScheme == null) {
              throw new Error('Trash scheme is not in hand')
            }
            return [...filtered, trashScheme]
          })
        }
        if (overPlay) {
          console.log('overPlay over.id', over.id)
          console.log('overPlay active.id', active.id)
          console.log('overPlay playSchemeId', playSchemeId)
          play?.(String(active.id))
          setHand(current => {
            const filtered = current.filter((scheme) => scheme.id !== active.id)
            const playScheme = handClone?.find((scheme) => scheme.id === active.id)
            if (playScheme == null) {
              throw new Error('Play scheme is not in hand')
            }
            return [...filtered, playScheme]
          })
        }
      }}
      onDragEnd={({ active, over }) => {
        if (over != null && active.id !== over.id) {
          if (over.id === 'trashArea' || over.id === trashSchemeId) {
            trash?.(String(active.id))
            setHand(current => current.filter((scheme) => scheme.id !== active.id))
            return
          }
          if (over.id === 'playArea' || over.id === playSchemeId) {
            play?.(String(active.id))
            setHand(current => current.filter((scheme) => scheme.id !== active.id))
            return
          }
          if (activeScheme == null) {
            throw new Error('Active scheme is not in hand')
          }
          const activeIndex = hand.findIndex(({ id }) => id === active.id)
          const overIndex = hand.findIndex(({ id }) => id === over.id)
          setPlaySchemeId?.(current => active.id === current ? undefined : current)
          setTrashSchemeId?.(current => active.id === current ? undefined : current)
          setHand(current => {
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
        }
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
