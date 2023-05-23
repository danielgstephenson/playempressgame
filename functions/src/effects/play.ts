import guardDefined from '../guard/defined'
import guardEffect from '../guard/effect'
import { PlayState } from '../types'

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
  const rankEffects = guardEffect(effectScheme.rank)
  const effectedState = rankEffects({
    copiedByFirstEffect: false,
    playState,
    effectPlayer,
    effectScheme,
    resume
  })
  return effectedState
}
