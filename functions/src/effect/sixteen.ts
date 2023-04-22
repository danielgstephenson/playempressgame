import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import earn from '../earn'

export default function effectSixteen ({
  appointments,
  choices,
  deck,
  discard,
  dungeon,
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, if you have 5 or less schemes in hand, take 25 gold.')
  firstEvent.children.push(createEvent(`You have ${hand.length} schemes in hand.`))
  const less = hand.length <= 5
  const { gold: handGold, silver: handSilver } = earn({
    baseGold: gold,
    baseSilver: silver,
    bonus: 25,
    condition: less,
    event: firstEvent
  })
  const secondEvent = createEvent('If you took gold, put 1 scheme from your hand face down on your deck.')
  if (less) {
    secondEvent.children.push(createEvent('You took 25 gold.'))
  } else {
    secondEvent.children.push(createEvent('You did not take gold.'))
  }
  const lessChoice = { playerId, type: 'deck' } as const
  const lessChoices = less ? [...choices, lessChoice] : choices
  return {
    effectAppointments: appointments,
    effectChoices: lessChoices,
    effectDeck: deck,
    effectDiscard: discard,
    effectGold: handGold,
    effectHand: hand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: handSilver
  }
}
