import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  RangeSlider,
  RangeSliderThumb,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  HStack
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import getBid from '../service/getBid'
import getBidStatus from '../service/getBidStatus'
import useBidMax from '../use/bidMax'
import Cloud from './Cloud'
import Status from './Status'

export default function BidView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const [bid, setBid] = useState(playerState.bid)
  useEffect(() => {
    setBid(playerState.bid)
  }, [playerState.bid])
  const allReady = gameState.profiles?.every(profile => profile.auctionReady)
  const max = useBidMax()
  if (
    playerState.bid == null ||
    bid == null ||
    gameState.phase !== 'auction' ||
    allReady === true ||
    playerState.tableau == null ||
    gameState.profiles == null
  ) {
    return <></>
  }
  function handleChange (value: string): void {
    if (playerState.silver == null || playerState.gold == null) return
    const bid = Number(value)
    const newBid = getBid({ bid, gold: playerState.gold, silver: playerState.silver })
    setBid(newBid)
  }
  function handleSliderChange (
    values: number[]
  ): void {
    if (playerState.bid == null || playerState.silver == null || playerState.gold == null) {
      return
    }
    const bid = values[0]
    if (bid >= playerState.bid) {
      const newBid = getBid({ bid, gold: playerState.gold, silver: playerState.silver })
      setBid(newBid)
    }
  }
  const eleven = playerState.tableau.some(scheme => scheme.rank === 11)
  const bidFive = gameState.profiles.some(profile => profile.userId !== playerState.userId && profile.bid >= 5)
  const step = eleven && bidFive ? 1 : 5
  const bidStatus = getBidStatus({ tableau: playerState.tableau, bid: playerState.bid })
  return (
    <>
      <HStack spacing='20px'>
        <NumberInput
          step={step}
          min={playerState.bid}
          max={max}
          value={bid}
          onChange={handleChange}
          width='100px'
          size='xs'
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <RangeSlider
          onChange={handleSliderChange}
          value={[bid]}
          min={0}
          max={max}
          step={step}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb boxSize={6} index={0} />
        </RangeSlider>
        <Status label='Bid' value={bidStatus} />
      </HStack>
      <HStack justifyContent='space-between'>
        <Cloud
          fn='bid'
          props={{ bid, gameId: gameState.id }}
        >
          Bid
        </Cloud>
        <Cloud
          fn='imprison'
          props={{ gameId: gameState.id }}
        >
          Imprison
        </Cloud>
        <Cloud
          fn='concede'
          props={{ gameId: gameState.id }}
        >
          Concede
        </Cloud>
        <Cloud
          fn='withdraw'
          props={{ gameId: gameState.id }}
        >
          Withdraw
        </Cloud>
      </HStack>
    </>
  )
}
