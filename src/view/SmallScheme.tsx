import { Card, CardBody, CardProps, forwardRef } from '@chakra-ui/react'
import { ReactNode, Ref } from 'react'
import { SCHEME_RATIO, SCHEME_WIDTH } from '../constants'

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
  const sx = { aspectRatio: SCHEME_RATIO }
  return (
    <Card
      sx={sx}
      ref={ref}
      h='fit-content'
      w={SCHEME_WIDTH}
      {...cardProps}
    >
      <CardBody px='4px' py='5px'>
        {children}
      </CardBody>
    </Card>
  )
}

const SmallSchemeView = forwardRef(View)
export default SmallSchemeView
