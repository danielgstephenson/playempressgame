import { Card, CardBody, CardProps, forwardRef } from '@chakra-ui/react'
import { ReactNode, Ref } from 'react'

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
  const minHeight = children == null ? undefined : '135px'
  const sx = active === true
    ? undefined
    : children == null
      ? { aspectRatio: '3 / 4 !important' }
      : { aspectRatio: '1 / 1.35 !important' }
  const minW = 'min(19vw, 69px)'
  const w = active === true ? undefined : '19%'
  return (
    <Card
      sx={sx}
      ref={ref}
      minW={minW}
      w={w}
      minH={minHeight}
      h={minHeight}
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
