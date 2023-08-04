import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import createPrivilege from '../create/privilege'
import earn from '../earn'
import guardFirst from '../guard/first'
import joinRanksGrammar from '../join/ranks/grammar'
import summon from '../summon'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsNineteen ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, if your deck or discard is empty, you earn 35 gold.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, if ${effectPlayer.displayName}'s deck or discard is empty, they earn 35 gold.`)
  const deckEmpty = effectPlayer.deck.length === 0
  if (deckEmpty) {
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s deck is empty.`)
    addEvent(firstPrivateChild, 'Your deck is empty.')
  } else {
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s deck is not empty.`)
    const { joinedCount } = joinRanksGrammar(effectPlayer.deck)
    addEvent(firstPrivateChild, `Your deck has ${joinedCount}.`)
  }
  const discardEmpty = effectPlayer.discard.length === 0
  if (discardEmpty) {
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s discard is empty.`)
    addEvent(firstPrivateChild, 'Your discard is empty.')
  } else {
    addPublicEvent(firstPublicChildren, `${effectPlayer.displayName}'s discard is not empty.`)
    const { joinedCount } = joinRanksGrammar(effectPlayer.discard)
    addEvent(firstPrivateChild, `Your discard has ${joinedCount}.`)
  }
  if (deckEmpty || discardEmpty) {
    earn({
      amount: 35,
      player: effectPlayer,
      playState,
      privateEvent: firstPrivateChild,
      publicEvents: firstPublicChildren
    })
  }
  addEvent(privateEvent, 'Second, one Privilege is summoned to the court')
  addPublicEvent(publicEvents, 'Second, one Privilege is summoned to the court')
  const privilege = guardFirst(createPrivilege(1), 'Privilege')
  summon({ court: playState.game.court, scheme: privilege })
  return playState
}
