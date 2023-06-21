import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import Cloud from './Cloud'
import CourtView from './Court'
import DungeonView from './Dungeon'

export default function PalaceView (): JSX.Element {
  const playState = useContext(playContext)
  const gameState = useContext(gameContext)
  return (
    <>
      <CourtView />
      <Cloud
        fn='court'
        props={{ gameId: gameState.id, schemeIds: playState.taken }}
      >
        Ready
      </Cloud>
      <DungeonView />
    </>
  )
}
