import { Game } from '../types'
import ProfilesView from './Profiles'

export default function GameContentView (game: Game): JSX.Element {
  return (
    <>
      {game.phase}
      <ProfilesView gameId={game.id} />
    </>
  )
}
