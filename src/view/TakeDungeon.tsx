import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import TakePalaceView from './TakePalace'

export default function TakeDungeonView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const twelve = playState.tableau?.some((scheme) => scheme.rank === 12)
  if (twelve !== true) {
    return <></>
  }
  if (gameState.dungeon == null || playState.dungeon == null) {
    return <></>
  }
  const emptied = gameState.dungeon.length !== 0 && playState.dungeon.length === 0
  return (
    <TakePalaceView id='dungeon' schemes={playState.dungeon} emptied={emptied} over={playState.overDungeon}>
      Dungeon
    </TakePalaceView>
  )
}
