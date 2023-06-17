import { Card, CardProps } from '@chakra-ui/react'
import { forwardRef } from 'react'
import getBg from '../service/getBg'
import SchemeContentView from './SchemeContent'

function View ({
  children,
  isDragging,
  rank,
  ...otherProps
}: {
  children?: React.ReactNode
  isDragging?: boolean
  rank: number
} &
CardProps,
ref: React.Ref<HTMLDivElement>
): JSX.Element {
  const weight = isDragging === true ? 200 : 100
  const bg = getBg({ rank, weight })
  const height = children == null ? '370px' : '400px'
  return (
    <Card
      bg={bg}
      ref={ref}
      w='230px'
      height={height}
      {...otherProps}
    >
      <SchemeContentView rank={rank}>
        {children}
      </SchemeContentView>
    </Card>
  )
}
const SchemeView = forwardRef(View)
export default SchemeView
