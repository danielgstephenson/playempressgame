import PlayerReader from '../reader/player'
import { useContext } from 'react'
import PlayerView from './Player'
import authContext from '../context/auth'
import profileContext from '../context/profile'
import ProfileProvider from '../context/profile/Provider'
import ProfileView from './Profile'
import { gameContext } from '../reader/game'

export default function PlayerProfileView (): JSX.Element {
  const profileState = useContext(profileContext)
  const authState = useContext(authContext)
  const gameState = useContext(gameContext)
  if (
    profileState.gold == null ||
    profileState.silver == null ||
    profileState.displayName == null ||
    profileState.bid == null
  ) {
    return <></>
  }
  const playing = gameState.phase !== 'join'
  const currentPlayer = authState.currentUser?.uid === profileState.userId
  if (currentPlayer) {
    if (playing) {
      return <PlayerReader DocView={PlayerView} />
    }
    return <ProfileProvider profile={profileState}><ProfileView /></ProfileProvider>
  }
  if (!playing) {
    return <ProfileProvider profile={profileState}><ProfileView /></ProfileProvider>
  }
  return <></>
}
