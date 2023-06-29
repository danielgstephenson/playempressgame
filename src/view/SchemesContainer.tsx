import { Flex, FlexProps } from '@chakra-ui/react'
import { forwardRef, ReactNode, Ref } from 'react'

function View ({
  children,
  ...otherProps
}: {
  children: ReactNode
} & FlexProps,
ref: Ref<HTMLDivElement>): JSX.Element {
  return (
    <Flex
      flexWrap='wrap'
      gap='2px'
      ref={ref}
      rowGap='2px'
      {...otherProps}
    >
      {children}
    </Flex>
  )
}

const SchemesContainerView = forwardRef(View)
export default SchemesContainerView
