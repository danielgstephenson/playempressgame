import addPublicEvents from '../../add/publicEvents'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/publicEvent'
import addPlayerEvent from '../../add/playerEvent'
import drawState from '../draw'
import reviveState from '../revive'
import addHighestPlayTimeEvents from '../../add/highestPlayTimeEvents'
import getLowestRankScheme from '../../get/lowestRankScheme'
import addEvent from '../../add/event'

export default function effectsSixState ({
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
  reviveState({
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
    addPublicEvent(secondPublicChildren, 'The dungeon is empty.')
    addEvent(secondPrivateEvent, 'The dungeon is empty.')
  } else {
    const lowestRank = String(lowestDungeon?.rank)
    addPublicEvent(secondPublicChildren, `The lowest rank in the dungeon is ${lowestRank}.`)
    addEvent(secondPrivateEvent, `The lowest rank in the dungeon is ${lowestRank}.`)
  }
  drawState({
    depth: lowestDungeon?.rank ?? 0,
    playState,
    player: effectPlayer,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  return playState
}
