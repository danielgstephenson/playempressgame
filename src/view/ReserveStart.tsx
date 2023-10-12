import { DndContext, Active, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useContext, useMemo, useState } from 'react'
import { DROP_ANIMATION } from '../constants'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import usePointerSensor from '../use/pointerSensor'
import SmallSchemesContainerView from './SmallSchemesContainer'
import SortableSchemeView from './SortableScheme'
import TinySchemesView from './TinySchemes'

export default function ReserveStartView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const { reserve, setReserve } = useContext(playContext)
  const sensors = usePointerSensor()
  const [active, setActive] = useState<Active | null>(null)
  const activeScheme = useMemo(
    () => reserve?.find((scheme) => scheme.id === active?.id),
    [active, reserve]
  )
  const sortableActiveItem = (activeScheme != null) && <SortableSchemeView active id={activeScheme.id} rank={activeScheme.rank} />
  if (reserve == null || reserve.length <= 1) {
    return <></>
  }
  console.log('reserve', reserve)
  const start = reserve.slice(0, reserve.length - 1)
  console.log('start', start)
  const choice = gameState.choices?.find(choice => choice.playerId === playerState.id)
  if (gameState.phase === 'play' || choice?.type !== 'reserve') {
    return <TinySchemesView schemes={start} firstOffset />
  }
  function handleDragEnd (event: any): void {
    setActive(null)
    const { active, over } = event
    if (active == null) {
      console.warn('No active end')
      return
    }
    if (over == null) {
      console.warn('No over end')
      return
    }
    if (active.id !== over.id) {
      setReserve?.((currentItems) => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id)
        const newIndex = currentItems.findIndex(scheme => scheme.id === over.id)
        const newReserve = arrayMove(currentItems, oldIndex, newIndex)
        return newReserve
      })
    }
  }
  const [first, ...rest] = start
  const firstSortable = (
    <SortableSchemeView
      id={first.id}
      mr='4px'
      rank={first.rank}
    />
  )
  const restSortables = rest.map((scheme, index) => {
    return (
      <SortableSchemeView
        key={scheme.id}
        id={scheme.id}
        rank={scheme.rank}
      />
    )
  })
  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => {
          setActive(active)
        }}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActive(null)
        }}
      >
        <SortableContext items={reserve}>
          <SmallSchemesContainerView length={reserve.length}>
            {firstSortable}
            {restSortables}
          </SmallSchemesContainerView>
        </SortableContext>
        <DragOverlay dropAnimation={DROP_ANIMATION}>
          {sortableActiveItem}
        </DragOverlay>
      </DndContext>
    </>
  )
}
