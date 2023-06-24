import CourtView from './Court'
import DungeonView from './Dungeon'

export default function PalaceView (): JSX.Element {
  return (
    <>
      <DungeonView />
      <CourtView />
    </>
  )
}
