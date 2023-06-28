import { HStack, VStack } from '@chakra-ui/react'
import { Active, defaultDropAnimationSideEffects, DndContext, DragOverlay, DropAnimation, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useContext, useState, useMemo } from 'react'
import playContext from '../context/play'
import dragReturn from '../service/dragReturn'
import ChoiceView from './Choice'
import HandView from './Hand'
import HandSchemeView from './HandScheme'
import PlayerGoldView from './PlayerGold'
import PlayerSilverView from './PlayerSilver'
import PlayReadyView from './PlayReady'
import PrivateTableauView from './PrivateTableau'
import PrivateTrashView from './PrivateTrash'

export default function PlayPhaseView (): JSX.Element {
  const {
    hand,
    handClone,
    playSchemeId,
    setHand,
    setOverPlay,
    setOverTrash,
    setPlaySchemeId,
    setTrashSchemeId,
    trashSchemeId
  } = useContext(playContext)
  const [active, setActive] = useState<Active | null>(null)
  const activeScheme = useMemo(
    () => handClone?.find((scheme) => scheme.id === active?.id),
    [active, handClone]
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
        const overTrashArea = over.id === 'trashArea'
        const overPlayScheme = over.id === playSchemeId
        const overPlayArea = over.id === 'playArea'
        const overHand = hand.some((scheme) => scheme.id === over.id)
        if (overHand) {
          setOverPlay?.(false)
          setOverTrash?.(false)
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
        } else if (overTrashArea) {
          setOverPlay?.(false)
          setOverTrash?.(true)
          setTrashSchemeId?.(String(active.id))
          setPlaySchemeId?.(current => current === active.id ? undefined : current)
          setHand(current => {
            return dragReturn({
              active,
              hand: current
            })
          })
        } else if (overPlayArea) {
          setOverPlay?.(true)
          setOverTrash?.(false)
          setPlaySchemeId?.(String(active.id))
          setTrashSchemeId?.(current => current === active.id ? undefined : current)
          setHand(current => {
            return dragReturn({
              active,
              hand: current
            })
          })
        } else if (overPlayScheme) {
          setOverPlay?.(true)
          setOverTrash?.(false)
        } else if (overTrashScheme) {
          setOverPlay?.(false)
          setOverTrash?.(true)
        } else {
          setOverPlay?.(false)
          setOverTrash?.(false)
        }
      }}
      onDragEnd={({ active, over }) => {
        setOverPlay?.(false)
        setOverTrash?.(false)
        if (over != null && active.id !== over.id) {
          const overScheme = handClone?.find((scheme) => scheme.id === over?.id)
          if (over.id === trashSchemeId) {
            setTrashSchemeId?.(String(active.id))
            setPlaySchemeId?.(current => current === active.id ? undefined : current)
            setHand(current => {
              if (handClone == null || overScheme == null) {
                return current
              }
              const filtered = current.filter((scheme) => scheme.id !== active.id)
              const newHand = [...filtered, overScheme]
              return newHand
            })
            return
          }
          if (over.id === playSchemeId) {
            setPlaySchemeId?.(String(active.id))
            setTrashSchemeId?.(current => current === active.id ? undefined : current)
            setHand(current => {
              if (handClone == null || overScheme == null) {
                return current
              }
              const filtered = current.filter((scheme) => scheme.id !== active.id)
              const newHand = [overScheme, ...filtered]
              return newHand
            })
            return
          }
          if (activeScheme == null) {
            throw new Error('Active scheme is not in hand')
          }
        }
        setActive(null)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
    >
      <HStack alignItems='start' spacing='2px'>
        <PrivateTableauView />
        <VStack flexGrow='1'>
          <HStack>
            <PlayerGoldView />
            <PlayerSilverView />
          </HStack>
          <PlayReadyView />
        </VStack>
        <PrivateTrashView />
      </HStack>
      <ChoiceView />
      <HandView />
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {sortableActiveItem}
      </DragOverlay>
    </DndContext>
  )
}
