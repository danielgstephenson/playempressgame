import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import createPrivilege from '../create/privilege'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsZero ({
  copiedByFirstEffect,
  playState,
  effectPlayer,
  effectScheme,
  resume
}: EffectsStateProps): PlayState {
  const publicEvents = addPublicEvents({
    effectPlayer,
    message: `${effectPlayer.displayName} plays ${effectScheme.rank}.`,
    playState
  })
  const privateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: `You play ${effectScheme.rank}.`,
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} takes 8 Privilege into their hand.`)
  addEvent(privateEvent, 'First, you take 8 Privilege into your hand.')
  effectPlayer.hand.push(...createPrivilege(8))
  addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} puts 2 Privilege on their deck.`)
  addEvent(privateEvent, 'Second, you put 2 Privilege on your deck.')
  effectPlayer.deck.push(...createPrivilege(2))
  return playState
}
