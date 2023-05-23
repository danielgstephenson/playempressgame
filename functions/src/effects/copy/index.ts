import clone from '../../clone'
import filterIds from '../../filterIds'
import guardEffect from '../../guard/effect'
import { Choice, PlayState, Player, Result, Scheme } from '../../types'

export default function copyEffects ({
  effectPlayer,
  effectScheme,
  first,
  playState,
  resume
}: {
  effectPlayer: Result<Player>
  effectScheme: Scheme
  first: boolean
  playState: PlayState
  resume: boolean
}): Choice[] {
  const rankEffects = guardEffect(effectScheme.rank)
  const choicesClone = clone(playState.game.choices)
  const effectedState = rankEffects({
    copiedByFirstEffect: first,
    playState,
    effectPlayer,
    effectScheme,
    resume
  })
  const effectChoices = filterIds(effectedState.game.choices, choicesClone)
  return effectChoices
}
