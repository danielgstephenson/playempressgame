import Cloud from './Cloud'
import { gameContext } from '../reader/game'
import { useContext } from 'react'
import Curtain from './Curtain'
import { playerContext } from '../reader/player'
import playContext from '../context/play'

export default function ReserveChoiceReadyView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const playState = useContext(playContext)
  const choice = gameState.choices?.some(choice => choice.playerId === playerState.id && choice.type === 'reserve')
  const showReady = gameState.phase === 'play' &&
    choice === true &&
    playState.reserveChoiceId != null &&
    playState.overTrash !== true
  const props = {
    gameId: gameState.id,
    schemeId: playState.reserveChoiceId
  }
  return (
    <Curtain open={showReady}>
      <Cloud fn='reserveChoose' props={props}>
        Ready
      </Cloud>
    </Curtain>
  )
}
