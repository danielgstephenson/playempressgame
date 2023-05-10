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
  const playEffect = effects[effectScheme.rank]
  const effect = guardDefined(playEffect, 'Play effect')
  const effectedState = effect({
    copiedByFirstEffect: false,
    playState,
    effectPlayer,
    effectScheme,
    resume: false
  })
  return effectedState
}
