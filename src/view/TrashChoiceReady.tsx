import Cloud from './Cloud'
import { gameContext } from '../reader/game'
import { useContext } from 'react'
import Curtain from './Curtain'
import { playerContext } from '../reader/player'
import playContext from '../context/play'

export default function TrashChoiceReadyView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const playState = useContext(playContext)
  const trashChoice = gameState.choices?.some(choice => choice.playerId === playerState.id && choice.type === 'trash')
  const showReady = trashChoice === true &&
    playState.trashChoiceId != null &&
    playState.overTrash !== true
  const props = {
    gameId: gameState.id,
    schemeId: playState.trashChoiceId
  }
  return (
    <Curtain open={showReady}>
      <Cloud
        fn='trashChoose'
        props={props}
      >
        Ready
      </Cloud>
    </Curtain>
  )
}
