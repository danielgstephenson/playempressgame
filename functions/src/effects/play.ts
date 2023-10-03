import addPlayerEvent from '../add/event/player'
import addPublicEvents from '../add/events/public'
import guardDefined from '../guard/defined'
import { PlayState } from '../types'
import applyEffects from './apply'

export default function playEffects ({
  playState,
  playingId,
  resume
}: {
  playState: PlayState
  playingId: string
  resume: boolean
}): void {
  const foundPlayer = playState.players.find(player => player.id === playingId)
  const effectPlayer = guardDefined(foundPlayer, 'Effect player')
  const effectScheme = guardDefined(effectPlayer.playScheme, 'Play scheme')
  const publicEvents = addPublicEvents({
    effectPlayer,
    message: `${effectPlayer.displayName} plays ${effectScheme.rank}.`,
    playState
  })
  const privateEvent = addPlayerEvent({
    container: effectPlayer,
    message: `You play ${effectScheme.rank}.`,
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  effectPlayer.inPlay.push(effectScheme)
  applyEffects({
    copiedByFirstEffect: false,
    effectPlayer,
    effectScheme,
    playState,
    privateEvent,
    publicEvents,
    resume
  })
}
