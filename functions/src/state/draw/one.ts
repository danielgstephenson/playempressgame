import createScheme from '../../create/scheme'
import guardDefined from '../../guard/defined'
import { PlayState, Player, Result } from '../../types'

export default function drawOneState ({
  playState,
  player
}: {
  playState: PlayState
  player: Result<Player>
}): PlayState {
  if (player.deck.length === 0) {
    if (player.discard.length === 0) {
      const privilege = createScheme(1)
      player.hand.push(privilege)
      return playState
    }
    const copy = [...player.discard]
    const flippedDiscard = copy.reverse()
    player.deck = flippedDiscard
    player.discard = []
    return drawOneState({
      playState,
      player
    })
  }
  const popScheme = player.deck.pop()
  const topScheme = guardDefined(popScheme, 'Draw one top scheme')
  player.hand.push(topScheme)
  return playState
}
