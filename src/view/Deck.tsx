import { memo, useContext } from 'react'
import { Card, CardBody, Heading, HStack, Text } from '@chakra-ui/react'
import playContext from '../context/play'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Scheme } from '../types'
import Cloud from './Cloud'
import { gameContext } from '../reader/game'

const DeckList = memo(({ schemes }: { schemes: Scheme[] }) => {
  const items = schemes.map((scheme, index) => (
    <Draggable key={scheme.id} draggableId={scheme.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <CardBody>
            <Text>
              {scheme.rank}
            </Text>
          </CardBody>
        </Card>
      )}
    </Draggable>
  ))
  return (
    <>{items}</>
  )
})

export default function DeckView (): JSX.Element {
  const gameState = useContext(gameContext)
  const { deck, reorder } = useContext(playContext)
  if (deck == null) {
    return <Text>Empty</Text>
  }

  function onDragEnd (result: DropResult): void {
    console.log('onDragEnd', result)
    if (deck == null) {
      return
    }

    if (result.destination == null) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const copy = Array.from(deck)
    const [removed] = copy.splice(result.source.index, 1)
    copy.splice(result.destination.index, 0, removed)

    reorder?.(copy)
  }

  const schemeIds = deck.map(scheme => scheme.id)

  return (
    <>
      <Heading size='sm'>Deck</Heading>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='list' direction='horizontal'>
          {(provided) => (
            <HStack ref={provided.innerRef} {...provided.droppableProps}>
              <DeckList schemes={deck} />
              {provided.placeholder}
            </HStack>
          )}
        </Droppable>
      </DragDropContext>
      <Cloud
        fn='reorder'
        props={{ schemeIds, gameId: gameState.id }}
      >
        Reorder
      </Cloud>
    </>
  )
}
