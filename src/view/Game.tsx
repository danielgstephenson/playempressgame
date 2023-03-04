import { Heading } from '@chakra-ui/react'
import GameProvider from '../context/game/Provider'
import JoinGameView from './JoinGame'
import StartGameView from './StartGame'
import GameViewer from './viewer/Game'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <GameProvider gameId={gameId}>
      <Heading>
        Game {gameId}
        {' '}
        <JoinGameView gameId={gameId} />
        {' '}
        <StartGameView gameId={gameId} />
      </Heading>
      <GameViewer />
    </GameProvider>
  )
}
