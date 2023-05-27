import { ChoiceType, Scheme, Choice, Player, Result } from '../types'
import createId from './id'

export default function createChoice ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  type,
  threat
}: {
  copiedByFirstEffect: boolean
  effectScheme: Scheme
  effectPlayer: Result<Player>
  type: ChoiceType
  threat?: Scheme | undefined
}): Choice {
  const first = copiedByFirstEffect ? { first: effectScheme } : {}
  const threatProps = threat != null ? { threat } : {}
  const choice: Choice = {
    id: createId(),
    playerId: effectPlayer.id,
    type,
    ...first,
    ...threatProps
  }
  return choice
}
