import { useContext } from 'react'
import ProfileProvider from '../context/profile/Provider'
import { gameContext } from '../reader/game'
import ProfileView from './Profile'

export default function ProfilesView (): JSX.Element {
  const gameState = useContext(gameContext)
  const items = gameState.profiles?.map((profile) => (
    <ProfileProvider key={profile.userId} profile={profile}>
      <ProfileView key={profile.userId} />
    </ProfileProvider>
  ))
  return <>{items}</>
}
