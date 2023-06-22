import addEvent from '../add/event'
import addPublicEvent from '../add/event/public'
import addPlayerPublicEvents from '../add/events/player/public'
import addLowestPlayTimeEvents from '../add/events/scheme/play/time/lowest'
import draw from '../draw'
import getGrammar from '../get/grammar'
import join from '../join'
import revive from '../revive'
import { PlayState, SchemeEffectProps } from '../types'

export default function effectsTwo ({
  copiedByFirstEffect,
  effectPlayer,
  effectScheme,
  playState,
  privateEvent,
  publicEvents,
  resume
}: SchemeEffectProps): PlayState {
  const firstPrivateChild = addEvent(privateEvent, 'First, you revive the lowest time in play.')
  const firstPublicChildren = addPlayerPublicEvents({
    events: publicEvents,
    message: `First, ${effectPlayer.displayName} revives the lowest time in play.`
  })
  const lowest = addLowestPlayTimeEvents({
    playState,
    privateEvent: firstPrivateChild,
    publicEvents: firstPublicChildren,
    playerId: effectPlayer.id
  })
  revive({
    depth: lowest.time,
    playState,
    player: effectPlayer,
    privateEvent: lowest.playTimeEvents.privateEvent,
    publicEvents: lowest.playTimeEvents.publicEvents
  })
  const secondPrivateChild = addEvent(privateEvent, 'Second, you draw the number of schemes in the dungeon.')
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws the number of schemes in the dungeon.`)
  const { toBeCount: phrase } = getGrammar(playState.game.dungeon.length)
  const dungeonRanks = playState.game.dungeon.map(scheme => scheme.rank)
  const dungeonJoined = join(dungeonRanks)
  const dungeonMessage = `There ${phrase} in the dungeon, ${dungeonJoined}.`
  addEvent(secondPublicChildren.observerEvent, dungeonMessage)
  secondPublicChildren.otherPlayerEvents.forEach(otherPlayerEvent => {
    addEvent(otherPlayerEvent, dungeonMessage)
  })
  addEvent(secondPrivateChild, dungeonMessage)
  draw({
    depth: playState.game.dungeon.length,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateChild,
    publicEvents: secondPublicChildren
  })
  return playState
}
