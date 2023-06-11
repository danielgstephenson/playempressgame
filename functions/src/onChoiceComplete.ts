import { Transaction } from 'firelord'
import summonOrImprison from './summonOrImprison'
import { Choice, HistoryEvent, PlayState, Player, PublicEvents, Result } from './types'
import setPlayState from './setPlayState'
import applyEffects from './effects/apply'
import guardDefined from './guard/defined'
import drawUpToThree from './drawUpToThree'
import addPlayerChoiceEvents from './add/events/player/choice'

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
    if (choice.threat == null) {
      summonOrImprison({ playState })
      setPlayState({ playState, transaction })
    } else {
      drawUpToThree({ playState })
      setPlayState({ playState, transaction })
    }
  } else {
    addPlayerChoiceEvents({ playState, player: currentPlayer })
    setPlayState({ playState, transaction })
  }
}
