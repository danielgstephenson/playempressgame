import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import draw from '../draw'
import revive from '../revive'
import addHighestPlayTimeEvents from '../../add/events/scheme/play/time/highest'
import getLowestRankScheme from '../../get/lowestRankScheme'
import addEventsEverywhere from '../../add/events/everywhere'

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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} revives the highest time in play.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, you revive the highest time in play.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
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
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you draw the lowest rank in the dungeon.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
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
