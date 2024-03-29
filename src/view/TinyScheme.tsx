import { Card, CardBody, CardProps } from '@chakra-ui/react'
import TinySchemeCenter from './TinySchemeCenter'

export default function TinySchemeView ({
  children,
  ...restProps
}: {
  children?: React.ReactNode
} & CardProps): JSX.Element {
  return (
    <Card
      borderRadius='4px'
      w='fit-content'
      {...restProps}
    >
      <CardBody w='fit-content' p='0'>
        <TinySchemeCenter>
          {children}
        </TinySchemeCenter>
      </CardBody>
    </Card>
  )
}
