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
  const lengthProps = length > 5 ? { minHeight: 'min(21dvh, 175px)', overflow: 'auto' } : { minHeight: 'auto' }
  return (
    <SchemesContainerView
      ref={ref}
      maxHeight='175px'
      {...lengthProps}
      {...otherProps}
      overflowX='clip'
      sx={{
        'scrollbar-width': 'auto',
        '&::-webkit-scrollbar': {
          width: 'auto',
          borderRadius: '5px',
          backgroundColor: 'gray.700'
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '5px',
          backgroundColor: 'gray.500'
        }
      }}
    >
      {children}
    </SchemesContainerView>
  )
}

const SmallSchemesContainerView = forwardRef(View)
export default SmallSchemesContainerView
