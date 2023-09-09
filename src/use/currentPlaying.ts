import { useContext } from 'react'
import authContext from '../context/auth'
import { gameContext } from '../reader/game'

export default function useCurrentPlaying (): boolean {
  const gameState = useContext(gameContext)
  const authState = useContext(authContext)
  if (gameState.profiles == null) {
    throw new Error('Cannot use currently playing outside game context.')
  }
  const currentPlaying = gameState.profiles.some(profile => profile.userId === authState.currentUser?.uid)
  return currentPlaying
}
