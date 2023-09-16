import { GameReader } from '../reader/game'
import GameContentView from './GameContent'
import PlayProvider from '../context/play/Provider'
import GameHeading from './GameHeading'
import HeaderView from './Header'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <PlayProvider>
      <GameReader gameId={gameId} DocView={GameContentView}>
        <HeaderView />
        <GameHeading />
      </GameReader>
    </PlayProvider>
  )
}
