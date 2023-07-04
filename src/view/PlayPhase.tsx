import { Box, Heading, HStack } from '@chakra-ui/react'
import { Active, DndContext, DragOverlay } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useContext, useState, useMemo } from 'react'
import { DROP_ANIMATION } from '../constants'
import playContext from '../context/play'
import dragReturn from '../service/dragReturn'
import usePointerSensor from '../use/pointerSensor'
import ChoiceView from './Choice'
import DeckView from './Deck'
import DeckChoiceReadyView from './DeckChoiceReady'
import DeckChoiceView from './DeckChoiceView.tsx'
import DiscardView from './Discard'
import HandView from './Hand'
import HandSchemeView from './HandScheme'
import PlayReadyView from './PlayReady'
import PrivateTableauView from './PrivateTableau'
import PrivateTrashView from './PrivateTrash'
import ReadyContainerView from './ReadyContainer'
import TrashChoiceReadyView from './TrashChoiceReady'
import ReorderReadyView from './ReorderReady'

export default function PlayPhaseView (): JSX.Element {
  const {
    deckChoiceId,
    hand,
    handClone,
    overDeck,
    playSchemeId,
    setDeckChoiceId,
    setHand,
    setOverDeck,
    setOverPlay,
    setOverTrash,
    setPlaySchemeId,
    setTrashChoiceId,
    setTrashSchemeId,
    trashChoiceId,
    trashSchemeId
  } = useContext(playContext)
  const sensors = usePointerSensor()
  const [active, setActive] = useState<Active | null>(null)
  const activeScheme = useMemo(
    () => handClone?.find((scheme) => scheme.id === active?.id),
    [active, handClone]
  )
  const sortableActiveItem = (activeScheme != null) && <HandSchemeView active id={activeScheme.id} />
  const fontWeight = overDeck === true ? '1000' : undefined
  if (hand == null || setHand == null) {
    return <></>
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active)
      }}
      onDragCancel={() => {
        setActive(null)
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
        const activeTrashChoice = active.id === trashChoiceId
        const activeDeckChoice = active.id === deckChoiceId
        const activePlay = active.id === playSchemeId
        const overTrashScheme = over.id === trashSchemeId
        const overTrashChoice = over.id === 'trashChoice'
        const overTrashChoiceScheme = over.id === trashChoiceId
        const overDeckChoice = over.id === 'deckChoice'
        const overDeckChoiceScheme = over.id === deckChoiceId
        const overTrashArea = over.id === 'trashArea'
        const overPlayScheme = over.id === playSchemeId
        const overPlayArea = over.id === 'playArea'
        const overHand = hand.some((scheme) => scheme.id === over.id)
        if (overHand) {
          setOverDeck?.(false)
          setOverPlay?.(false)
          setOverTrash?.(false)
          if (activeTrash) {
            setTrashSchemeId?.(undefined)
          }
          if (activePlay) {
            setPlaySchemeId?.(undefined)
          }
          if (activeTrashChoice) {
            setTrashChoiceId?.(undefined)
          }
          if (activeDeckChoice) {
            setDeckChoiceId?.(undefined)
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
        } else if (overTrashChoice) {
          setOverTrash?.(true)
          setTrashChoiceId?.(String(active.id))
          setHand(current => {
            return dragReturn({
              active,
              hand: current
            })
          })
        } else if (overDeckChoice) {
          setOverDeck?.(true)
          setDeckChoiceId?.(String(active.id))
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
        } else if (overDeckChoiceScheme) {
          setOverDeck?.(true)
        } else if (overTrashChoiceScheme) {
          setOverTrash?.(true)
        } else {
          setOverDeck?.(false)
          setOverPlay?.(false)
          setOverTrash?.(false)
        }
      }}
      onDragEnd={({ active, over }) => {
        setOverDeck?.(false)
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
          if (over.id === trashChoiceId) {
            setTrashChoiceId?.(String(active.id))
            setHand(current => {
              if (handClone == null || overScheme == null) {
                return current
              }
              const filtered = current.filter((scheme) => scheme.id !== active.id)
              const newHand = [...filtered, overScheme]
              return newHand
            })
          }
          if (over.id === deckChoiceId) {
            setDeckChoiceId?.(String(active.id))
            setHand(current => {
              if (handClone == null || overScheme == null) {
                return current
              }
              const filtered = current.filter((scheme) => scheme.id !== active.id)
              const newHand = [...filtered, overScheme]
              return newHand
            })
          }
          if (activeScheme == null) {
            throw new Error('Active scheme is not in hand')
          }
        }
        setActive(null)
      }}
    >
      <HStack alignItems='start' spacing='2px'>
        <PrivateTableauView />
        <ReadyContainerView width='100%'>
          <PlayReadyView />
          <DeckChoiceReadyView />
          <TrashChoiceReadyView />
          <ReorderReadyView />
        </ReadyContainerView>
        <PrivateTrashView />
      </HStack>
      <ChoiceView />
      <Heading size='sm' textAlign='center'>Hand</Heading>
      <HandView />
      <HStack justifyContent='space-between' alignItems='start'>
        <Box>
          <Heading size='sm' fontWeight={fontWeight}>Deck</Heading>
          <HStack>
            <DeckView />
            <DeckChoiceView />
          </HStack>
        </Box>
        <Box><DiscardView /></Box>
      </HStack>
      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {sortableActiveItem}
      </DragOverlay>
    </DndContext>
  )
}
