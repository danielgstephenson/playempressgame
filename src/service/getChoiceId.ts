import { Choice } from '../types'

export default function getChoiceId ({
  choices,
  gameId,
  userId
}: {
  choices: Choice[]
  gameId: string
  userId: string
}): string | undefined {
  const playerId = `${userId}_${gameId}`
  const userChoices = choices.filter(choice => choice.playerId === playerId)
  const userChoice = userChoices[0]
  return userChoice?.id
}