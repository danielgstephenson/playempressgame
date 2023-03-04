import { useContext } from 'react'
import DocViewer from './Doc'
import gameContext from '../../context/game'
import GameContentView from '../GameContent'

export default function GameViewer (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.gameStream == null) return <></>
  return <DocViewer stream={gameState.gameStream} View={GameContentView} />
}
