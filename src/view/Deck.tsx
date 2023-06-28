import { DndContext, Active, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useContext, useMemo, useState } from 'react'
import { DROP_ANIMATION } from '../constants'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import usePointerSensor from '../use/pointerSensor'
import Cloud from './Cloud'
import SchemesContainerView from './SchemesContainer'
import SortableSchemeView from './SortableScheme'
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
  const schemeIds = deck.map(scheme => scheme.id)
  const choice = gameState.choices?.find(choice => choice.playerId === playerState.id)
  if (choice?.type !== 'deck') {
    return <TinySchemesView schemes={deck} />
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
  const sortableSchemes = deck.map((scheme, index) => {
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
          <SchemesContainerView>
            {sortableSchemes}
          </SchemesContainerView>
        </SortableContext>
        <DragOverlay dropAnimation={DROP_ANIMATION}>
          {sortableActiveItem}
        </DragOverlay>
      </DndContext>
      <Cloud
        fn='reorder'
        props={{ gameId: gameState.id, schemeIds }}
      >
        Ready
      </Cloud>
    </>
  )
}
