import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import EmptySmallSchemeView from './EmptySmallScheme'
import SmallSchemesContainerView from './SmallSchemesContainer'
import SortableSchemeView from './SortableScheme'
import getInPlayStyles from '../service/getInPlayStyles'
import authContext from '../context/auth'

export default function TakeTableauView (): JSX.Element {
  const authState = useContext(authContext)
  const playState = useContext(playContext)
  const gameState = useContext(gameContext)
  const { setNodeRef } = useDroppable({
    id: 'takeArea'
  })
  if (playState.tableau == null || authState.currentUser == null) {
    return <></>
  }
  if (playState.tableau.length === 0) {
    return <EmptySmallSchemeView ref={setNodeRef}>Take</EmptySmallSchemeView>
  }
  const schemeViews = playState.tableau.map((scheme) => {
    const styles = getInPlayStyles({
      choices: gameState.choices,
      court: gameState.court,
      deck: playState.deck,
      dungeon: gameState.dungeon,
      gameId: gameState.id,
      phase: gameState.phase,
      profiles: gameState.profiles,
      rank: scheme.rank,
      schemeId: scheme.id,
      userId: authState.currentUser?.uid
    })
    return (
      <SortableSchemeView
        {...styles}
        key={scheme.id}
        id={scheme.id}
        rank={scheme.rank}
      />
    )
  })
  return (
    <SortableContext
      id='takeTableau'
      items={playState.tableau}
    >
      <SmallSchemesContainerView length={playState.tableau.length} overflow='auto'>
        {schemeViews}
      </SmallSchemesContainerView>
    </SortableContext>
  )
};
