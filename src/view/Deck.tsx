import { Heading } from '@chakra-ui/react'
import { useSensor, PointerSensor, useSensors, closestCenter, DndContext } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import Cloud from './Cloud'
import SchemesContainerView from './SchemesContainer'
import SortableScheme from './SortableScheme'

export default function DeckView (): JSX.Element {
  const gameState = useContext(gameContext)
  const { deck, setDeck } = useContext(playContext)
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })
  const sensors = useSensors(pointerSensor)
  if (deck == null) {
    return <></>
  }
  const schemeIds = deck.map(scheme => scheme.id)
  function handleDragEnd (event: any): void {
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
      <SortableScheme
        key={scheme.id}
        id={scheme.id}
        rank={scheme.rank}
        index={index}
      />
    )
  })
  return (
    <>
      <Heading size='sm'>Deck</Heading>
      <DndContext
        autoScroll={false}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={deck} strategy={rectSortingStrategy}>
          <SchemesContainerView>
            {sortableSchemes}
          </SchemesContainerView>
        </SortableContext>
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
