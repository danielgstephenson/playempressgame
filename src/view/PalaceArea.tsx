import { Box, Heading, HStack, Text } from '@chakra-ui/layout'
import { Checkbox } from '@chakra-ui/react'
import { Fragment, ReactNode, useContext } from 'react'
import playContext from '../context/play'
import { Scheme } from '../types'
import Curtain from './Curtain'

export default function PalaceAreaView ({
  children,
  schemes
}: {
  children?: ReactNode
  schemes?: Scheme[]
}): JSX.Element {
  const playState = useContext(playContext)
  const full = schemes != null && schemes.length > 0
  const group = schemes?.map(scheme => {
    if (playState.taken == null) {
      return <Fragment key={scheme.id} />
    }
    const taken = playState.taken.includes(scheme.id)
    function handleTake (): void {
      playState.take?.(scheme.id)
    }
    function handleLeave (): void {
      playState.leave?.(scheme.id)
    }
    function handleCheck (event: React.ChangeEvent<HTMLInputElement>): void {
      if (event.target.checked) {
        handleTake()
      } else {
        handleLeave()
      }
    }
    return (
      <Box key={scheme.id}>
        <Text>{scheme.rank}</Text>
        <Checkbox isChecked={taken} onChange={handleCheck} />
      </Box>
    )
  })
  const heading = children != null && <Heading size='sm'>{children}</Heading>
  return (
    <>
      {heading}
      <Curtain open={full} hider={<Text>Empty</Text>}>
        <HStack flexWrap='wrap'>x{group}</HStack>
      </Curtain>
    </>
  )
}
