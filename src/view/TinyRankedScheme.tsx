import { CardProps, Heading, VStack } from '@chakra-ui/react'
import getBg from '../service/getBg'
import TinySchemeView from './TinyScheme'
import SchemeIconView from './SchemeIcon'

export default function TinyRankedSchemeView ({
  children,
  rank,
  ...restProps
}: {
  children?: React.ReactNode
  rank: number
} & CardProps): JSX.Element {
  const bg = getBg({ rank })
  return (
    <TinySchemeView
      bg={bg}
      {...restProps}
    >
      <VStack spacing='1px' pb='1px'>
        <Heading size='xs' fontSize='xs'>{rank}</Heading>
        <SchemeIconView rank={rank} />
      </VStack>
    </TinySchemeView>
  )
}
