import { Game, Messages, Player, Result } from '../types'
import join from '../join'
import joinRanksGrammar from '../join/ranks/grammar'

export default function getImprisonMessages ({
  game,
  currentPlayer
}: {
  game: Result<Game>
  currentPlayer: Result<Player>
}): Messages {
  const [leftmostTimeline] = game.timeline
  const joinedCourt = joinRanksGrammar(game.court)
  const readyMessage = 'ready to imprison'
  const schemeMessages = []
  if (leftmostTimeline != null) {
    schemeMessages.push(`${leftmostTimeline.rank} from the timeline`)
  }
  if (game.court.length > 0) {
    schemeMessages.push(`${joinedCourt.joinedRanks} from the court`)
  }
  const schemesMessage = join(schemeMessages)
  const imprisonMessage = `${readyMessage} ${schemesMessage}.`
  const privateMessage = `You are ${imprisonMessage}`
  const publicMessage = `${currentPlayer.displayName} is ${imprisonMessage}`
  return {
    privateMessage,
    publicMessage
  }
}
