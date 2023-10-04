import { useDroppable } from '@dnd-kit/core'
import { Fragment, useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import EmptySmallSchemeView from './EmptySmallScheme'
import SmallSchemesContainerView from './SmallSchemesContainer'
import getInPlayStyles from '../service/getInPlayStyles'
import authContext from '../context/auth'
import DraggableSchemeView from './DraggableScheme'
import { playerContext } from '../reader/player'

export default function TakeInPlayView (): JSX.Element {
  const authState = useContext(authContext)
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const { setNodeRef } = useDroppable({
    id: 'takeArea'
  })
  if (playState.inPlay == null) {
    return <></>
  }
  if (playState.inPlay.length === 0) {
    return <EmptySmallSchemeView ref={setNodeRef}>Take</EmptySmallSchemeView>
  }
  const schemeViews = playState.inPlay.map((scheme) => {
    if (
      authState.currentUser == null ||
      gameState.choices == null ||
      gameState.court == null ||
      gameState.dungeon == null ||
      gameState.id == null ||
      gameState.phase == null ||
      gameState.profiles == null ||
      playState.reserve == null ||
      playerState.bid == null ||
      gameState.choices == null
    ) {
      return <Fragment key={scheme.id} />
    }
    const styles = getInPlayStyles({
      bid: playerState.bid,
      choices: gameState.choices,
      court: gameState.court,
      reserve: playState.reserve,
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
    <SmallSchemesContainerView length={playState.inPlay.length} overflow='auto' ref={setNodeRef}>
      {schemeViews}
    </SmallSchemesContainerView>
  )
};
