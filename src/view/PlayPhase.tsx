import { Box, Heading, HStack } from '@chakra-ui/react'
import { Active, DndContext, DragOverlay } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState, useMemo, useContext } from 'react'
import { DROP_ANIMATION } from '../constants'
import playContext from '../context/play'
import dragReturn from '../service/dragReturn'
import usePointerSensor from '../use/pointerSensor'
import ChoiceView from './Choice'
import ReserveStart from './ReserveStart'
import ReserveChoiceReadyView from './ReserveChoiceReady'
import ReserveChoiceView from './ReserveChoiceView.tsx'
import HandView from './Hand'
import HandSchemeView from './HandScheme'
import PlayReadyView from './PlayReady'
import PrivateInPlayView from './PrivateInPlay'
import PrivateTrashView from './PrivateTrash'
import ReadyContainerView from './ReadyContainer'
import TrashChoiceReadyView from './TrashChoiceReady'
import ReorderReadyView from './ReorderReady'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import isTaking from '../service/isTaking'
import { playerContext } from '../reader/player'
import isReordering from '../service/isReordering'
import LastReserveView from './LastReserve'

export default function PlayPhaseView (): JSX.Element {
  const gameState = useContext(gameContext)
  const {
    reserveChoiceId,
    hand,
    handClone,
    overReserve,
    playSchemeId,
    setReserveChoiceId,
    setHand,
    setOverReserve,
    setOverPlay,
    setOverTrash,
    setPlaySchemeId,
    setTrashChoiceId,
    setTrashSchemeId,
    trashChoiceId,
    trashSchemeId
  } = useContext(playContext)
  const playerState = useContext(playerContext)
  const sensors = usePointerSensor()
  const [active, setActive] = useState<Active | null>(null)
  const activeScheme = useMemo(
    () => handClone?.find((scheme) => scheme.id === active?.id),
    [active, handClone]
  )
  const sortableActiveItem = (activeScheme != null) && <HandSchemeView active id={activeScheme.id} />
  const fontWeight = overReserve === true ? '1000' : undefined
  if (hand == null || setHand == null) {
    return <></>
  }
  const taking = isTaking({ profiles: gameState.profiles, userId: playerState.userId, choices: gameState.choices })
  const reordering = isReordering({
    choices: gameState.choices,
    phase: gameState.phase,
    playerId: playerState.id
  })
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
        const activeReserveChoice = active.id === reserveChoiceId
        const activePlay = active.id === playSchemeId
        const overTrashScheme = over.id === trashSchemeId
        const overTrashChoice = over.id === 'trashChoice'
        const overTrashChoiceScheme = over.id === trashChoiceId
        const overReserveChoice = over.id === 'reserveChoice'
        const overReserveChoiceScheme = over.id === reserveChoiceId
        const overTrashArea = over.id === 'trashArea'
        const overPlayScheme = over.id === playSchemeId
        const overPlayArea = over.id === 'playArea'
        const overHand = hand.some((scheme) => scheme.id === over.id)
        if (overHand) {
          setOverReserve?.(false)
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
          if (activeReserveChoice) {
            setReserveChoiceId?.(undefined)
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
        } else if (overReserveChoice) {
          setOverReserve?.(true)
          setReserveChoiceId?.(String(active.id))
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
        } else if (overReserveChoiceScheme) {
          setOverReserve?.(true)
        } else if (overTrashChoiceScheme) {
          setOverTrash?.(true)
        } else {
          setOverReserve?.(false)
          setOverPlay?.(false)
          setOverTrash?.(false)
        }
      }}
      onDragEnd={({ active, over }) => {
        setOverReserve?.(false)
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
          if (over.id === reserveChoiceId) {
            setReserveChoiceId?.(String(active.id))
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
      <Curtain open={!taking}>
        <HStack alignItems='start' spacing='2px'>
          <PrivateInPlayView />
          <ReadyContainerView width='100%'>
            <PlayReadyView />
            <ReserveChoiceReadyView />
            <TrashChoiceReadyView />
            <ReorderReadyView />
          </ReadyContainerView>
          <PrivateTrashView />
        </HStack>
      </Curtain>
      <ChoiceView />
      <Heading size='sm' textAlign='center'>Hand</Heading>
      <HandView />
      <Curtain open={reordering}>
        <Heading size='md' textAlign='center'>Reorder your reserve</Heading>
      </Curtain>
      <Box>
        <Heading size='sm' fontWeight={fontWeight} textAlign='center'>Reserve</Heading>
        <HStack gap='2px' justifyContent='center'>
          <ReserveStart />
          <ReserveChoiceView />
          <LastReserveView />
        </HStack>
      </Box>
      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {sortableActiveItem}
      </DragOverlay>
    </DndContext>
  )
}
