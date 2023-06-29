import { Active, DndContext, DragOverEvent, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useContext, useMemo, useState } from 'react'
import { DROP_ANIMATION } from '../constants'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import reorder from '../service/reorder'
import usePointerSensor from '../use/pointerSensor'
import Cloud from './Cloud'
import SortableSchemeView from './SortableScheme'
import SortableSchemesView from './SortableSchemes'
import TakeTableauView from './TakeTableau'

export default function CourtTakeView (): JSX.Element {
  const { court: gameCourt, dungeon: gameDungeon, id: gameId } = useContext(gameContext)
  const { tableau: playerTableau } = useContext(playContext)
  const playState = useContext(playContext)
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
    if (playState.court == null || playState.dungeon == null || playState.tableau == null) {
      return
    }
    const { active, over } = event
    if (active == null) {
      return
    }
    if (over == null) {
      return
    }
    console.log('over.id', over.id)
    if (active.id === over.id) {
      return
    }
    if (activeScheme == null) {
      throw new Error('No active scheme')
    }
    const activeCourt = playState.court.some((scheme) => scheme.id === active.id)
    console.log('activeCourt', activeCourt)
    const activeDungeon = playState.dungeon.some((scheme) => scheme.id === active.id)
    const activeTableau = playState.tableau.some((scheme) => scheme.id === active.id)
    const overCourt = playState.court.some((scheme) => scheme.id === over.id)
    console.log('overCourt', overCourt)
    const overDungeon = playState.dungeon.some((scheme) => scheme.id === over.id)
    const overTableau = playState.tableau.some((scheme) => scheme.id === over.id)
    const overTakeArea = over.id === 'takeArea'
    if (activeCourt) {
      if (overCourt) {
        playState.setCourt?.((current) => reorder({ a: active, b: over, current }))
      }

      if (overTakeArea) {
        playState.setCourt?.((current) => current.filter((scheme) => scheme.id !== active.id))
        playState.setTableau?.([activeScheme])
      }
    }
    if (activeDungeon && overDungeon) {
      playState.setDungeon?.((current) => reorder({ a: active, b: over, current }))
    }
    if (activeTableau && overTableau) {
      playState.setTableau?.((current) => reorder({ a: active, b: over, current }))
    }
    if (activeTableau && overCourt) {
      playState.setTableau?.((current) => current.filter((scheme) => scheme.id !== active.id))
      playState.setCourt?.((current) => {
        const activeIndex = current.findIndex((scheme) => scheme.id === active.id)
        const overIndex = current.findIndex((scheme) => scheme.id === over.id)
        if (current.some(scheme => scheme.id === active.id)) {
          return arrayMove(current, activeIndex, overIndex)
        } else {
          const overIndex = current.findIndex((scheme) => scheme.id === over.id)
          const beforeIndex = current.slice(0, overIndex)
          const afterIndex = current.slice(overIndex)
          const added = [...beforeIndex, activeScheme, ...afterIndex]
          return added
        }
      })
    }
  }
  if (playState.court == null || playState.dungeon == null || playState.tableau == null) {
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
      <SortableContext items={playState.court}>
        <SortableSchemesView schemes={playState.court} />
      </SortableContext>
      {/* <SortableContext items={playState.dungeon}>
        <SortableSchemesView schemes={playState.dungeon} />
      </SortableContext> */}
      <TakeTableauView />
      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {activeSchemeView}
      </DragOverlay>
      <Cloud
        fn='court'
        props={{ gameId, schemeIds: playState.taken }}
      >
        Ready
      </Cloud>
    </DndContext>
  )
}
