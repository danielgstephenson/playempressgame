import { Choice } from '../types'

export default function isReordering ({
  choices,
  phase,
  playerId
}: {
  choices?: Choice[]
  phase?: string
  playerId?: string
}): boolean {
  const choice = choices?.some(choice => choice.playerId === playerId && choice.type === 'deck')
  return phase === 'auction' && choice === true
}
