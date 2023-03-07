import { Heading } from '@chakra-ui/react'
import { GameStreamer } from '../context/firestream/game'
import JoinGameView from './JoinGame'
import StartGameView from './StartGame'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <GameStreamer gameId={gameId}>
      <Heading>
        Game {gameId}
        {' '}
        <JoinGameView gameId={gameId} />
        {' '}
        <StartGameView gameId={gameId} />
      </Heading>
    </GameStreamer>
  )
}
