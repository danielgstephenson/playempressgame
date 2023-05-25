import { Transaction } from 'firelord'
import endPlay from './endPlay'
import playEffects from './effects/play'
import { Choice, HistoryEvent, PlayState, Player, PublicEvents, Result } from './types'
import setPlayState from './setPlayState'
import applyEffects from './effects/apply'

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
    applyEffects({
      copiedByFirstEffect: false,
      effectPlayer: currentPlayer,
      effectScheme: choice.first,
      playState,
      privateEvent,
      publicEvents,
      resume: false
    })

    playEffects({
      playState,
      playingId: currentPlayer.id,
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
