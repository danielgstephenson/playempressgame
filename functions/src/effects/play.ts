import addPlayerEvent from '../add/event/player'
import addPublicEvents from '../add/events/public'
import guardDefined from '../guard/defined'
import joinRanksGrammar from '../join/ranks/grammar'
import { PlayState } from '../types'
import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
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
  const tableauBefore = joinRanksGrammar(effectPlayer.tableau)
  const beforePrivateMessage = `Your tableau was ${tableauBefore.joinedRanks}.`
  addEvent(privateEvent, beforePrivateMessage)
  const beforePublicMessage = `${effectPlayer.displayName}'s tableau was ${tableauBefore.joinedRanks}.`
  addPublicEvent(publicEvents, beforePublicMessage)
  effectPlayer.tableau.push(effectScheme)
  const tableauAfter = joinRanksGrammar(effectPlayer.tableau)
  const afterPrivateMessage = `Your tableau becomes ${tableauAfter.joinedRanks}.`
  addEvent(privateEvent, afterPrivateMessage)
  const afterPublicMessage = `${effectPlayer.displayName}'s tableau becomes ${tableauAfter.joinedRanks}.`
  addPublicEvent(publicEvents, afterPublicMessage)
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
