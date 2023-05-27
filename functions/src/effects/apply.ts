import guardEffect from '../guard/effect'
import { SchemeEffectProps } from '../types'

export default function applyEffects ({
  copiedByFirstEffect,
  effectScheme,
  effectPlayer,
  playState,
  privateEvent,
  publicEvents,
  resume,
  threat
}: SchemeEffectProps): void {
  const rankEffects = guardEffect(effectScheme.rank)
  rankEffects({
    copiedByFirstEffect,
    effectPlayer,
    effectScheme,
    playState,
    privateEvent,
    publicEvents,
    resume,
    threat
  })
}
