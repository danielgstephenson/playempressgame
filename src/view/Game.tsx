import { Heading } from '@chakra-ui/react'
import { GameReader } from '../reader/game'
import JoinGameView from './JoinGame'
import StartGameView from './StartGame'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <GameReader gameId={gameId}>
      <Heading>
        Game {gameId}
        {' '}
        <JoinGameView gameId={gameId} />
        {' '}
        <StartGameView gameId={gameId} />
      </Heading>
    </GameReader>
  )
}
