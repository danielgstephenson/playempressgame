import { Box, Heading, Stack } from '@chakra-ui/react'
import { Active, DndContext, DragOverEvent, DragOverlay } from '@dnd-kit/core'
import { useContext, useMemo, useState } from 'react'
import { DROP_ANIMATION } from '../constants'
import authContext from '../context/auth'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import activeOver from '../service/activeOver'
import add from '../service/add'
import isHighestUntiedBidder from '../service/isHighestUntiedBidder'
import reorder from '../service/reorder'
import usePointerSensor from '../use/pointerSensor'
import Cloud from './Cloud'
import StaticDungeonView from './StaticDungeon'
import ReadyContainerView from './ReadyContainer'
import SortableSchemeView from './SortableScheme'
import TakeCourtView from './TakeCourt'
import TakeDungeonView from './TakeDungeon'
import TakeTableauView from './TakeTableau'
import TimelineView from './Timeline'
import TrashHistoryView from './TrashHistory'

export default function TakeView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const authState = useContext(authContext)
  const { court: gameCourt, dungeon: gameDungeon, id: gameId } = gameState
  const allReady = gameState.profiles?.every(profile => profile.auctionReady)
  const highestUntiedBidder = isHighestUntiedBidder({
    profiles: gameState.profiles,
    userId: authState.currentUser?.uid
  })
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
    const overEmptyCourt = over.id === 'court'
    const overEmptyDungeon = over.id === 'dungeon'
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
          return current.filter((scheme) => {
            if (scheme.id === active.id) {
              return false
            }
            const fromDungeon = gameDungeon.some((dungeonScheme) => dungeonScheme.id === scheme.id)
            if (!twelve && fromDungeon) {
              return false
            }
            return true
          })
        })
        playState.setDungeon?.(current => [...current, ...tableauFromDungeon])
        playState.setCourt?.([activeScheme])
      }
      if (fromDungeon && overEmptyDungeon) {
        leave?.(activeScheme.id)
        playState.setTableau?.((current) => {
          return current.filter((scheme) => {
            if (scheme.id === active.id) {
              return false
            }
            const fromDungeon = gameDungeon.some((dungeonScheme) => dungeonScheme.id === scheme.id)
            if (!twelve && fromDungeon) {
              return false
            }
            return true
          })
        })
        playState.setDungeon?.([activeScheme, ...tableauFromDungeon])
      }
      if (overTableau) {
        playState.setTableau?.((current) => reorder({ a: active, b: over, current }))
      }
      const filteredTableau = playState.tableau.filter((scheme) => scheme.id !== activeScheme.id)
      const twelve = filteredTableau.some((scheme) => scheme.rank === 12)
      if (fromCourt && overCourt) {
        leave?.(activeScheme.id)
        playState.setTableau?.((current) => {
          return current.filter((scheme) => {
            if (scheme.id === active.id) {
              return false
            }
            const fromDungeon = gameDungeon.some((dungeonScheme) => dungeonScheme.id === scheme.id)
            if (!twelve && fromDungeon) {
              return false
            }
            return true
          })
        })
        playState.setCourt?.((current) => {
          return add({
            active: activeScheme,
            current,
            over
          })
        })
        playState.setDungeon?.((current) => {
          return [...current, ...tableauFromDungeon]
        })
      }
      if (fromDungeon && overDungeon) {
        leave?.(activeScheme.id)
        playState.setTableau?.((current) => {
          return current.filter((scheme) => {
            if (scheme.id === active.id) {
              return false
            }
            if (!twelve && fromDungeon) {
              return false
            }
            return true
          })
        })
        playState.setDungeon?.((current) => {
          const overIndex = current.findIndex((scheme) => scheme.id === over.id)
          const beforeIndex = current.slice(0, overIndex)
          const afterIndex = current.slice(overIndex)
          const added = [...beforeIndex, activeScheme, ...afterIndex, ...tableauFromDungeon]
          return added
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
    allReady !== true ||
    !highestUntiedBidder
  ) {
    return <></>
  }
  const twelve = playState.tableau.some((scheme) => scheme.rank === 12)
  const tinyDungeon = !twelve && <StaticDungeonView />
  const fontWeight = playState.overTableau === true ? '1000' : undefined
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
        {tinyDungeon}
        <TakeCourtView />
        <TimelineView />
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Box>
          <Heading size='sm' fontWeight={fontWeight}>Play</Heading>
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
