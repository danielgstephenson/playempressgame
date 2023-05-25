import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addHighestPlayTimeEvents from '../add/events/scheme/play/time/highest'
import draw from '../draw'
import getLowestRankScheme from '../get/lowestRankScheme'
import revive from '../revive'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsSix ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, you revive the highest time in play.')
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} revives the highest time in play.`)
  const highest = addHighestPlayTimeEvents({
    playState,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren,
    playerId: effectPlayer.id
  })
  revive({
    depth: highest.time,
    playState,
    player: effectPlayer,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren
  })
  const secondPrivateChild = addEvent(privateEvent, 'Second, you draw the lowest rank in the dungeon.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws the lowest rank in the dungeon.`)
  const lowestDungeon = getLowestRankScheme(playState.game.dungeon)
  if (playState.game.dungeon.length === 0) {
    addEventsEverywhere({
      publicEvents: secondPublicChildren,
      privateEvent: secondPrivateChild,
      message: 'The dungeon is empty.'
    })
  } else {
    const lowestRank = String(lowestDungeon?.rank)
    addEventsEverywhere({
      publicEvents: secondPublicChildren,
      privateEvent: secondPrivateChild,
      message: `The lowest rank in the dungeon is ${lowestRank}.`
    })
  }
  draw({
    depth: lowestDungeon?.rank ?? 0,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  return playState
}
