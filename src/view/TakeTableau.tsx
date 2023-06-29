import { Box, Heading } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useContext } from 'react'
import playContext from '../context/play'
import EmptySmallSchemeView from './EmptySmallScheme'
import ExpandableSchemeView from './ExpandableScheme'
import SchemesContainerView from './SchemesContainer'

export default function TakeTableauView (): JSX.Element {
  const playState = useContext(playContext)
  const { setNodeRef } = useDroppable({
    id: 'takeArea'
  })
  if (playState.tableau == null) {
    return <></>
  }
  if (playState.tableau.length === 0) {
    return <EmptySmallSchemeView ref={setNodeRef}>Take</EmptySmallSchemeView>
  }
  return (
    <Box>
      <Heading size='sm'>Play</Heading>
      <SortableContext
        id='takeTableau'
        items={playState.tableau}
      >
        <SchemesContainerView>
          {playState.tableau?.map((task) => (
            <ExpandableSchemeView
              key={task.id}
              id={task.id}
              rank={task.rank}
            />
          ))}
        </SchemesContainerView>
      </SortableContext>
    </Box>
  )
};
