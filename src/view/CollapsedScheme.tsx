import { CardProps, forwardRef, Heading, HStack, Stack } from '@chakra-ui/react'
import SmallScheme from './SmallScheme'
import schemes from '../schemes.json'
import getBg from '../service/getBg'
import { ReactNode, Ref } from 'react'
import RankCircleView from './RankCircle'

function View ({
  children,
  isDragging,
  rank,
  ...cardProps
}: {
  children?: ReactNode
  isDragging?: boolean
  rank: number
} & CardProps,
ref: Ref<HTMLDivElement>): JSX.Element {
  const scheme = schemes[rank]
  if (scheme == null) {
    return <></>
  }
  const mediumTime = Array.from(
    { length: scheme.time },
    (_, index) => <Heading key={index} size='sm' m='0'>X</Heading>
  )
  const weight = isDragging === true ? 800 : 700
  const cardBg = getBg({ rank, weight })
  const circleBg = getBg({ rank: scheme.rank, weight: 900 })
  return (
    <SmallScheme
      bg={cardBg}
      ref={ref}
      {...cardProps}
    >
      <Stack height='100%' spacing='2px'>
        <HStack color={circleBg} spacing='2px'>
          <RankCircleView bg={circleBg} rank={scheme.rank} />
          {mediumTime}
        </HStack>
        <Heading size='xs'>{scheme.title}</Heading>
        {children}
      </Stack>
    </SmallScheme>
  )
}

const CollapsedSchemeView = forwardRef(View)
export default CollapsedSchemeView
