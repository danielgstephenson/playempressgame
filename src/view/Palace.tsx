import StaticCourtView from './StaticCourt'
import StaticDungeonView from './Dungeon'

export default function PalaceView (): JSX.Element {
  return (
    <>
      <StaticDungeonView />
      <StaticCourtView />
    </>
  )
}
