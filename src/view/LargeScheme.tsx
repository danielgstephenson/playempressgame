import { Card, CardBody, CardProps } from '@chakra-ui/react'
import { SCHEME_RATIO } from '../constants'

export default function LargeSchemeView ({
  children,
  ...restProps
}: {
  children?: React.ReactNode
} & CardProps): JSX.Element {
  return (
    <Card h='500px' sx={{ aspectRatio: SCHEME_RATIO }} {...restProps}>
      <CardBody padding='10px'>
        {children}
      </CardBody>
    </Card>
  )
}
