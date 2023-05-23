import { effects } from '../../db'
import guardDefined from '../../guard/defined'
import { PlayState } from '../../types'

export default function playEffects ({
  playState,
  playingId,
  resume
}: {
  playState: PlayState
  playingId: string
  resume: boolean
}): PlayState {
  const foundPlayer = playState.players.find(player => player.id === playingId)
  const effectPlayer = guardDefined(foundPlayer, 'Effect player')
  const effectScheme = guardDefined(effectPlayer.playScheme, 'Play scheme')
  const rankEffects = effects[effectScheme.rank]
  const defined = guardDefined(rankEffects, 'Play effects')
  const effectedState = defined({
    copiedByFirstEffect: false,
    playState,
    effectPlayer,
    effectScheme,
    resume
  })
  return effectedState
}
