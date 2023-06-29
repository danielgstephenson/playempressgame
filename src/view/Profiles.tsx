import { useContext } from 'react'
import authContext from '../context/auth'
import ProfileProvider from '../context/profile/Provider'
import { gameContext } from '../reader/game'
import ProfileView from './Profile'

export default function ProfilesView (): JSX.Element {
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  if (gameState.profiles == null) {
    return <></>
  }
  const copy = [...gameState.profiles]
  copy.sort((a, b) => a.userId === authState.currentUser?.uid ? -1 : 1)
  const items = copy.map((profile) => (
    <ProfileProvider key={profile.userId} profile={profile}>
      <ProfileView key={profile.userId} />
    </ProfileProvider>
  ))
  return <>{items}</>
}
