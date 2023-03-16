import { GameReader } from '../reader/game'
import GameHeading from './GameHeading'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <GameReader gameId={gameId}>
      <GameHeading gameId={gameId} />
    </GameReader>
  )
}
