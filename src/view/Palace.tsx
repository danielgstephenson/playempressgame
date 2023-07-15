import StaticCourtView from './StaticCourt'
import StaticDungeonView from './StaticDungeon'

export default function PalaceView (): JSX.Element {
  return (
    <>
      <StaticDungeonView />
      <StaticCourtView />
    </>
  )
}
