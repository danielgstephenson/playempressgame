import { PlayState } from '../../types'
import addPlayerChoiceEvents from './player/choice'

export default function addChoiceEvents (playState: PlayState): void {
  playState.players.forEach(player => {
    addPlayerChoiceEvents({ playState, player })
  })
}
