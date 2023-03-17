import { Heading } from '@chakra-ui/react'
import JoinGameWriter from './writer/JoinGame'
import StartGameWriter from './writer/StartGame'

export default function GameHeading ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <Heading>
      Game {gameId}
      {' '}
      <JoinGameWriter gameId={gameId} />
      {' '}
      <StartGameWriter gameId={gameId} />
    </Heading>
  )
}
