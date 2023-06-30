import { useDroppable } from '@dnd-kit/core'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import HandSchemeView from './HandScheme'
import SmallSchemeView from './SmallScheme'

export default function DeckChoiceView (): JSX.Element {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const { setNodeRef } = useDroppable({ id: 'deckChoice' })
  const { deckChoiceId } = useContext(playContext)
  const choice = gameState.choices?.some(choice => choice.playerId === playerState.id && choice.type === 'deck')
  if (gameState.phase !== 'play' || choice !== true) {
    return <></>
  }
  if (deckChoiceId == null) {
    return (
      <SmallSchemeView ref={setNodeRef} />
    )
  }
  return (
    <HandSchemeView id={deckChoiceId} />
  )
}
