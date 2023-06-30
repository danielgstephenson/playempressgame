import Cloud from './Cloud'
import { gameContext } from '../reader/game'
import { useContext } from 'react'
import Curtain from './Curtain'
import { playerContext } from '../reader/player'
import playContext from '../context/play'

export default function DeckChoiceReadyView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const playState = useContext(playContext)
  const choice = gameState.choices?.some(choice => choice.playerId === playerState.id && choice.type === 'deck')
  const showReady = choice === true &&
    playState.deckChoiceId != null &&
    playState.overTrash !== true
  const props = {
    gameId: gameState.id,
    schemeId: playState.deckChoiceId
  }
  return (
    <Curtain open={showReady}>
      <Cloud
        fn='deckChoose'
        props={props}
      >
        Ready
      </Cloud>
    </Curtain>
  )
}
