import { Heading } from '@chakra-ui/react'
import { GameReader } from '../reader/game'
import GameContentView from './GameContent'
import JoinGameView from './JoinGame'
import StartGameView from './StartGame'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <GameReader gameId={gameId} DocView={GameContentView}>
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
