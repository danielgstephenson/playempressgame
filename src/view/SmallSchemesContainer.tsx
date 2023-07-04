import { FlexProps } from '@chakra-ui/react'
import { forwardRef, ReactNode, Ref } from 'react'
import SchemesContainerView from './SchemesContainer'

function View ({
  children,
  length,
  ...otherProps
}: {
  children: ReactNode
  length: number
} & FlexProps,
ref: Ref<HTMLDivElement>): JSX.Element {
  const lengthProps = length > 5 ? { minHeight: '125px', overflow: 'auto' } : {}
  return (
    <SchemesContainerView
      ref={ref}
      {...lengthProps}
      {...otherProps}
    >
      {children}
    </SchemesContainerView>
  )
}

const SmallSchemesContainerView = forwardRef(View)
export default SmallSchemesContainerView
