import { CardProps } from '@chakra-ui/card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ExpandableSchemeView from './ExpandableScheme'

export default function SortableSchemeView ({
  children,
  id,
  index,
  rank,
  ...styleProps
}: {
  children?: React.ReactNode
  id: string
  index: number
  rank: number
} & CardProps): JSX.Element {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })

  return (
    <ExpandableSchemeView
      isDragging={isDragging}
      rank={rank}
      ref={setNodeRef}
      transform={CSS.Transform.toString(transform)}
      transition={transition}
      {...styleProps}
      {...attributes}
      {...listeners}
    >
      {children}
    </ExpandableSchemeView>
  )
};
