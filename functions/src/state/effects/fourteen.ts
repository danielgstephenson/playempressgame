import addPublicEvents from '../../add/events/public'
import { PlayState, EffectsStateProps } from '../../types'
import addPublicEvent from '../../add/event/public'
import addPlayerEvent from '../../add/event/player'
import copyEffects from './copy'
import addLowerRankPlaySchemeEvents from '../../add/events/scheme/play/rank/lower'
import addRightmostYellowTimelineSchemeEvents from '../../add/events/scheme/timeline/rightmost/yellow'
import addHighestRankGreenOrYellowDungeonSchemeEvents from '../../add/events/scheme/dungeon/rank/highest/greenOrYellow'

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
  if (!resume) {
    const firstPublicChildren = addPublicEvent(publicEvents, `First, if there is a lower rank scheme in play, ${effectPlayer.displayName} copies the rightmost yellow timeline scheme.`)
    const firstPrivateEvent = addPlayerEvent({
      events: effectPlayer.history,
      message: 'First, if there is a lower rank scheme in play, copy the rightmost yellow timeline scheme.',
      playerId: effectPlayer.id,
      round: playState.game.round
    })
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
  const secondPrivateEvent = addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you copy the highest rank green or yellow dungeon scheme.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
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
