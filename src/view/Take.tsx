import { Box, Heading, HStack, Spinner, Stack, Text } from '@chakra-ui/react'
import { Active, DndContext, DragOverEvent, DragOverlay, UniqueIdentifier } from '@dnd-kit/core'
import { useCallback, useContext, useMemo, useState } from 'react'
import { DROP_ANIMATION } from '../constants'
import authContext from '../context/auth'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import activeOver from '../service/activeOver'
import isHighestUntiedBidder from '../service/isHighestUntiedBidder'
import usePointerSensor from '../use/pointerSensor'
import StaticDungeonView from './StaticDungeon'
import ReadyContainerView from './ReadyContainer'
import DraggableSchemeView from './DraggableScheme'
import TakeCourtView from './TakeCourt'
import TakeDungeonView from './TakeDungeon'
import TakeTableauView from './TakeTableau'
import TimelineView from './Timeline'
import TrashHistoryView from './TrashHistory'
import PopoverButtonView from './PopoverButton'
import join from '../service/join'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { Functions } from 'firebase/functions'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { LockIcon } from '@chakra-ui/icons'
import { playerContext } from '../reader/player'
import returnFromTableau from '../service/returnFromTableau'
import filterOld from '../service/filterOld'
import CurtainView from './Curtain'
import PalaceView from './Palace'

export default function TakeView ({ functions }: {
  functions: Functions
}): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  const authState = useContext(authContext)
  const [cloudCourt, cloudCourtLoading] = useHttpsCallable(functions, 'court')
  const { court: gameCourt, dungeon: gameDungeon, id: gameId } = gameState
  const allReady = gameState.profiles?.every(profile => profile.auctionReady)
  const highestUntiedBidder = isHighestUntiedBidder({
    profiles: gameState.profiles,
    userId: authState.currentUser?.uid
  })
  const { leave, tableau: playerTableau, take } = useContext(playContext)
  const sensors = usePointerSensor()
  const [active, setActive] = useState<Active | null>(null)
  const getSchemeById = useCallback((id?: UniqueIdentifier | undefined) => {
    const courtScheme = gameCourt?.find((scheme) => scheme.id === id)
    const dungeonScheme = courtScheme ?? gameDungeon?.find((scheme) => scheme.id === id)
    const tableauScheme = dungeonScheme ?? playerTableau?.find((scheme) => scheme.id === id)
    return tableauScheme
  }, [gameCourt, gameDungeon, playerTableau])
  const activeScheme = useMemo(
    () => {
      return getSchemeById(active?.id)
    },
    [getSchemeById, active]
  )
  const activeSchemeView = activeScheme != null && <DraggableSchemeView active id={activeScheme.id} rank={activeScheme.rank} />
  function handleDragOver (event: DragOverEvent): void {
    const { active, over } = event
    if (
      playState.court == null ||
      playState.dungeon == null ||
      playState.tableau == null ||
      gameCourt == null ||
      gameDungeon == null ||
      playerTableau == null ||
      active == null ||
      over == null
    ) {
      return
    }
    if (active.id === over.id) {
      return
    }
    if (activeScheme == null) {
      throw new Error('No active scheme')
    }
    const activeCourt = playState.court.some((scheme) => scheme.id === active.id)
    const overCourt = playState.court.some((scheme) => scheme.id === over.id)
    const activeDungeon = playState.dungeon.some((scheme) => scheme.id === active.id)
    const overDungeon = playState.dungeon.some((scheme) => scheme.id === over.id)
    const activeTableau = playState.tableau.some((scheme) => scheme.id === active.id)
    const overTableau = playState.tableau.some((scheme) => scheme.id === over.id)
    const overTakeArea = over.id === 'takeArea'
    const overEmptyCourt = over.id === 'court'
    const overEmptyDungeon = over.id === 'dungeon'
    if (activeCourt) {
      activeOver({
        active: activeScheme,
        getSchemeById,
        old: gameCourt,
        over,
        overArea: overTakeArea,
        overNew: overTableau,
        overOld: overCourt,
        setOld: playState.setCourt,
        setNew: playState.setTableau,
        take
      })
    }
    if (activeDungeon) {
      activeOver({
        active: activeScheme,
        getSchemeById,
        old: gameDungeon,
        over,
        overArea: overTakeArea,
        overNew: overTableau,
        overOld: overDungeon,
        setOld: playState.setDungeon,
        setNew: playState.setTableau,
        take
      })
    }
    const fromCourt = gameCourt.some((scheme) => scheme.id === active.id)
    const fromDungeon = gameDungeon.some((scheme) => scheme.id === active.id)
    if (activeTableau) {
      const tableauFromDungeon = playState.tableau.filter((scheme) => {
        const fromDungeon = gameDungeon.some((dungeonScheme) => dungeonScheme.id === scheme.id)
        return fromDungeon
      })
      if (fromCourt && overEmptyCourt) {
        leave?.(activeScheme.id)

        playState.setTableau?.((current) => {
          return returnFromTableau({
            active,
            current,
            gameDungeon,
            twelve
          })
        })
        playState.setDungeon?.(current => [...current, ...tableauFromDungeon])
        playState.setCourt?.([activeScheme])
      }
      if (fromDungeon && overEmptyDungeon) {
        leave?.(activeScheme.id)
        playState.setTableau?.((current) => {
          return returnFromTableau({
            active,
            current,
            gameDungeon,
            twelve
          })
        })
        playState.setDungeon?.([activeScheme])
      }
      if (overTableau) {
        return
      }
      const filteredTableau = playState.tableau.filter((scheme) => scheme.id !== activeScheme.id)
      const twelve = filteredTableau.some((scheme) => scheme.rank === 12)
      if (fromCourt && overCourt) {
        leave?.(activeScheme.id)
        playState.setTableau?.((current) => {
          return returnFromTableau({
            active,
            current,
            gameDungeon,
            twelve
          })
        })
        playState.setCourt?.((current) => {
          return filterOld({ currentOld: current, old: gameCourt, active: activeScheme })
        })
        playState.setDungeon?.((current) => {
          return [...current, ...tableauFromDungeon]
        })
      }
      if (fromDungeon && overDungeon) {
        leave?.(activeScheme.id)
        playState.setTableau?.((current) => {
          return returnFromTableau({
            active,
            current,
            gameDungeon,
            twelve
          })
        })
        playState.setDungeon?.((current) => {
          return filterOld({ currentOld: current, old: gameDungeon, active: activeScheme })
        })
      }
    }
    if (fromCourt && (overCourt || overEmptyCourt)) {
      playState.setOverCourt?.(true)
    } else {
      playState.setOverCourt?.(false)
    }
    if (fromDungeon && (overDungeon || overEmptyDungeon)) {
      playState.setOverDungeon?.(true)
    } else {
      playState.setOverDungeon?.(false)
    }
    if (overTableau) {
      playState.setOverTableau?.(true)
    } else {
      playState.setOverTableau?.(false)
    }
  }
  if (
    gameState.choices?.length !== 0 ||
    playState.court == null ||
    playState.dungeon == null ||
    playState.tableau == null ||
    playState.taken == null ||
    allReady !== true ||
    !highestUntiedBidder ||
    gameDungeon == null
  ) {
    return <></>
  }
  const twelve = playState.tableau.some((scheme) => scheme.rank === 12)
  const tinyDungeon = !twelve && <StaticDungeonView />
  const fontWeight = playState.overTableau === true ? '1000' : undefined
  const courtTaken = playState.taken.filter((schemeId) => {
    const court = gameCourt?.some((scheme) => scheme.id === schemeId)
    return court
  })
  const courtTakenSchemes = courtTaken.map((schemeId) => {
    const scheme = gameCourt?.find((scheme) => scheme.id === schemeId)
    if (scheme == null) {
      throw new Error('Scheme not found')
    }
    return scheme
  })
  const courtTakenRanks = courtTakenSchemes.map((scheme) => scheme.rank)
  const courtTakenJoined = join(courtTakenRanks, 'nothing')
  const courtTakenMessage = `You took ${courtTakenJoined} from the court.`
  const courtLeft = playState.court.length > 0
  const courtLeftRanks = playState.court.map((scheme) => scheme.rank)
  const courtLeftJoined = join(courtLeftRanks, 'nothing')
  const courtLeftMessage = `You left ${courtLeftJoined} in the court.`
  const courtLeftView = courtLeft && <Text>{courtLeftMessage}</Text>
  const imprisonedRank = Math.min(...courtLeftRanks)
  const imprisonedMessage = `${imprisonedRank} will be imprisoned in the dungeon!`
  const imprisonedView = courtLeft && <Text>{imprisonedMessage}</Text>
  const dungeonTaken = playState.taken.filter((schemeId) => {
    const dungeon = gameDungeon?.some((scheme) => scheme.id === schemeId)
    return dungeon
  })
  const dungeonTakenSchemes = dungeonTaken.map((schemeId) => {
    const scheme = gameDungeon?.find((scheme) => scheme.id === schemeId)
    if (scheme == null) {
      throw new Error('Scheme not found')
    }
    return scheme
  })
  const dungeonTakenRanks = dungeonTakenSchemes.map((scheme) => scheme.rank)
  const takenDungeonJoined = join(dungeonTakenRanks, 'nothing')
  const dungeonTakenMessage = `You took ${takenDungeonJoined} from the dungeon.`
  const dungeonTakenView = twelve && gameDungeon.length > 0 && <Text>{dungeonTakenMessage}</Text>
  const dungeonLeft = twelve && playState.dungeon.length > 0
  const dungeonLeftRanks = playState.dungeon.map((scheme) => scheme.rank)
  const dungeonLeftJoined = join(dungeonLeftRanks, 'nothing')
  const dungeonLeftMessage = `You left ${dungeonLeftJoined} in the dungeon.`
  const dungeonLeftView = dungeonLeft && <Text>{dungeonLeftMessage}</Text>
  const readyText = <Text>Ready</Text>
  const readyContent = courtLeft ? <>{readyText} <LockIcon /></> : readyText
  const readyLoadingContent = cloudCourtLoading ? <HStack>{readyContent} <Spinner /></HStack> : readyContent
  const readyLabel = (
    <HStack>{readyLoadingContent}</HStack>
  )
  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active)
      }}
      onDragCancel={() => {
        setActive(null)
      }}
      onDragEnd={({ active, over }) => {
        setActive(null)
        playState.setOverCourt?.(false)
        playState.setOverDungeon?.(false)
        playState.setOverTableau?.(false)
      }}
      onDragOver={handleDragOver}
    >
      <Stack direction='row'>
        <CurtainView
          open={cloudCourtLoading}
          hider={
            <>
              {tinyDungeon}
              <TakeCourtView />
              <TimelineView />
            </>
          }
        >
          <PalaceView />
          <TimelineView />
        </CurtainView>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Box>
          <Heading size='sm' fontWeight={fontWeight}>Play</Heading>
          <TakeTableauView />
        </Box>
        <ReadyContainerView>
          <PopoverButtonView label={readyLabel} disabled={cloudCourtLoading}>
            <Text>{courtTakenMessage}</Text>
            {courtLeftView}
            {dungeonTakenView}
            {dungeonLeftView}
            {imprisonedView}
            <ChakraButton
              onClick={async () => {
                await cloudCourt({ gameId, schemeIds: playState.taken })
              }}
            >
              {readyLoadingContent}
            </ChakraButton>
          </PopoverButtonView>
        </ReadyContainerView>
        <Box>
          <Heading size='sm'>Trash</Heading>
          <TrashHistoryView history={playerState.trashHistory} />
        </Box>
      </Stack>
      <TakeDungeonView />
      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {activeSchemeView}
      </DragOverlay>

    </DndContext>
  )
}
