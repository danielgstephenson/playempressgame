import addEvent from './add/event'
import addBuyEvents from './add/events/buy'
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
import guardFirst from './guard/first'
import joinRanks from './join/ranks'

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
  const beforeTimeline = [...playState.game.timeline]
  const leftmost = playState.game.timeline.shift()
  const buyEvents = addBuyEvents({
    beforeTimeline,
    bid,
    buyerId,
    ...buyerLoserMessages,
    name,
    playState,
    rank: leftmost?.rank
  })
  const buyerEvents = Object.values(buyEvents.targetEvents)
  function addBuyEvent ({ publicMessage, privateMessage }: {
    publicMessage: string
    privateMessage: string
  }): void {
    buyEvents.publicEvents.forEach(event => {
      addEvent(event, publicMessage)
    })
    buyerEvents.forEach(event => {
      addEvent(event, privateMessage)
    })
  }
  playState.players.forEach(player => {
    player.auctionReady = true
  })
  const found = playState
    .players
    .find(player => player.id === buyerId)
  const buyer = guardDefined(found, 'Buyer')
  if (leftmost != null) {
    const inPlayBefore = joinRanksGrammar(buyer.tableau)
    const inPlayBeforeMessage = `tableau was ${inPlayBefore.joinedRanks}`
    const privateInPlayBeforeMessage = `Your ${inPlayBeforeMessage}.`
    const publicInPlayBeforeMessage = `${buyer.displayName}'s ${inPlayBeforeMessage}.`
    buyer.tableau.push(leftmost)
    buyer.tableau.sort((a, b) => b.rank - a.rank)
    const inPlayAfter = joinRanksGrammar(buyer.tableau)
    const inPlayAfterMessage = `tableau becomes ${inPlayAfter.joinedRanks}.`
    const privateInPlayAfterMessage = `Your ${inPlayAfterMessage}.`
    const publicInPlayAfterMessage = `${buyer.displayName}'s ${inPlayAfterMessage}.`
    addBuyEvent({
      publicMessage: publicInPlayBeforeMessage,
      privateMessage: privateInPlayBeforeMessage
    })
    addBuyEvent({
      publicMessage: publicInPlayAfterMessage,
      privateMessage: privateInPlayAfterMessage
    })
  }
  const silver = bid % 5
  const gold = bid - silver
  if (gold > 0) {
    const before = buyer.gold
    buyer.gold -= gold
    addBuyEvent({
      publicMessage: `${buyer.displayName} went from ${before} gold to ${buyer.gold} gold.`,
      privateMessage: `You went from ${before} gold to ${buyer.gold} gold.`
    })
  }
  if (silver > 0) {
    const before = buyer.silver
    buyer.silver -= silver
    buyEvents.publicEvents.forEach(event => {
      addEvent(event, `${buyer.displayName} went from ${before} silver to ${buyer.silver} silver.`)
    })
    buyerEvents.forEach(event => {
      addEvent(event, `You went from ${before} silver to  ${buyer.silver} silver.`)
    })
  }
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
  const highPlayers = playState
    .players
    .filter(player => player.playScheme?.rank === highestPlayScheme.rank)
  const summoned = highPlayers.length === 1
  const highLosers = highPlayers.filter(player => player.id !== buyerId)
  const twelve = buyer.tableau.some(scheme => scheme.rank === 12)
  if (twelve) {
    const {
      publicEvents,
      targetEvents
    } = addTargetEvents({
      playState,
      message: `${buyer.displayName} won the auction, so they carry out the threat on their 12.`,
      targetMessages: {
        [buyer.id]: 'You won the auction, so you carry out the threat on your 12.'
      }
    })
    const publicChildMessage = `${buyer.displayName} may take schemes from the dungeon.`
    const privateChildMessage = 'You may take schemes from the dungeon.'
    const buyerEvent = guardDefined(targetEvents[buyer.id], 'Buyer event')
    addEvent(buyerEvent, privateChildMessage)
    publicEvents.forEach(publicEvent => {
      addEvent(publicEvent, publicChildMessage)
    })
  } else if (buyer.playScheme?.rank === 12) {
    if (summoned) {
      addTargetEvents({
        playState,
        message: `${buyer.displayName} won the auction, but they do not carry out the threat on their 12 because it was summoned.`,
        targetMessages: {
          [buyer.id]: 'You won the auction, but you do not carry out the threat on your 12 because it was summoned.'
        }
      })
    } else {
      addTargetEvents({
        playState,
        message: `${buyer.displayName} won the auction, but they do not carry out the threat on their 12 because it was imprisoned.`,
        targetMessages: {
          [buyer.id]: 'You won the auction, but you do not carry out the threat on your 12 because it was imprisoned.'
        }
      })
    }
  }
  if (highestPlayScheme.rank === 9) {
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
  const playedThirteens = playState
    .players
    .filter(player => player.playScheme?.rank === 13)
  const thirteens = playState
    .players
    .filter(player => player.tableau.some(scheme => scheme.rank === 13) && player.id !== buyerId)
  const thirteen = thirteens.length > 0
  if (thirteen) {
    const thirteenNames = thirteens.map(thirteen => thirteen.displayName)
    const joined = join(thirteenNames)
    const grammar = getGrammar(thirteens.length, '13', '13s')
    const threat = thirteens.length === 1
      ? 'threat'
      : 'threats'
    const publicThirteenMessage = `${joined} did not win the auction, so they carry out the ${threat} on their ${grammar.noun}.`
    const thirteenTargetMessages = thirteens.reduce<Record<string, string>>((targetMessages, thirteen) => {
      const otherThirteens = thirteens.filter(player => player.id !== thirteen.id)
      const otherNames = otherThirteens.map(player => player.displayName)
      const privateNames = ['You', ...otherNames]
      const privateJoined = join(privateNames)
      const privateMessage = `${privateJoined} did not win the auction, so you carry out the ${threat} on your ${grammar.noun}.`
      targetMessages[thirteen.id] = privateMessage
      return targetMessages
    }, {})
    const thirteenEvents = addTargetEvents({
      playState,
      message: publicThirteenMessage,
      targetMessages: thirteenTargetMessages
    })
    const loserThirteenMessage = `${buyer.displayName} may not take schemes from the court.`
    const buyerThirteenMessage = 'You may not take schemes from the court.'
    thirteenEvents.events.forEach(event => {
      if (event.playerId === buyerId) {
        addEvent(event, buyerThirteenMessage)
      }
      addEvent(event, loserThirteenMessage)
    })
    carryOutFourteen({
      playState
    })
    return
  } else if (playedThirteens.length === 1) {
    const player = guardFirst(playedThirteens, 'Thirteen player')
    addTargetEvents({
      playState,
      message: `${player.displayName} did not win the auction, but they do not carry out the threat on their 13 because it was summoned.`,
      targetMessages: {
        [player.id]: 'You did not win the auction, but you do not carry out the threat on your 13 because it was summoned.'
      }
    })
  } else if (playedThirteens.length > 1) {
    const names = playedThirteens.map(player => player.displayName)
    const joined = join(names)
    const grammar = getGrammar(playedThirteens.length, '13', '13s')
    const threat = playedThirteens.length === 1
      ? 'threat'
      : 'threats'
    const publicThirteenMessage = `${joined} did not win the auction, but they do not carry out the ${threat} on their ${grammar.noun} because they were imprisoned.`
    const thirteenTargetMessages = playedThirteens.reduce<Record<string, string>>((targetMessages, player) => {
      const otherThirteens = playedThirteens.filter(otherPlayer => otherPlayer.id !== player.id)
      const otherNames = otherThirteens.map(player => player.displayName)
      const privateNames = ['You', ...otherNames]
      const privateJoined = join(privateNames)
      const privateMessage = `${privateJoined} did not win the auction, but they do not you carry out the ${threat} on their ${grammar.noun} because they were imprisoned.`
      targetMessages[player.id] = privateMessage
      return targetMessages
    }, {})
    addTargetEvents({
      playState,
      message: publicThirteenMessage,
      targetMessages: thirteenTargetMessages
    })
  }
  const courtEmpty = playState.game.court.length === 0
  const courtJoined = joinRanks(playState.game.court)
  const singleCourt = playState.game.court.length === 1
  if (twelve) {
    const dungeonEmpty = playState.game.dungeon.length === 0
    const singleDungeon = playState.game.dungeon.length === 1
    const dungeonJoined = joinRanks(playState.game.dungeon)
    if (courtEmpty) {
      if (dungeonEmpty) {
        const buyerMessage = 'There are no schemes in the court or dungeon for you to take.'
        const loserMessage = `There are no schemes in the court or dungeon for ${buyer.displayName} to take.`
        addTargetEvents({
          playState,
          message: loserMessage,
          targetMessages: {
            [buyerId]: buyerMessage
          }
        })
        carryOutFourteen({ playState })
        return
      }
      if (singleDungeon) {
        const single = guardFirst(playState.game.dungeon, 'Single dungeon scheme')
        addTargetEvents({
          playState,
          message: `${buyer.displayName} is choosing whether to take ${single.rank} from the dungeon.`,
          targetMessages: {
            [buyerId]: `Choose whether to take ${single.rank} from the dungeon.`
          }
        })
        return
      }
      addTargetEvents({
        playState,
        message: `${buyer.displayName} is choosing which of ${dungeonJoined} to take from the dungeon.`,
        targetMessages: {
          [buyerId]: `Choose which of ${dungeonJoined} to take from the dungeon.`
        }
      })
      return
    }
    if (dungeonEmpty) {
      if (courtEmpty) {
        const buyerMessage = 'There are no schemes in the court or dungeon for you to take.'
        const loserMessage = `There are no schemes in the court or dungeon for ${buyer.displayName} to take.`
        addTargetEvents({
          playState,
          message: loserMessage,
          targetMessages: {
            [buyerId]: buyerMessage
          }
        })
        carryOutFourteen({ playState })
        return
      }
      if (singleCourt) {
        const single = guardFirst(playState.game.court, 'Single court scheme')
        addTargetEvents({
          playState,
          message: `${buyer.displayName} is choosing whether to take ${single.rank} from the court.`,
          targetMessages: {
            [buyerId]: `Choose whether to take ${single.rank} from the court.`
          }
        })
        return
      }
      addTargetEvents({
        playState,
        message: `${buyer.displayName} is choosing whether to take ${courtJoined} from the court.`,
        targetMessages: {
          [buyerId]: `Choose whether to take ${courtJoined} from the court.`
        }
      })
      return
    }
    if (singleCourt) {
      addTargetEvents({
        playState,
        message: `${buyer.displayName} is choosing whether to take ${courtJoined} from the court and ${dungeonJoined} from the dungeon.`,
        targetMessages: {
          [buyerId]: `Choose whether to take ${courtJoined} from the court and ${dungeonJoined} from the dungeon.`
        }
      })
      return
    }
    addTargetEvents({
      playState,
      message: `${buyer.displayName} is choosing which of ${courtJoined} from the court and ${dungeonJoined} from the dungeon to take.`,
      targetMessages: {
        [buyerId]: `Choose which of ${courtJoined} from the court and ${dungeonJoined} from the dungeon to take.`
      }
    })
    return
  }
  if (courtEmpty) {
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
    const courtJoined = joinRanks(playState.game.court)
    const multipleCourt = playState.game.court.length > 1
    const courtMessage = multipleCourt
      ? `which of ${courtJoined} to take`
      : `whether to take ${courtJoined}`
    const buyerCourtMessage = `Choose ${courtMessage} from the court.`
    const loserCourtMessage = `${buyer.displayName} is choosing ${courtMessage} from the court.`
    addTargetEvents({
      playState,
      message: loserCourtMessage,
      targetMessages: {
        [buyerId]: buyerCourtMessage
      }
    })
  }
}
