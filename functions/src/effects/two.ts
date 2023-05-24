import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addLowestPlayTimeEvents from '../add/events/scheme/play/time/lowest'
import draw from '../draw'
import getGrammar from '../get/grammar'
import getJoined from '../get/joined'
import revive from '../revive'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsTwo ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} revives the lowest time in play.`)
  const firstPrivateEvent = addEvent(privateEvent, 'First, you revive the lowest time in play.')
  const lowest = addLowestPlayTimeEvents({
    playState,
    privateEvent: firstPrivateEvent,
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
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws the number of schemes in the dungeon.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you draw the number of schemes in the dungeon.')
  const { toBeCount: phrase } = getGrammar(playState.game.dungeon.length)
  const dungeonRanks = playState.game.dungeon.map(scheme => scheme.rank)
  const dungeonJoined = getJoined(dungeonRanks)
  const dungeonMessage = `There ${phrase} in the dungeon, ${dungeonJoined}.`
  addEvent(secondPublicChildren.observerEvent, dungeonMessage)
  secondPublicChildren.otherPlayerEvents.forEach(otherPlayerEvent => {
    addEvent(otherPlayerEvent, dungeonMessage)
  })
  addEvent(secondPrivateEvent, dungeonMessage)
  draw({
    depth: playState.game.dungeon.length,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  return playState
}
