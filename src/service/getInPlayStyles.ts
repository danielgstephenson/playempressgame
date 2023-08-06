import { CANT_CARRY_OUT_STYLES, CAN_CARRY_OUT_STYLES, CARRYING_OUT_STYLES } from '../constants'
import { Choice, Profile, Scheme, SchemeStyles } from '../types'
import areAllReady from './areAllReady'
import getBg from './getBg'
import getHighestUntiedProfile from './getHighestUntiedProfile'
import isTaking from './isTaking'

export default function getInPlayStyles ({
  bid,
  choices,
  court,
  deck,
  deckEmpty,
  dungeon,
  gameId,
  phase,
  profiles,
  rank,
  schemeId,
  userId
}: ({
  bid: number
  court: Scheme[]
  choices: Choice[]
  dungeon: Scheme[]
  gameId: string
  phase: string
  profiles: Profile[]
  rank: number
  schemeId: string
  userId: string
} & ({
  deck: Scheme[]
  deckEmpty?: undefined
} | {
  deck?: undefined
  deckEmpty: boolean
}))): SchemeStyles {
  const bg = getBg({ rank })
  const allReady = areAllReady(profiles)
  const highestUntiedProfile = getHighestUntiedProfile(profiles)
  const highestUntiedBidder = highestUntiedProfile?.userId === userId
  if (phase === 'play') {
    const highestRankInPlay = profiles?.reduce<number>((highestRank, profile) => {
      return Math.max(highestRank, profile.playScheme?.rank ?? 0)
    }, 0)
    const isHighestRankInPlay = rank === highestRankInPlay
    if (isHighestRankInPlay) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
  }

  const fromCourt = court?.some(scheme => scheme.id === schemeId)
  if (rank === 9) {
    if (fromCourt) {
      return { bg }
    }
    const fullDiscard = profiles?.some(profile => profile.userId !== userId && profile.topDiscardScheme != null)
    if (allReady) {
      if (highestUntiedBidder) {
        return { bg, ...CANT_CARRY_OUT_STYLES }
      }
      if (fullDiscard) {
        return { bg, ...CARRYING_OUT_STYLES }
      }
    }
    if (fullDiscard) {
      return { bg, ...CAN_CARRY_OUT_STYLES }
    } else {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
  }
  if (rank === 10) {
    if (!allReady) {
      if (bid != null && bid >= 10) {
        return { bg, ...CARRYING_OUT_STYLES }
      } else {
        return { bg, ...CAN_CARRY_OUT_STYLES }
      }
    }
  }
  if (rank === 11) {
    if (!allReady) {
      const highestOtherBidder = profiles?.reduce<{ bid: number, profile: Profile }>((highestBidder, profile) => {
        if (profile.userId === userId) {
          return highestBidder
        }
        if (profile.bid > highestBidder.bid) {
          return { bid: profile.bid, profile }
        }
        return highestBidder
      }, { bid: 0, profile: profiles[0] }).profile
      if (highestOtherBidder != null && highestOtherBidder.bid >= 5) {
        return { bg, ...CARRYING_OUT_STYLES }
      } else {
        return { bg, ...CAN_CARRY_OUT_STYLES }
      }
    }
  }
  if (rank === 12) {
    if (dungeon?.length === 0) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
    if (!allReady) {
      return { bg, ...CAN_CARRY_OUT_STYLES }
    }
    const taking = isTaking({ profiles, userId, choices })
    if (!taking) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
    return { bg, ...CARRYING_OUT_STYLES }
  }
  if (rank === 13) {
    const choosing = choices != null && choices.length > 0
    if (choosing || !allReady) {
      return { bg, ...CAN_CARRY_OUT_STYLES }
    }
    if (fromCourt) {
      return { bg }
    }
    const wonTheAuction = highestUntiedProfile?.userId === userId
    const taking = isTaking({ profiles, userId, choices })
    if (wonTheAuction || taking || highestUntiedProfile?.topDiscardScheme == null) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
    return { bg, ...CARRYING_OUT_STYLES }
  }
  if (rank === 14) {
    if (deck != null) {
      const playerId = `${userId}_${gameId}`
      if (deck.length >= 2 || deck.every(scheme => scheme.rank === deck[0].rank)) {
        return { bg, ...CANT_CARRY_OUT_STYLES }
      } else if (phase === 'auction' && choices?.some(choice => choice.playerId === playerId)) {
        return { bg, ...CARRYING_OUT_STYLES }
      } else {
        return { bg, ...CAN_CARRY_OUT_STYLES }
      }
    }
    if (deckEmpty != null) {
      if (deckEmpty) {
        return { bg, ...CANT_CARRY_OUT_STYLES }
      }
      return { bg, ...CAN_CARRY_OUT_STYLES }
    }
  }
  return { bg }
}
