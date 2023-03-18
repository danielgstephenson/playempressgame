import { Heading } from '@chakra-ui/react'
import { GameReader } from '../reader/game'
import GameContentView from './GameContent'
import GameActions from './GameActions'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <GameReader gameId={gameId} DocView={GameContentView}>
      <Heading>
        Game {gameId} <GameActions />
      </Heading>
    </GameReader>
  )
}
