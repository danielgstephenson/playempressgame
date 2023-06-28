import { Card, CardBody, CardProps, forwardRef } from '@chakra-ui/react'
import { ReactNode, Ref } from 'react'
import { SCHEME_WIDTH } from '../constants'

function View ({
  active,
  children,
  ...cardProps
}: {
  active?: boolean
  children?: ReactNode
} & CardProps,
ref: Ref<HTMLDivElement>
): JSX.Element {
  const sx = { aspectRatio: '3/4' }
  return (
    <Card
      sx={sx}
      ref={ref}
      w={SCHEME_WIDTH}
      {...cardProps}
    >
      <CardBody px='3px' py='4px'>
        {children}
      </CardBody>
    </Card>
  )
}

const SmallSchemeView = forwardRef(View)
export default SmallSchemeView
