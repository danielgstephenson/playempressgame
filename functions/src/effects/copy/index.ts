import clone from '../../clone'
import filterIds from '../../filterIds'
import { Choice, SchemeEffectProps } from '../../types'
import applyEffects from '../apply'

export default function copyEffects ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume,
  threat
}: SchemeEffectProps): Choice[] {
  const choicesClone = clone(playState.game.choices)
  applyEffects({
    copiedByFirstEffect,
    effectPlayer,
    effectScheme,
    playState,
    privateEvent,
    publicEvents,
    resume,
    threat
  })
  const effectChoices = filterIds(playState.game.choices, choicesClone)
  return effectChoices
}
