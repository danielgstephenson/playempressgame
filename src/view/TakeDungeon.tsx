import { useContext } from 'react'
import playContext from '../context/play'
import TakePalaceView from './TakePalace'

export default function TakeDungeonView (): JSX.Element {
  const playState = useContext(playContext)
  const twelve = playState.tableau?.some((scheme) => scheme.rank === 12)
  if (twelve !== true) {
    return <></>
  }
  return (
    <TakePalaceView schemes={playState.dungeon}>
      Dungeon
    </TakePalaceView>
  )
}
