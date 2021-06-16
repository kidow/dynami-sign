import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'

export function useObject<T>(
  initialObject: T
): [
  T,
  (obj: Partial<T>, callback?: (state: T) => void) => void,
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
] {
  const [state, setState] = useState<T>(initialObject)
  const callbackRef = useRef<(state: T) => void>()
  const isFirstCallbackCall = useRef<boolean>(true)
  const onChange = useCallback(
    (obj: Partial<T>, callback?: (state: T) => void) => {
      callbackRef.current = callback
      setState((prevState) => ({ ...prevState, ...obj }))
    },
    [state]
  )
  const onEventChange = useCallback(
    ({
      target: { name, value }
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
      setState((prevState) => ({ ...prevState, [name]: value })),
    [state]
  )
  useEffect(() => {
    if (isFirstCallbackCall.current) {
      isFirstCallbackCall.current = false
      return
    }
    callbackRef.current?.(state)
  }, [state])
  return [state, onChange, onEventChange]
}
