import { LockIcon } from '@chakra-ui/icons'
import { HStack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import areAllReady from '../service/areAllReady'
import getTyingProfiles from '../service/getTyingProfiles'
import isHighestUntiedBidder from '../service/isHighestUntiedBidder'
import BidStatusView from './BidStatus'
import TopPopoverButtonView from './TopPopoverButton'

export default function BidProfileButtonView (): JSX.Element {
  const gameState = useContext(gameContext)
  const profileState = useContext(profileContext)
  if (
    profileState.bid == null ||
    profileState.displayName == null ||
    profileState.lastBidder == null ||
    profileState.tableau == null ||
    gameState.profiles == null ||
    profileState.userId == null ||
    profileState.silver == null
  ) return <></>
  const allReady = areAllReady(gameState.profiles)
  const bidding = gameState.phase === 'auction' && !allReady
  if (!bidding) return <></>
  const highestUntied = isHighestUntiedBidder({
    profiles: gameState.profiles, userId: profileState.userId
  })
  if (highestUntied) {
    const label = (
      <BidStatusView
        bg='black'
        tableau={profileState.tableau}
        bid={profileState.bid}
        profiles={gameState.profiles}
        silver={profileState.silver}
        userId={profileState.userId}
      />
    )
    return (
      <TopPopoverButtonView bg='black' color='white' label={label}>
        {profileState.displayName}'s {profileState.bid} is the highest untied bid.
      </TopPopoverButtonView>
    )
  }
  const tyingProfiles = getTyingProfiles({
    profiles: gameState.profiles, bid: profileState.bid
  })
  if (tyingProfiles == null) return <></>
  const tied = tyingProfiles.length > 1
  if (tied) {
    if (profileState.auctionReady === true) {
      const label = (
        <BidStatusView
          bg='gray.400'
          tableau={profileState.tableau}
          bid={profileState.bid}
          profiles={gameState.profiles}
          silver={profileState.silver}
          userId={profileState.userId}
        />
      )
      return (
        <TopPopoverButtonView
          bg='gray.400'
          color='black'
          label={<HStack alignItems='start'><Text>{label}</Text> <LockIcon /></HStack>}
        >
          {profileState.displayName}'s is ready to imprison.
        </TopPopoverButtonView>
      )
    }
    if (profileState.lastBidder) {
      const label = (
        <BidStatusView
          bg='slategrey'
          tableau={profileState.tableau}
          bid={profileState.bid}
          profiles={gameState.profiles}
          silver={profileState.silver}
          userId={profileState.userId}
        />
      )
      return (
        <TopPopoverButtonView bg='slategrey' color='white' label={label}>
          {profileState.displayName}'s bid is {profileState.bid}, and they can not withdraw because they are the last bidder.
        </TopPopoverButtonView>
      )
    } else {
      const label = (
        <BidStatusView
          bg='gray.400'
          tableau={profileState.tableau}
          bid={profileState.bid}
          profiles={gameState.profiles}
          silver={profileState.silver}
          userId={profileState.userId}
        />
      )
      return (
        <TopPopoverButtonView bg='gray.400' color='black' label={label}>
          {profileState.displayName}'s bid is {profileState.bid}, but they can withdraw.
        </TopPopoverButtonView>
      )
    }
  }
  const label = (
    <BidStatusView
      bg='gray.100'
      tableau={profileState.tableau}
      bid={profileState.bid}
      profiles={gameState.profiles}
      silver={profileState.silver}
      userId={profileState.userId}
    />
  )
  return (
    <TopPopoverButtonView bg='gray.100' color='black' _hover={{ bg: 'lightgray' }} label={label}>
      {profileState.displayName}'s bid is {profileState.bid}.
    </TopPopoverButtonView>
  )
}
