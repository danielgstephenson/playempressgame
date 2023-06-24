import { Card, CardBody, CardProps, forwardRef } from '@chakra-ui/react'
import { ReactNode, Ref } from 'react'

function View ({
  children,
  ...cardProps
}: {
  children?: ReactNode
} & CardProps,
ref: Ref<HTMLDivElement>
): JSX.Element {
  const minHeight = children == null ? undefined : '105px'
  return (
    <Card
      style={{ aspectRatio: '3 / 4' }}
      ref={ref}
      w='19%'
      minW='60px'
      minH={minHeight}
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
