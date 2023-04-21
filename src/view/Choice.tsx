import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'

export default function ChoiceView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const choice = gameState.choices?.find(choice => choice.playerId === playerState.id)
  if (choice == null) {
    return <></>
  }
  return (
    <>
      Choice
    </>
  )
}
