import { SchemeEffectProps, EffectResult } from '../types'
import createEvent from '../create/event'
import revive from '../revive'
import draw from '../draw'
import getGrammar from '../get/grammar'
import guardSchemeData from '../guard/schemeData'
import getTopScheme from '../get/topScheme'
import addEvent from '../addEvent'
import isGreen from '../is/green'
import isYellow from '../is/yellow'
import isRed from '../is/red'
import getJoinedRanks from '../get/joined/ranks'

export default function effectFive ({
  summons,
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
  const firstEvent = createEvent("First, you revive your top discard scheme's time")
  function getTopDiscardSchemeTime (): number {
    const top = getTopScheme(discard)
    if (top == null) {
      addEvent(firstEvent, 'Your discard is empty.')
      return 0
    }
    addEvent(firstEvent, `Your top discard scheme is ${top.rank} with ${top.time} time.`)
    return top.time
  }
  const time = getTopDiscardSchemeTime()
  const { revivedDiscard, revivedHand } = revive({
    discard,
    event: firstEvent,
    hand,
    depth: time
  })
  const secondEvent = createEvent('Second, you draw twice the number of colors in play.')
  const uniqueColors = playSchemes.reduce<string[]>((uniqueColors, scheme) => {
    const playScheme = guardSchemeData(scheme.rank)
    if (uniqueColors.includes(playScheme.color)) return uniqueColors
    return [...uniqueColors, playScheme.color]
  }, [])
  const doubleColors = uniqueColors.length * 2
  const { phrase } = getGrammar(uniqueColors.length, 'color', 'colors')
  const colorsEvent = createEvent(`There ${phrase} in play, so you draw ${doubleColors}`)
  secondEvent.children.push(colorsEvent)
  const greenSchemes = playSchemes.filter(isGreen)
  if (greenSchemes.length !== 0) {
    const greenRanks = getJoinedRanks(greenSchemes)
    const { verb } = getGrammar(greenSchemes.length)
    addEvent(colorsEvent, `${greenRanks} ${verb} green.`)
  }
  const yellowSchemes = playSchemes.filter(isYellow)
  if (yellowSchemes.length !== 0) {
    const yellowRanks = getJoinedRanks(yellowSchemes)
    const { verb } = getGrammar(yellowSchemes.length)
    addEvent(colorsEvent, `${yellowRanks} ${verb} yellow.`)
  }
  const redSchemes = playSchemes.filter(isRed)
  if (redSchemes.length !== 0) {
    const redRanks = getJoinedRanks(redSchemes)
    const { verb } = getGrammar(redSchemes.length)
    addEvent(colorsEvent, `${redRanks} ${verb} red.`)
  }
  const { drawnDeck, drawnDiscard, drawnHand } = draw({
    deck,
    discard: revivedDiscard,
    event: secondEvent,
    hand: revivedHand,
    depth: uniqueColors.length * 2
  })
  return {
    effectSummons: summons,
    effectChoices: choices,
    effectDeck: drawnDeck,
    effectDiscard: drawnDiscard,
    effectGold: gold,
    effectHand: drawnHand,
    effectPlayerEvents: [firstEvent, secondEvent],
    effectSilver: silver
  }
}
