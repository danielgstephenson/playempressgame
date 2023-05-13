import addPublicEvents from '../../add/publicEvents'
import { PlayState, EffectsStateProps } from '../../types'
import draw from '../draw'
import createChoice from '../../create/choice'
import addPlayerEvent from '../../add/playerEvent'
import addPublicEvent from '../../add/publicEvent'

export default function effectsOneState ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} draws 2 cards.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, you draw 2 cards.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  draw({
    depth: 2,
    playState,
    player: effectPlayer,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} chooses a scheme from their hand to trash.`)
  addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you choose a scheme to trash from your hand.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const trashChoice = createChoice({
    copiedByFirstEffect,
    effectPlayer,
    effectScheme,
    type: 'trash'
  })
  playState.game.choices.push(trashChoice)
  return playState
}
