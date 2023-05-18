import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addEvent from '../../add/event'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import getGrammar from '../../get/grammar'
import getJoined from '../../get/joined'
import draw from '../draw'
import revive from '../revive'
import addLowestPlayTimeEvents from '../../add/events/scheme/play/lowest/rank/lowestPlayTime'

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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} revives the lowest time in play.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, you revive the lowest time in play.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
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
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you draw the number of schemes in the dungeon.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const { phrase } = getGrammar(playState.game.dungeon.length)
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
