import addEvent from './add/event'
import addBuyEvents from './add/events/buy'
import addCourtEvents from './add/events/court'
import addTargetEvents from './add/events/target'
import carryOutFourteen from './carryOut/fourteen'
import createAfterMessage from './create/message/after'
import createBeforeMessage from './create/message/before'
import getGrammar from './get/grammar'
import join from './join'
import joinRanksGrammar from './join/ranks/grammar'
import guardDefined from './guard/defined'
import guardHighestRankPlayScheme from './guard/highestRankPlayScheme'
import { PlayState, BuyerLoserMessages } from './types'

export default function buy ({
  bid,
  buyerId,
  name,
  playState,
  ...buyerLoserMessages
}: {
  bid: number
  buyerId: string
  name: string
  playState: PlayState
} & BuyerLoserMessages): void {
  const leftmost = playState.game.timeline.shift()
  addBuyEvents({
    bid,
    buyerId,
    ...buyerLoserMessages,
    name,
    playState,
    rank: leftmost?.rank
  })
  playState.players.forEach(player => {
    player.auctionReady = true
  })
  const found = playState.players.find(player => player.id === buyerId)
  const buyer = guardDefined(found, 'Buyer')
  if (leftmost != null) {
    buyer.tableau.push(leftmost)
  }
  const silver = bid % 5
  buyer.silver -= silver
  const gold = bid - silver
  buyer.gold -= gold
  buyer.auctionReady = true
  if (buyer.tableau.some(scheme => scheme.rank === 9)) {
    addTargetEvents({
      playState,
      message: `${buyer.displayName} won the auction, so they do not carry out the threat on their 9.`,
      targetMessages: {
        [buyer.id]: 'You won the auction, so you do not carry out the threat on your 9.'
      }
    })
  }
  const highestPlayScheme = guardHighestRankPlayScheme(playState.players)

  if (highestPlayScheme.rank === 9) {
    const highPlayers = playState
      .players
      .filter(player => player.playScheme?.rank === highestPlayScheme.rank)
    const highLosers = highPlayers.filter(player => player.id !== buyerId)
    if (highLosers.length > 0) {
      const names = highLosers.map(player => player.displayName)
      const joined = join(names)
      const grammar = getGrammar(highLosers.length, '9', '9s')
      const threat = highLosers.length === 1
        ? 'threat'
        : 'threats'
      const reason = highPlayers.length === 1
        ? 'it was summoned to the court'
        : 'they were impisoned in the dungeon'
      const publicMessage = `${joined} did not win the auction, buy they do not carry out the ${threat} on their ${grammar.noun} because ${reason}.`
      const targetMessages = highLosers.reduce<Record<string, string>>((targetMessages, loser) => {
        const otherLosers = highLosers.filter(player => player.id !== loser.id)
        const otherNames = otherLosers.map(player => player.displayName)
        const privateNames = ['You', ...otherNames]
        const privateJoined = join(privateNames)
        const privateMessage = `${privateJoined} did not win the auction, but you do not carry out the ${threat} on your ${grammar.noun} because ${reason}.`
        targetMessages[loser.id] = privateMessage
        return targetMessages
      }, {})
      addTargetEvents({
        playState,
        message: publicMessage,
        targetMessages
      })
    }
  }
  const nines = playState
    .players
    .filter(player => player.tableau.some(scheme => scheme.rank === 9) && player.id !== buyerId)
  if (nines.length > 0) {
    const nineNames = nines.map(nine => nine.displayName)
    const joined = join(nineNames)
    const grammar = getGrammar(nines.length, '9', '9s')
    const threat = nines.length === 1
      ? 'threat'
      : 'threats'
    const privateNineMessage = 'You did not win the auction, so you carry out the threat on your 9.'
    const targetMessages = nines.reduce<Record<string, string>>((targetMessages, nine) => {
      targetMessages[nine.id] = privateNineMessage
      return targetMessages
    }, {})
    const nineEvents = addTargetEvents({
      playState,
      message: `${joined} did not win the auction, so they carry out the ${threat} on their ${grammar.noun}.`,
      targetMessages
    })
    const beforeDiscard = joinRanksGrammar(buyer.discard)
    const beforeDiscardMessage = `Your discard was ${beforeDiscard.joinedRanks}.`
    const topDiscard = buyer.discard.shift()
    if (topDiscard == null) {
      const privateEmptyMessage = 'Your discard is empty, so you have nothing to imprison.'
      const publicEmptyMessage = `${buyer.displayName}'s discard is empty, so they have nothing to imprison.`
      nineEvents.events.forEach(event => {
        if (event.playerId === buyerId) {
          addEvent(event, privateEmptyMessage)
        } else {
          addEvent(event, publicEmptyMessage)
        }
      })
    } else {
      const afterDiscardMessage = createAfterMessage({
        prefix: 'Your discard',
        schemes: buyer.discard
      })
      const beforeDungeonMesssage = createBeforeMessage({
        prefix: 'The dungeon',
        schemes: playState.game.dungeon
      })
      playState.game.dungeon.unshift(topDiscard)
      const afterDungeon = joinRanksGrammar(playState.game.dungeon)
      const afterDungeonMessage = `The dungeon becomes ${afterDungeon.joinedRanks}.`
      const publicDungeonMessage = `${buyer.displayName} imprisons their top discard scheme, ${topDiscard.rank}.`
      const privateDungeonMessage = `You imprison your top discard scheme, ${topDiscard.rank}.`
      nineEvents.events.forEach(event => {
        const children = [
          beforeDungeonMesssage,
          afterDungeonMessage
        ]
        if (event.playerId === buyerId) {
          children.unshift(beforeDiscardMessage, afterDiscardMessage)
          const buyerEvent = addEvent(event, privateDungeonMessage)
          children.forEach(child => addEvent(buyerEvent, child))
        } else {
          const loserEvent = addEvent(event, publicDungeonMessage)
          children.forEach(child => addEvent(loserEvent, child))
        }
      })
    }
  }
  if (playState.game.court.length === 0) {
    const buyerCourtMessage = 'There are no schemes in the court for you to take.'
    const loserCourtMessage = `There are no schemes in the court for ${buyer.displayName} to take.`
    addTargetEvents({
      playState,
      message: loserCourtMessage,
      targetMessages: {
        [buyerId]: buyerCourtMessage
      }
    })
    carryOutFourteen({
      playState
    })
  } else {
    addCourtEvents({
      buyerId,
      buyerName: buyer.displayName,
      playState
    })
  }
}
