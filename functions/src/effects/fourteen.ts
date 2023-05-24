import addEvent from '../add/event'
import addPlayerEvent from '../add/event/player'
import addPublicEvent from '../add/event/public'
import addPublicEvents from '../add/events/public'
import addHighestRankGreenOrYellowDungeonSchemeEvents from '../add/events/scheme/dungeon/rank/highest/greenOrYellow'
import addLowerRankPlaySchemeEvents from '../add/events/scheme/play/rank/lower'
import addRightmostYellowTimelineSchemeEvents from '../add/events/scheme/timeline/rightmost/yellow'
import { EffectsStateProps, PlayState } from '../types'
import copyEffects from './copy'

export default function effectsFourteen ({
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
    const firstPublicChildren = addPublicEvent(publicEvents, `First, if there is a lower rank scheme in play, ${effectPlayer.displayName} copies the rightmost yellow timeline scheme.`)
    const firstPrivateEvent = addEvent(privateEvent, 'First, if there is a lower rank scheme in play, you copy the rightmost yellow timeline scheme.')
    const { scheme } = addLowerRankPlaySchemeEvents({
      playState,
      privateEvent: firstPrivateEvent,
      publicEvents: firstPublicChildren,
      rank: effectScheme.rank,
      playerId: effectPlayer.id
    })
    if (scheme != null) {
      const { scheme } = addRightmostYellowTimelineSchemeEvents({
        privateEvent: firstPrivateEvent,
        publicEvents: firstPublicChildren,
        playState
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
  }
  const secondPublicChildren = addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} copies the highest rank green or yellow dungeon scheme.`)
  const secondPrivateEvent = addEvent(privateEvent, 'Second, you copy the highest rank green or yellow dungeon scheme.')
  const { scheme } = addHighestRankGreenOrYellowDungeonSchemeEvents({
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
