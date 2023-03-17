import { Heading } from '@chakra-ui/react'
import { GameReader } from '../reader/game'
import GameContentView from './GameContent'
import GameWriters from './GameWriters'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <GameReader gameId={gameId} DocView={GameContentView}>
      <Heading>
        Game {gameId} <GameWriters />
      </Heading>
    </GameReader>
  )
}
