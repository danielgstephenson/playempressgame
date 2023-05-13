import { ChoiceType, Scheme, Choice, Player, Result } from '../types'
import createId from './id'

export default function createChoice ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  type
}: {
  copiedByFirstEffect: boolean
  effectScheme: Scheme
  effectPlayer: Result<Player>
  type: ChoiceType
}): Choice {
  const first = copiedByFirstEffect ? { first: effectScheme } : {}
  const choice = {
    id: createId(),
    playerId: effectPlayer.id,
    type,
    ...first
  }
  return choice
}
