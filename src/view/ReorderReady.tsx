import Cloud from './Cloud'
import { gameContext } from '../reader/game'
import { useContext } from 'react'
import Curtain from './Curtain'
import { playerContext } from '../reader/player'
import playContext from '../context/play'
import isReordering from '../service/isReordering'

export default function ReorderReadyView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const playState = useContext(playContext)
  const reordering = isReordering({
    choices: gameState.choices,
    phase: gameState.phase,
    playerId: playerState.id
  })
  const schemeIds = playState.reserve?.map(scheme => scheme.id)
  const props = {
    gameId: gameState.id,
    schemeIds
  }
  return (
    <Curtain open={reordering}>
      <Cloud
        fn='reorder'
        props={props}
      >
        Ready
      </Cloud>
    </Curtain>
  )
}
