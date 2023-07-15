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
  dungeon,
  gameId,
  phase,
  profiles,
  rank,
  schemeId,
  userId
}: {
  bid?: number
  court?: Scheme[]
  choices?: Choice[]
  deck?: Scheme[]
  dungeon?: Scheme[]
  gameId?: string
  phase?: string
  profiles?: Profile[]
  rank: number
  schemeId: string
  userId?: string
}): SchemeStyles {
  const bg = getBg({ rank })
  const allReady = areAllReady(profiles)
  const highestUntiedProfile = getHighestUntiedProfile(profiles)
  const highestUntiedBidder = highestUntiedProfile?.userId === userId

  const fromCourt = court?.some(scheme => scheme.id === schemeId)
  if (rank === 9) {
    if (fromCourt === true) {
      return { bg }
    }
    const fullDiscard = profiles?.some(profile => profile.userId !== userId && profile.topDiscardScheme != null)
    if (allReady) {
      if (highestUntiedBidder) {
        return { bg, ...CANT_CARRY_OUT_STYLES }
      }
      if (fullDiscard === true) {
        return { bg, ...CARRYING_OUT_STYLES }
      }
    }
    if (fullDiscard === true) {
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
    const taking = isTaking({ profiles, userId })
    if (!taking) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
    return { bg, ...CARRYING_OUT_STYLES }
  }
  if (rank === 13) {
    if (!allReady) {
      return CAN_CARRY_OUT_STYLES
    }
    if (fromCourt === true) {
      return { bg }
    }
    const taking = isTaking({ profiles, userId })
    if (taking || highestUntiedProfile?.topDiscardScheme == null) {
      return { bg, ...CANT_CARRY_OUT_STYLES }
    }
    return { bg, ...CARRYING_OUT_STYLES }
  }
  if (rank === 14) {
    if (deck != null && userId != null && gameId != null) {
      const playerId = `${userId}_${gameId}`
      if (deck.length >= 2 || deck.every(scheme => scheme.rank === deck[0].rank)) {
        return { bg, ...CANT_CARRY_OUT_STYLES }
      } else if (phase === 'auction' && choices?.some(choice => choice.playerId === playerId) === true) {
        return { bg, ...CARRYING_OUT_STYLES }
      } else {
        return { bg, ...CAN_CARRY_OUT_STYLES }
      }
    }
  }
  return { bg }
}
