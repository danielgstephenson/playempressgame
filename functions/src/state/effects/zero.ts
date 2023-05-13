import addPlayerEvent from '../../add/playerEvent'
import addPublicEvents from '../../add/publicEvents'
import addPublicEvent from '../../add/publicEvent'
import createPrivilege from '../../create/privilege'
import { PlayState, EffectsStateProps } from '../../types'

export default function effectsZeroState ({
  copiedByFirstEffect,
  playState,
  effectPlayer,
  effectScheme,
  resume
}: EffectsStateProps): PlayState {
  const publicEvents = addPublicEvents({
    effectPlayer,
    message: `${effectPlayer.displayName} plays ${effectScheme.rank}.`,
    playState
  })
  addPublicEvent(publicEvents, `First, ${effectPlayer.displayName} takes 8 Privilege into their hand.`)
  addPlayerEvent({
    events: effectPlayer.history,
    message: 'First, you take 8 Privilege into your hand.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  effectPlayer.hand.push(...createPrivilege(8))
  addPublicEvent(publicEvents, `Second, ${effectPlayer.displayName} puts 2 Privilege on their deck.`)
  addPlayerEvent({
    events: effectPlayer.history,
    message: 'Second, you put 2 Privilege on your deck.',
    playerId: effectPlayer.id,
    round: playState.game.round
  })
  effectPlayer.deck.push(...createPrivilege(2))
  return playState
}
