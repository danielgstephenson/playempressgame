import { Heading, Text } from '@chakra-ui/layout'
import { Box, Checkbox } from '@chakra-ui/react'
import { Fragment, ReactNode, useContext } from 'react'
import playContext from '../context/play'
import getBg from '../service/getBg'
import { Scheme } from '../types'
import CircleSchemeView from './CircleScheme'
import Curtain from './Curtain'
import SchemesContainerView from './SchemesContainer'

export default function PalaceAreaView ({
  children,
  schemes
}: {
  children?: ReactNode
  schemes?: Scheme[]
}): JSX.Element {
  const playState = useContext(playContext)
  const full = schemes != null && schemes.length > 0
  const sorted = schemes?.sort((a, b) => a.rank - b.rank)
  const group = sorted?.map(scheme => {
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
    const color = getBg({ rank: scheme.rank, weight: 800 })
    return (
      <CircleSchemeView rank={scheme.rank} key={scheme.id}>
        <Checkbox
          borderColor={color}
          isChecked={taken}
          onChange={handleCheck}
        />
      </CircleSchemeView>
    )
  })
  const heading = children != null && <Heading size='sm'>{children}</Heading>
  return (
    <Box>
      {heading}
      <Curtain open={full} hider={<Text>Empty</Text>}>
        <SchemesContainerView>{group}</SchemesContainerView>
      </Curtain>
    </Box>
  )
}
