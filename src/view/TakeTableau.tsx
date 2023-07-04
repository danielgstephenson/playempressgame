import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useContext } from 'react'
import playContext from '../context/play'
import EmptySmallSchemeView from './EmptySmallScheme'
import SmallSchemesContainerView from './SmallSchemesContainer'
import SortableSchemeView from './SortableScheme'

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
  const schemeViews = playState.tableau.map((task) => (
    <SortableSchemeView
      key={task.id}
      id={task.id}
      rank={task.rank}
    />
  ))
  return (
    <SortableContext
      id='takeTableau'
      items={playState.tableau}
    >
      <SmallSchemesContainerView length={playState.tableau.length}>
        {schemeViews}
      </SmallSchemesContainerView>
    </SortableContext>
  )
};
