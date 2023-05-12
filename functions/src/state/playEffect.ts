import { effects } from '../db'
import guardDefined from '../guard/defined'
import { PlayState } from '../types'

export default function playEffectState ({
  playState,
  playingId
}: {
  playState: PlayState
  playingId: string
}): PlayState {
  const foundPlayer = playState.players.find(player => player.id === playingId)
  const effectPlayer = guardDefined(foundPlayer, 'Effect player')
  const effectScheme = guardDefined(effectPlayer.playScheme, 'Play scheme')
  const rankEffects = effects[effectScheme.rank]
  const playEffects = guardDefined(rankEffects, 'Play effects')
  const effectedState = playEffects({
    copiedByFirstEffect: false,
    playState,
    effectPlayer,
    effectScheme,
    resume: false
  })
  return effectedState
}
