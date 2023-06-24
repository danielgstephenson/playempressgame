import { forwardRef, Heading, SquareProps } from '@chakra-ui/react'
import { Ref } from 'react'
import getBg from '../service/getBg'
import CircleView from './Circle'

function View ({
  rank,
  ...circleProps
}: {
  rank: number
} & SquareProps,
ref: Ref<HTMLDivElement>): JSX.Element {
  const bg = getBg({ rank, weight: 600 })
  return (
    <CircleView
      bg={bg}
      color='white'
      ref={ref}
      {...circleProps}
    >
      <Heading size='sm'>
        {rank}
      </Heading>
    </CircleView>
  )
}
const RankCircleView = forwardRef(View)
export default RankCircleView
