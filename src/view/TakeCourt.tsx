import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import TakePalaceView from './TakePalace'

export default function TakeCourtView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  if (gameState.court == null || playState.court == null) {
    return <></>
  }
  const emptied = gameState.court.length !== 0 && playState.court.length === 0
  return (
    <TakePalaceView id='court' schemes={playState.court} over={playState.overCourt} emptied={emptied}>
      Court
    </TakePalaceView>
  )
}
