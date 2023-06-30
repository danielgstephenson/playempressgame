import { Heading } from '@chakra-ui/react'
import { GameReader } from '../reader/game'
import GameContentView from './GameContent'
import GameActions from './GameActions'
import PlayProvider from '../context/play/Provider'

export default function GameView ({ gameId }: { gameId: string }): JSX.Element {
  return (
    <PlayProvider>
      <GameReader gameId={gameId} DocView={GameContentView}>
        <Heading size='md' textAlign='center'>
          Game {gameId} <GameActions />
        </Heading>
      </GameReader>
    </PlayProvider>
  )
}
