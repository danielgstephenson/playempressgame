import { PlayState, Result, Player } from '../../../types'
import addEvent from '../../event'

export default function addPlayerChoiceEvents ({ playState, player }: {
  playState: PlayState
  player: Result<Player>
}): void {
  const choice = playState.game.choices.find(c => c.playerId === player.id)
  if (choice == null) {
    return
  }
  const trash = choice.type === 'trash'
  const privateMessage = trash
    ? 'Choose a scheme from your hand to trash.'
    : 'Choose a scheme from your hand to put on your deck.'
  const publicMessage = trash
    ? `${player.displayName} is choosing a scheme to trash from their hand.`
    : `${player.displayName} is choosing a scheme from their hand to put on their deck.`
  addEvent(playState.game, publicMessage)
  addEvent(player, privateMessage)
  playState.players.forEach(otherPlayer => {
    if (otherPlayer.id === player.id) return
    addEvent(otherPlayer, publicMessage)
  })
}
