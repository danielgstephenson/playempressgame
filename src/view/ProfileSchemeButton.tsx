import { VStack, Box, ButtonProps } from '@chakra-ui/react'
import GridButton from './GridButton'
import SchemeIcon from './SchemeIcon'

export default function ProfileSchemeButtonView ({
  rank,
  ...restProps
}: {
  rank: number
} & ButtonProps): JSX.Element {
  return (
    <GridButton h='fit-content' p='2px' {...restProps}>
      <VStack spacing='1px' pb='1px'>
        <Box>{rank}</Box>
        <SchemeIcon rank={rank} />
      </VStack>
    </GridButton>
  )
}
