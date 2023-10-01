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
import TinySchemeCenterView from './TinySchemeCenter'
import TinySchemesView from './TinySchemes'

export default function DeckView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const { deck, setDeck } = useContext(playContext)
  const sensors = usePointerSensor()
  const [active, setActive] = useState<Active | null>(null)
  const activeScheme = useMemo(
    () => deck?.find((scheme) => scheme.id === active?.id),
    [active, deck]
  )
  const sortableActiveItem = (activeScheme != null) && <SortableSchemeView active id={activeScheme.id} rank={activeScheme.rank} />
  if (deck == null) {
    return <></>
  }
  if (deck.length === 0) {
    return <TinySchemeCenterView />
  }
  const choice = gameState.choices?.find(choice => choice.playerId === playerState.id)
  if (gameState.phase === 'play' || choice?.type !== 'deck') {
    return <TinySchemesView schemes={deck} firstOffset />
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
      setDeck?.((currentItems) => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id)
        const newIndex = currentItems.findIndex(scheme => scheme.id === over.id)
        const newDeck = arrayMove(currentItems, oldIndex, newIndex)
        return newDeck
      })
    }
  }
  const [first, ...rest] = deck
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
        <SortableContext items={deck}>
          <SmallSchemesContainerView length={deck.length}>
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
