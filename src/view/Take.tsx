import { Box, Heading, Stack } from '@chakra-ui/react'
import { Active, DndContext, DragOverEvent, DragOverlay } from '@dnd-kit/core'
import { useContext, useMemo, useState } from 'react'
import { DROP_ANIMATION } from '../constants'
import authContext from '../context/auth'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import activeOver from '../service/activeOver'
import isHighestUntiedBidder from '../service/isHighestUntiedBidder'
import move from '../service/move'
import reorder from '../service/reorder'
import usePointerSensor from '../use/pointerSensor'
import Cloud from './Cloud'
import ReadyContainerView from './ReadyContainer'
import SortableSchemeView from './SortableScheme'
import TakeCourtView from './TakeCourt'
import TakeDungeonView from './TakeDungeon'
import TakeTableauView from './TakeTableau'
import TrashHistoryView from './TrashHistory'

export default function TakeView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const authState = useContext(authContext)
  const { court: gameCourt, dungeon: gameDungeon, id: gameId } = gameState
  const allReady = gameState.profiles?.every(profile => profile.auctionReady)
  const highestUntiedBidder = isHighestUntiedBidder({ game: gameState, userId: authState.currentUser?.uid })
  const { leave, tableau: playerTableau, take } = useContext(playContext)
  const sensors = usePointerSensor()
  const [active, setActive] = useState<Active | null>(null)
  const activeScheme = useMemo(
    () => {
      const courtScheme = gameCourt?.find((scheme) => scheme.id === active?.id)
      const dungeonScheme = courtScheme ?? gameDungeon?.find((scheme) => scheme.id === active?.id)
      const tableauScheme = dungeonScheme ?? playerTableau?.find((scheme) => scheme.id === active?.id)
      return tableauScheme
    },
    [active, gameCourt, gameDungeon, playerTableau]
  )
  const activeSchemeView = activeScheme != null && <SortableSchemeView active id={activeScheme.id} rank={activeScheme.rank} />
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
    if (activeCourt) {
      activeOver({
        active: activeScheme,
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
        over,
        overArea: overTakeArea,
        overNew: overTableau,
        overOld: overDungeon,
        setOld: playState.setDungeon,
        setNew: playState.setTableau,
        take
      })
    }
    if (activeTableau) {
      if (overTableau) {
        playState.setTableau?.((current) => reorder({ a: active, b: over, current }))
      }
      const fromCourt = gameCourt.some((scheme) => scheme.id === active.id)
      if (fromCourt && overCourt) {
        leave?.(activeScheme.id)
        move({
          active: activeScheme,
          setOld: playState.setTableau,
          setNew: playState.setCourt,
          over
        })
      }
      const fromDungeon = gameDungeon.some((scheme) => scheme.id === active.id)
      if (fromDungeon && overDungeon) {
        leave?.(activeScheme.id)
        move({
          active: activeScheme,
          setOld: playState.setTableau,
          setNew: playState.setDungeon,
          over
        })
      }
    }
  }
  if (
    playState.court == null ||
    playState.dungeon == null ||
    playState.tableau == null ||
    allReady !== true ||
    !highestUntiedBidder
  ) {
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
      onDragEnd={({ active, over }) => {
        setActive(null)
      }}
      onDragOver={handleDragOver}
    >
      <TakeCourtView />
      <Stack direction='row' justifyContent='space-between'>
        <Box>
          <Heading size='sm'>Play</Heading>
          <TakeTableauView />
        </Box>
        <ReadyContainerView>
          <Cloud
            fn='court'
            props={{ gameId, schemeIds: playState.taken }}
          >
            Ready
          </Cloud>
        </ReadyContainerView>
        <Box>
          <Heading size='sm'>Trash</Heading>
          <TrashHistoryView />
        </Box>
      </Stack>
      <TakeDungeonView />
      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {activeSchemeView}
      </DragOverlay>

    </DndContext>
  )
}
