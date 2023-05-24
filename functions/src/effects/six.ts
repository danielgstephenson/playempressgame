import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addEventsEverywhere from '../add/events/everywhere'
import addPublicEvents from '../add/events/public'
import addHighestPlayTimeEvents from '../add/events/scheme/play/time/highest'
import draw from '../draw'
import getLowestRankScheme from '../get/lowestRankScheme'
import revive from '../revive'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsSix ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} revives the highest time in play.`)
  const firstPrivateEvent = addEvent(privateEvent, 'First, you revive the highest time in play.')
  const highest = addHighestPlayTimeEvents({
    playState,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren,
    playerId: effectPlayer.id
  })
  revive({
    depth: highest.time,
    playState,
    player: effectPlayer,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} draws the lowest rank in the dungeon.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you draw the lowest rank in the dungeon.')
  const lowestDungeon = getLowestRankScheme(playState.game.dungeon)
  if (playState.game.dungeon.length === 0) {
    addEventsEverywhere({
      publicEvents: secondPublicChildren,
      privateEvent: secondPrivateEvent,
      message: 'The dungeon is empty.'
    })
  } else {
    const lowestRank = String(lowestDungeon?.rank)
    addEventsEverywhere({
      publicEvents: secondPublicChildren,
      privateEvent: secondPrivateEvent,
      message: `The lowest rank in the dungeon is ${lowestRank}.`
    })
  }
  draw({
    depth: lowestDungeon?.rank ?? 0,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  return playState
}
