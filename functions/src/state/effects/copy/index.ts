import clone from '../../../clone'
import { effects } from '../../../db'
import filterIds from '../../../filterIds'
import guardDefined from '../../../guard/defined'
import { Choice, PlayState, Player, Result, Scheme } from '../../../types'

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
  const rankEffects = effects[effectScheme.rank]
  const playEffects = guardDefined(rankEffects, 'Copy effects')
  const choicesClone = clone(playState.game.choices)
  const effectedState = playEffects({
    copiedByFirstEffect: first,
    playState,
    effectPlayer,
    effectScheme,
    resume
  })
  const effectChoices = filterIds(effectedState.game.choices, choicesClone)
  return effectChoices
}
