import { GameReader } from '../reader/game'
import GameContentView from './GameContent'
import PlayProvider from '../context/play/Provider'
import GameHeading from './GameHeading'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <PlayProvider>
      <GameReader gameId={gameId} DocView={GameContentView}>
        <GameHeading />
      </GameReader>
    </PlayProvider>
  )
}
