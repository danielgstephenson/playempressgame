import { GameReader } from '../reader/game'
import GameContentView from './GameContent'
import GameHeading from './GameHeading'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <GameReader gameId={gameId} DocView={GameContentView}>
      <GameHeading />
    </GameReader>
  )
}
