import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addLowestRankGreenOrYellowDungeonSchemeEvents from '../add/events/scheme/dungeon/rank/lowest/greenOrYellow'
import addLowestRankYellowPlaySchemeEvents from '../add/events/scheme/play/rank/lowest/yellow'
import { EffectsStateProps, PlayState } from '../types'
import copyEffects from './copy'

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
  const privateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: `You play ${effectScheme.rank}.`,
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  if (!resume) {
    const firstPublicChildren = addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} copies the lowest rank yellow scheme in play.`)
    const firstPrivateEvent = addEvent(privateEvent, 'First, you copy the lowest rank yellow scheme in play.')
    const { scheme } = addLowestRankYellowPlaySchemeEvents({
      playState,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren,
      playerId: effectPlayer.id
    })
    if (scheme != null) {
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
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the lowest rank green or yellow dungeon scheme.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you copy the lowest rank green or yellow dungeon scheme.')
  const { scheme } = addLowestRankGreenOrYellowDungeonSchemeEvents({
    playState,
    privateEvent: secondPrivateEvent,
    publicEvents: secondPublicChildren,
    playerId: effectPlayer.id
  })
  if (scheme != null) {
    copyEffects({
      first: false,
      playState,
      effectPlayer,
      effectScheme: scheme,
      resume: false
    })
  }
  return playState
}
