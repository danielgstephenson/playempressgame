import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext, GameReader } from '../reader/game'
import GameContentView from './GameContent'
import GameWriters from './GameWriters'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  const gameState = useContext(gameContext)
  return (
    <GameReader gameId={gameId} DocView={GameContentView}>
      <Heading>
        Game {gameState.id}
        {' '}
        <GameWriters />
      </Heading>
    </GameReader>
  )
}
