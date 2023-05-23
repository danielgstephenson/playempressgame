import { Transaction } from 'firelord'
import endPlay from './endPlay'
import playEffects from './state/effects/play'
import { Choice, PlayState, Player, Result } from './types'
import setPlayState from './setPlayState'

export default function onChoiceComplete ({
  choice,
  currentPlayer,
  playState,
  transaction
}: {
  choice: Choice
  currentPlayer: Result<Player>
  playState: PlayState
  transaction: Transaction
}): void {
  playState.game.choices = playState
    .game
    .choices
    .filter(c => c.id !== choice.id)
  if (choice.first == null) {
    playEffects({
      playState,
      playingId: currentPlayer.id,
      resume: true
    })
  }
  if (playState.game.choices.length === 0) {
    endPlay({ playState, transaction })
  } else {
    setPlayState({ playState, transaction })
  }
}
