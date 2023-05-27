import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import createChoice from '../create/choice'
import draw from '../draw'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsOne ({
  copiedByFirstEffect,
  playState,
  effectPlayer,
  effectScheme,
  privateEvent,
  publicEvents,
  resume,
  threat
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, you draw 2 cards.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} draws 2 cards.`)
  draw({
    depth: 2,
    playState,
    player: effectPlayer,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  addEvent(privateEvent, 'Second, you choose a scheme from your hand to trash.')
  addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} chooses a scheme from their hand to trash.`)
  const trashChoice = createChoice({
    copiedByFirstEffect,
    effectPlayer,
    effectScheme,
    type: 'trash',
    threat
  })
  playState.game.choices.push(trashChoice)
  return playState
}
