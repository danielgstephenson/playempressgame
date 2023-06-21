import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  RangeSlider,
  RangeSliderThumb,
  RangeSliderTrack,
  RangeSliderFilledTrack
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Cloud from './Cloud'
import Status from './Status'

export default function BidView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const [bid, setBid] = useState(playerState.bid)
  useEffect(() => {
    setBid(playerState.bid)
  }, [playerState.bid])
  function handleChange (value: string): void {
    setBid(Number(value))
  }
  function handleSliderChange (
    values: number[]
  ): void {
    setBid(values[0])
  }
  if (bid == null) {
    return <></>
  }
  return (
    <>
      <Status label='Bid' value={playerState.bid} />
      <NumberInput
        // step={5}
        // min={playerState.bid}
        // max={playerState.gold}
        value={bid}
        onChange={handleChange}
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
        max={playerState.gold}
        step={5}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={6} index={0} />
      </RangeSlider>
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
    </>
  )
}
