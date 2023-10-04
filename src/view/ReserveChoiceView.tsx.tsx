import { useDroppable } from '@dnd-kit/core'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import HandSchemeView from './HandScheme'
import SmallSchemeView from './SmallScheme'

export default function ReserveChoiceView (): JSX.Element {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const { setNodeRef } = useDroppable({ id: 'reserveChoice' })
  const { reserveChoiceId } = useContext(playContext)
  const choice = gameState.choices?.some(choice => choice.playerId === playerState.id && choice.type === 'reserve')
  if (gameState.phase !== 'play' || choice !== true) {
    return <></>
  }
  if (reserveChoiceId == null) {
    return (
      <SmallSchemeView ref={setNodeRef} />
    )
  }
  return (
    <HandSchemeView id={reserveChoiceId} />
  )
}
