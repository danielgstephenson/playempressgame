import { SchemeEffectProps, EffectResult, Choice } from '../types'
import createEvent from '../create/event'
import earn from '../earn'
import createId from '../create/id'

export default function effectSixteen ({
  appointments,
  choices,
  deck,
  discard,
  dungeon,
  first,
  gold,
  passedTimeline,
  hand,
  playerId,
  playSchemeRef,
  playSchemes,
  silver
}: SchemeEffectProps): EffectResult {
  const firstEvent = createEvent('First, if you have 5 or less schemes in hand, earn 25 gold.')
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
    secondEvent.children.push(createEvent('You just took 25 gold.'))
  } else {
    secondEvent.children.push(createEvent('You did not take gold.'))
  }
  const lessChoice: Choice = {
    id: createId(),
    playerId,
    type: 'deck'
  } as const
  if (first === true) {
    lessChoice.first = playSchemeRef
  }
  const lessChoices = less ? [...choices, lessChoice] : choices
  return {
    effectSummons: appointments,
    effectChoices: lessChoices,
    effectDeck: deck,
    effectDiscard: discard,
    effectGold: handGold,
    effectHand: hand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: handSilver
  }
}