import { CardProps, Heading } from '@chakra-ui/react'
import getBg from '../service/getBg'
import TinySchemeView from './TinyScheme'

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
      <Heading size='xs' fontSize='xs'>{rank}</Heading>
    </TinySchemeView>
  )
}
