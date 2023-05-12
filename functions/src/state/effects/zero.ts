import createEvent from '../../create/event'
import createEffectEvent from '../../create/event/effect'
import createPrivilege from '../../create/privilege'
import { PlayState, EffectsStateProps } from '../../types'

export default function effectsZeroState ({
  copiedByFirstEffect,
  playState,
  effectPlayer,
  effectScheme,
  resume
}: EffectsStateProps): PlayState {
  const firstPrivateEvent = createEffectEvent({
    message: 'First, you take 8 Privilege into your hand.',
    game: playState.game,
    player: effectPlayer
  })
  effectPlayer.hand.push(...createPrivilege(8))
  const secondPrivateEvent = createEffectEvent({
    message: 'Second, you put 2 Privilege on your deck.',
    game: playState.game,
    player: effectPlayer
  })
  effectPlayer.deck.push(...createPrivilege(2))
  effectPlayer.history.push(firstPrivateEvent, secondPrivateEvent)
  const publicChildren = [
    createEvent(`First, ${effectPlayer.displayName} takes 8 Privilege into their hand.`),
    createEvent(`Second, ${effectPlayer.displayName} puts 2 Privilege on their deck.`)
  ]
  const publicEvent = createEffectEvent({
    children: publicChildren,
    message: `${effectPlayer.displayName} plays ${effectScheme.rank}.`,
    game: playState.game,
    player: effectPlayer
  })
  playState.players.forEach(player => {
    if (player.id !== effectPlayer.id) player.history.push(publicEvent)
  })
  return playState
}
