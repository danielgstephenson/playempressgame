import Cloud from './Cloud'
import { gameContext } from '../reader/game'
import { useContext } from 'react'
import Curtain from './Curtain'
import { playerContext } from '../reader/player'
import playContext from '../context/play'

export default function PlayReadyView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const playState = useContext(playContext)
  const showReady = gameState.phase === 'play' &&
    playState.trashSchemeId != null &&
    playState.playSchemeId != null &&
    playerState.playReady !== true &&
    playState.overPlay !== true &&
    playState.overTrash !== true
  const props = {
    gameId: gameState.id,
    trashSchemeId: playState.trashSchemeId,
    playSchemeId: playState.playSchemeId
  }
  return (
    <Curtain open={showReady}>
      <Cloud
        fn='playReady'
        props={props}
      >
        Ready
      </Cloud>
    </Curtain>
  )
}
