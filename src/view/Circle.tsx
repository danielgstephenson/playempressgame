import { Circle, SquareProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

function View ({
  children,
  ...circleProps
}: {
  children?: React.ReactNode
} & SquareProps,
ref: React.Ref<HTMLDivElement>
): JSX.Element {
  return (
    <Circle
      ref={ref}
      size='25px'
      {...circleProps}
    >
      {children}
    </Circle>
  )
}
const CircleView = forwardRef(View)
export default CircleView
