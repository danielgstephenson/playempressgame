import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import createChoice from '../create/choice'
import draw from '../draw'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsOne ({
  copiedByFirstEffect,
  playState,
  effectPlayer,
  effectScheme,
  resume
}: EffectsStateProps): PlayState {
  const publicEvents = addPublicEvents({
    effectPlayer,
    playState,
    message: `${effectPlayer.displayName} plays ${effectScheme.rank}.`
  })
  const privateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: `You play ${effectScheme.rank}.`,
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} draws 2 cards.`)
  const firstPrivateEvent = addEvent(privateEvent, 'First, you draw 2 cards.')
  draw({
    depth: 2,
    playState,
    player: effectPlayer,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} chooses a scheme from their hand to trash.`)
  addEvent(privateEvent, 'Second, you choose a scheme from your hand to trash.')
  const trashChoice = createChoice({
    copiedByFirstEffect,
    effectPlayer,
    effectScheme,
    type: 'trash'
  })
  playState.game.choices.push(trashChoice)
  return playState
}
