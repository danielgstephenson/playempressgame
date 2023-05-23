import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addRightmostTimelineSchemeEvents from '../add/events/scheme/timeline/rightmost'
import earn from '../earn'
import { EffectsStateProps, PlayState } from '../types'

export default function effectsTwentyTwo ({
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
  const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} earns the rightmost timeline scheme's rank.`)
  const firstPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: "First, earn the rightmost timeline scheme's rank.",
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const { scheme } = addRightmostTimelineSchemeEvents({
    playState,
    privateEvent: firstPrivateEvent,
    publicEvents: firstPublicChildren
  })
  if (scheme != null) {
    earn({
      amount: scheme.rank,
      player: effectPlayer,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren
    })
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} earns 5 gold for each dungeon scheme.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you earn 5 gold for each dungeon scheme.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const dungeonAmount = playState.game.dungeon.length * 5
  earn({
    amount: dungeonAmount,
    player: effectPlayer,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren
  })
  return playState
}
