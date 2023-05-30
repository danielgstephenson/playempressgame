import { Functions, HttpsCallableResult } from 'firebase/functions'
import { FC } from 'react'

export type CloudCaller = <Props> (props?: Props) => Promise<HttpsCallableResult<unknown> | undefined>

export interface ConsumerWriterProps <Props extends {}> {
  fn: string
  label: string
  onCall?: (caller: CloudCaller, props: Props) => Promise<void>
  props?: Props
}

export interface CreatedWriterProps <Props extends {}> extends ConsumerWriterProps<Props> {
  functions?: Functions
}

export interface WriterProps <Props extends {}> extends CreatedWriterProps<Props> {
  WriteConsumer: FC
}

export interface WriteProviderProps <Props extends {}> extends WriterProps<Props> {
  functions: Functions
}

export interface WriteState {
  write?: () => Promise<void>
  loading?: boolean
  error?: Error | undefined
  label?: string
}

export interface WriterComponentProps {
  onClick?: () => void
  label: string
  loading?: boolean
  error?: Error
  errorMessage?: string
}
export type WriterComponent = FC<WriterComponentProps>
