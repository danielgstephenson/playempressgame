import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import copyEffects from './copy'
import addLowestRankYellowPlaySchemeEvents from '../../add/events/scheme/play/rank/lowest/yellow'
import addLowestRankGreenOrYellowDungeonSchemeEvents from '../../add/events/scheme/dungeon/rank/lowest/greenOrYellow'

export default function effectsEight ({
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
  if (!resume) {
    const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} copies the lowest rank yellow scheme in play.`)
    const firstPrivateEvent = addPlayerEvent({
      events: effectPlayer.history,
      message: 'First, you copy the lowest rank yellow scheme in play.',
      playerId: effectPlayer.id,
      round: playState.game.round
    })
    const { scheme } = addLowestRankYellowPlaySchemeEvents({
      playState,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren,
      playerId: effectPlayer.id
    })
    const firstChoices = copyEffects({
      first: true,
      playState,
      effectPlayer,
      effectScheme: scheme,
      resume: false
    })
    if (firstChoices.length > 0) {
      return playState
    }
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the lowest rank green or yellow dungeon scheme.`)
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you copy the lowest rank green or yellow dungeon scheme.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  const { scheme } = addLowestRankGreenOrYellowDungeonSchemeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  copyEffects({
    first: false,
    playState,
    effectPlayer,
    effectScheme: scheme,
    resume: false
  })
  return playState
}
