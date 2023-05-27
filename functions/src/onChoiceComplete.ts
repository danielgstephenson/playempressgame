import { Transaction } from 'firelord'
import endPlay from './endPlay'
import { Choice, HistoryEvent, PlayState, Player, PublicEvents, Result } from './types'
import setPlayState from './setPlayState'
import applyEffects from './effects/apply'
import guardDefined from './guard/defined'

export default function onChoiceComplete ({
  choice,
  currentPlayer,
  playState,
  privateEvent,
  publicEvents,
  transaction
}: {
  choice: Choice
  currentPlayer: Result<Player>
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
  transaction: Transaction
}): void {
  if (choice.first != null) {
    const effectScheme = guardDefined(currentPlayer.playScheme, 'Play scheme')
    applyEffects({
      copiedByFirstEffect: false,
      effectPlayer: currentPlayer,
      effectScheme,
      playState,
      privateEvent,
      publicEvents,
      resume: true
    })
  }
  playState.game.choices = playState
    .game
    .choices
    .filter(c => c.id !== choice.id)
  if (playState.game.choices.length === 0) {
    endPlay({ playState, transaction })
  } else {
    setPlayState({ playState, transaction })
  }
}
