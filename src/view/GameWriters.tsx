import { useContext } from 'react'
import { gameContext } from '../reader/game'
import JoinGameWriter from './writer/JoinGame'
import StartGameWriter from './writer/StartGame'

export default function GameWriters (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.id == null) return <></>
  return (
    <>
      <JoinGameWriter gameId={gameState.id} />
      {' '}
      <StartGameWriter gameId={gameState.id} />
    </>
  )
}
