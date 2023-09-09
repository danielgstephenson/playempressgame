import { useContext } from 'react'
import { gameContext } from '../reader/game'

export default function useGamePlaying (): boolean {
  const gameState = useContext(gameContext)
  if (gameState.phase == null) {
    throw new Error('Cannot use playing outside game context.')
  }
  const playing = gameState.phase !== 'join'
  return playing
}
