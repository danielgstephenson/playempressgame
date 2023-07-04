import { TimeIcon } from '@chakra-ui/icons'
import { IconButtonProps } from '@chakra-ui/react'
import TopPopoverIconButtonView from './TopPopoverIconButton'

export default function WaitingButtonView (props: IconButtonProps): JSX.Element {
  return (
    <TopPopoverIconButtonView bg='white' color='black' _hover={{ bg: 'lightgray' }} icon={<TimeIcon />} {...props}>
      {props['aria-label']}
    </TopPopoverIconButtonView>
  )
}
