import { useDroppable } from '@dnd-kit/core'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import EmptySmallSchemeView from './EmptySmallScheme'
import SmallSchemesContainerView from './SmallSchemesContainer'
import getInPlayStyles from '../service/getInPlayStyles'
import authContext from '../context/auth'
import DraggableSchemeView from './DraggableScheme'

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
      <DraggableSchemeView
        {...styles}
        key={scheme.id}
        id={scheme.id}
        rank={scheme.rank}
      />
    )
  })
  return (
    <SmallSchemesContainerView length={playState.tableau.length} overflow='auto' ref={setNodeRef}>
      {schemeViews}
    </SmallSchemesContainerView>
  )
};
