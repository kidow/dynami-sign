import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import { authState } from 'store'

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

export function useToast() {
  const { addToast } = useToasts()
  const success = (content: string) =>
    addToast(content, { appearance: 'success' })
  const info = (content: string) => addToast(content, { appearance: 'info' })
  const error = (content: string) => addToast(content, { appearance: 'error' })
  const warning = (content: string) =>
    addToast(content, { appearance: 'warning' })
  return { success, info, error, warning }
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

export const useUser = () => {
  const user = useRecoilValue(authState)
  const setUser = useSetRecoilState(authState)
  const resetUser = useResetRecoilState(authState)
  return { user, setUser, resetUser }
}
