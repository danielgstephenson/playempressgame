import { useContext } from 'react'
import { gameContext } from '../reader/game'
import PalaceAreaView from './PalaceArea'

export default function CourtView (): JSX.Element {
  const gameState = useContext(gameContext)
  return (
    <PalaceAreaView schemes={gameState.court}>
      Court:
    </PalaceAreaView>
  )
}
