import Cloud from './Cloud'
import { gameContext } from '../reader/game'
import { useContext } from 'react'
import Curtain from './Curtain'
import { playerContext } from '../reader/player'
import playContext from '../context/play'

export default function ReorderReadyView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const playState = useContext(playContext)
  const choice = gameState.choices?.some(choice => choice.playerId === playerState.id && choice.type === 'deck')
  const showReady = gameState.phase === 'auction' && choice === true
  console.log('showReady', showReady)
  const schemeIds = playState.deck?.map(scheme => scheme.id)
  const props = {
    gameId: gameState.id,
    schemeIds
  }
  return (
    <Curtain open={showReady}>
      <Cloud
        fn='reorder'
        props={props}
      >
        Ready
      </Cloud>
    </Curtain>
  )
}
