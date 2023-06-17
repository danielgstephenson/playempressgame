import { Card, CardProps } from '@chakra-ui/react'
import { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import { forwardRef } from 'react'
import SchemeContentView from './SchemeContent'
import schemes from '../schemes.json'

function View ({
  children,
  rank,
  ...otherProps
}: {
  children?: React.ReactNode
  rank: number
} &
Partial<DraggableProvidedDragHandleProps> &
Partial<DraggableProvidedDraggableProps> &
CardProps,
ref: React.Ref<HTMLDivElement>
): JSX.Element {
  const scheme = schemes[rank]
  const bg = `${scheme.color.toLowerCase()}.100`
  return (
    <Card
      bg={bg}
      ref={ref}
      w='48%'
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
