import { useDroppable } from '@dnd-kit/core'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import HandSchemeView from './HandScheme'
import SmallSchemeView from './SmallScheme'

export default function TrashChoiceView (): JSX.Element {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const { setNodeRef } = useDroppable({ id: 'trashChoice' })
  const { trashChoiceId } = useContext(playContext)
  console.log('trashChoiceId', trashChoiceId)
  const trashChoice = gameState.choices?.some(choice => choice.playerId === playerState.id && choice.type === 'trash')
  if (trashChoice !== true) {
    return <></>
  }
  if (trashChoiceId == null) {
    return (
      <SmallSchemeView ref={setNodeRef} />
    )
  }
  return (
    <HandSchemeView id={trashChoiceId} />
  )
}
