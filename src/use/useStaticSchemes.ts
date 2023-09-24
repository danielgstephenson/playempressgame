import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { Scheme, StaticSchemesKeys } from '../types'

export default function useStaticSchemes ({
  property
}: {
  property: StaticSchemesKeys
}): Scheme[] | undefined {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const playSchemes = playState[property]
  if (playSchemes != null && playSchemes.length > 0) {
    return playSchemes
  }
  const gameSchemes = gameState[property]
  return gameSchemes
}
