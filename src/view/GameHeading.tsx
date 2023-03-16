import { Heading } from '@chakra-ui/react'
import JoinGameView from './JoinGame'
import StartGameView from './StartGame'

export default function GameHeading ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <Heading>
      Game {gameId}
      {' '}
      <JoinGameView gameId={gameId} />
      {' '}
      <StartGameView gameId={gameId} />
    </Heading>
  )
}
