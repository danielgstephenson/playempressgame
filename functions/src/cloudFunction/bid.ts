import createCloudFunction from '../create/cloudFunction'
import { BidProps } from '../types'
import guardString from '../guard/string'
import guardNumber from '../guard/number'
import guardCurrentBidding from '../guard/current/bidding'
import { https } from 'firebase-functions/v1'
import getGrammar from '../get/grammar'
import createPlayState from '../create/playState'
import setPlayState from '../setPlayState'
import buy from '../buy'
import addTargetEvents from '../add/events/target'
import guardDefined from '../guard/defined'
import addEvent from '../add/event'
import getHighestUntiedPlayer from '../get/highestUntiedPlayer'
import join from '../join'
import getHighestBid from '../get/highestBid'
import isCarryingOutEleven from '../is/carryingOutEleven'
import joinPrivateNames from '../join/privateNames'
import guardHighestRankPlayScheme from '../guard/highestRankPlayScheme'
import guardFirst from '../guard/first'

const bid = createCloudFunction<BidProps>(async (props, context, transaction) => {
  const gameId = guardString(props.gameId, 'Play ready game id')
  const bid = guardNumber(props.bid, 'Play ready bid')
  const {
    currentGame,
    currentUid,
    currentPlayer,
    currentPlayerId
  } = await guardCurrentBidding({
    gameId,
    transaction,
    context
  })
  console.info(`Bidding ${bid} for ${currentUid}...`)
  if (currentPlayer.auctionReady) {
    throw new https.HttpsError(
      'failed-precondition',
      'You are ready to end the auction.'
    )
  }
  if (currentPlayer.bid >= bid) {
    throw new https.HttpsError(
      'out-of-range',
      'You may only raise.'
    )
  }
  if (currentPlayer.withdrawn) {
    throw new https.HttpsError(
      'failed-precondition',
      'You withdrew.'
    )
  }
  if (bid % 5 !== 0) {
    const eleven = isCarryingOutEleven({
      game: currentGame,
      player: currentPlayer
    })
    console.log('isCarryingOutEleven', eleven)
    if (!eleven) {
      throw new https.HttpsError(
        'invalid-argument',
        'You may only bid gold.'
      )
    }
    const minimumSilver = bid % 5
    if (currentPlayer.silver < minimumSilver) {
      throw new https.HttpsError(
        'out-of-range',
        `You do not have enough silver. You need at least ${minimumSilver}.`
      )
    }
    const treasure = currentPlayer.gold + currentPlayer.silver
    if (treasure < bid) {
      throw new https.HttpsError(
        'out-of-range',
        'You do not have enough gold and silver.'
      )
    }
  } else {
    if (currentPlayer.gold < bid) {
      throw new https.HttpsError(
        'out-of-range',
        'You do not have enough gold.'
      )
    }
  }
  const playState = await createPlayState({
    currentGame,
    currentPlayer,
    transaction
  })
  const bidGrammar = getGrammar(bid)
  const highestBid = getHighestBid(playState.players)
  const fiveThreshold = highestBid < 5 && bid >= 5
  const tenThreshold = currentPlayer.bid < 10 && bid >= 10
  currentPlayer.bid = bid
  if (fiveThreshold) {
    const hasElevens = playState
      .players
      .filter(player => player
        .tableau
        .some(scheme => scheme.rank === 11 && !player.withdrawn && player.userId !== currentUid)
      )
    if (hasElevens.length > 0) {
      const elevenNames = hasElevens.map(player => player.displayName)
      const joined = join(elevenNames)
      const grammar = getGrammar(elevenNames.length, '11', '11s')
      const publicElevenMessage = `${currentPlayer.displayName} bid ${bidGrammar.spelled}, so ${joined} carry out the threat on their ${grammar.noun}.`
      const observerEvent = addEvent(playState.game, publicElevenMessage)
      const privateChildMessage = 'You may bid silver this auction.'
      const publicChildMessage = `${joined} may bid silver this auction.`
      addEvent(observerEvent, publicChildMessage)
      playState.players.forEach(player => {
        const bidder = player.userId === currentUid
        const bidderName = bidder ? 'You' : currentPlayer.displayName
        const playedEleven = hasElevens.some(elevenPlayer => elevenPlayer.userId === player.userId)
        const possessive = playedEleven ? 'your' : 'their'
        const names = playedEleven ? joinPrivateNames({ name: 'you', players: hasElevens, userId: player.userId }) : joined
        const verb = playedEleven
          ? 'carry'
          : 'carries'
        const bidderMessage = `${bidderName} bid ${bidGrammar.spelled}, so ${names} ${verb} out the threat on ${possessive} ${grammar.noun}.`
        const playerEvent = addEvent(player, bidderMessage)
        if (playedEleven) {
          addEvent(playerEvent, privateChildMessage)
        } else {
          addEvent(playerEvent, publicChildMessage)
        }
      })
    }
    const playedElevens = playState
      .players
      .filter(player => player.playScheme?.rank === 11)
    const highestRankPlayScheme = guardHighestRankPlayScheme(playState.players)
    if (highestRankPlayScheme.rank === 11) {
      if (playedElevens.length === 1) {
        const elevenPlayer = guardFirst(playedElevens, 'Eleven player')
        const publicMessage = `${currentPlayer.displayName} bid ${bidGrammar.spelled}, but they do not carry out the threat on their 11 because it was summoned to the court.`
        addEvent(playState.game, publicMessage)
        playState.players.forEach(player => {
          console.log('player', player)
          const bidder = player.userId === currentUid
          const bidderName = bidder ? 'You' : currentPlayer.displayName
          const playedEleven = elevenPlayer.userId === player.userId
          console.log('playedEleven', playedEleven)
          const possessive = playedEleven ? 'your' : 'their'
          console.log('possessive', possessive)
          const owner = playedEleven ? 'you' : elevenPlayer.displayName
          const verb = playedEleven
            ? 'do not'
            : 'does not'
          const bidderMessage = `${bidderName} bid ${bidGrammar.spelled}, but ${owner} ${verb} carry out the threat from ${possessive} 11 because it was summoned the court.`
          addEvent(player, bidderMessage)
        })
      } else {
        const elevenNames = playedElevens.map(player => player.displayName)
        const joined = join(elevenNames)
        const grammar = getGrammar(elevenNames.length, '11', '11s')
        const publicMessage = `${currentPlayer.displayName} bid ${bidGrammar.spelled}, but ${joined} do not carry out the threat on their ${grammar.noun} because they were imprisoned in the dugeon.`
        addEvent(playState.game, publicMessage)
        playState.players.forEach(player => {
          const bidder = player.userId === currentUid
          const bidderName = bidder ? 'You' : currentPlayer.displayName
          const playedEleven = playedElevens.some(elevenPlayer => elevenPlayer.userId === player.userId)
          const possessive = playedEleven ? 'your' : 'their'
          const names = playedEleven ? joinPrivateNames({ name: 'you', players: playedElevens, userId: player.userId }) : joined
          const verb = playedEleven
            ? 'do not'
            : 'does not'
          const bidderMessage = `${bidderName} bid ${bidGrammar.spelled}, but ${names} ${verb} carry out the threat on ${possessive} ${grammar.noun} because they were imprisoned in the dugeon.`
          addEvent(player, bidderMessage)
        })
      }
    }
  }
  if (tenThreshold) {
    const hasTen = currentPlayer.tableau.some(scheme => scheme.rank === 10)
    if (hasTen) {
      currentPlayer.bid += 10
      const tenEvents = addTargetEvents({
        playState,
        message: `${currentPlayer.displayName} bid ${bid}, ten or more, so they carry out the threat on their 10.`,
        targetMessages: {
          [currentPlayerId]: `You bid ${bid}, ten or more, so you carry out the threat on your 10.`
        }
      })
      const privateEvent = guardDefined(tenEvents.targetEvents[currentPlayerId], 'Private ten event')
      addEvent(privateEvent, `Your bid is increased by 10 from ${bid} to ${currentPlayer.bid}.`)
      tenEvents.publicEvents.forEach(event => {
        addEvent(event, `${currentPlayer.displayName}'s bid is increased by 10 from ${bid} to ${currentPlayer.bid}.`)
      })
    } else if (currentPlayer.playScheme?.rank === 10) {
      const playedTen = playState.players.filter(player => player.playScheme?.rank === 10)
      const reason = playedTen.length === 1
        ? 'summoned to the court'
        : 'imprisoned in the dungeon'
      addTargetEvents({
        playState,
        message: `${currentPlayer.displayName} bid ${bid}, but ${currentPlayer.displayName} does not carry out the threat from their 10, because it was ${reason}.`,
        targetMessages: {
          [currentPlayerId]: `You bid ${bid}, but you do not carry out the threat from your 10, because it was ${reason}.`
        }
      })
    }
  }
  const highestOtherGold = playState.players.reduce((highest, player) => {
    if (player.withdrawn) {
      return highest
    }
    if (player.userId === currentUid) {
      return highest
    }
    if (player.gold > highest) {
      return player.gold
    }
    return highest
  }, 0)
  if (currentPlayer.bid > highestOtherGold) {
    currentPlayer.bid = props.bid
    const privateBidMessage = `You bid ${bidGrammar.spelled}, more gold than anyone else has`
    const publicBidMessage = `${currentPlayer.displayName} bid ${bidGrammar.spelled}, more gold than anyone else has`
    buy({
      bid: props.bid,
      buyerId: currentPlayer.id,
      loserMessage: publicBidMessage,
      buyerMessage: privateBidMessage,
      name: currentPlayer.displayName,
      playState
    })
    setPlayState({
      playState,
      transaction
    })
    console.info(`${currentUid} bid enough to buy!`)
    return
  }
  const highestUntiedPlayer = getHighestUntiedPlayer(playState.players)
  const winning = highestUntiedPlayer?.userId === currentUid
  const { spelled } = getGrammar(currentPlayer.bid)
  const privateBidMessage = `You bid ${spelled}`
  const publicBidMessage = `${currentPlayer.displayName} bid ${spelled}`
  const highestMessage = 'the highest untied bidder'
  const privateMessage = winning
    ? `${privateBidMessage}, making you ${highestMessage}.`
    : `${privateBidMessage}.`
  const publicMessage = winning
    ? `${publicBidMessage}, making them ${highestMessage}.`
    : `${publicBidMessage}.`
  addTargetEvents({
    playState,
    message: publicMessage,
    targetMessages: {
      [currentPlayerId]: privateMessage
    }
  })
  currentPlayer.lastBidder = true
  currentPlayer.auctionReady = winning
  console.log('bid', bid)
  console.log('highestUntiedProfile', highestUntiedPlayer)
  console.log('winning', winning)
  const tying = highestUntiedPlayer?.bid === currentPlayer.bid
  const pivotal = winning || tying
  console.log('pivotal', pivotal)
  playState.players.forEach(player => {
    if (player.withdrawn || player.userId === currentUid) {
      return
    }
    player.lastBidder = false
    if (pivotal) {
      player.auctionReady = false
    }
  })
  setPlayState({
    playState,
    transaction
  })
  console.info(`${currentPlayer.id} bid ${spelled}!`)
})
export default bid
