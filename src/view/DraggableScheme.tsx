import { CardProps } from '@chakra-ui/card'
import useDndDraggable from '../use/DndDraggable'
import ExpandableSchemeView from './ExpandableScheme'

export default function DraggableSchemeView ({
  active = false,
  children,
  id,
  rank,
  ...styleProps
}: {
  active?: boolean
  children?: React.ReactNode
  id: string
  rank: number
} & CardProps): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    style
  } = useDndDraggable({ id })

  return (
    <ExpandableSchemeView
      active={active}
      rank={rank}
      ref={setNodeRef}
      style={style}
      {...styleProps}
      {...attributes}
      {...listeners}
    >
      {children}
    </ExpandableSchemeView>
  )
};
