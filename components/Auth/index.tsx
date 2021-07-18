import { useEffect } from 'react'
import { FunctionComponent } from 'react'
import { supabase, useUser } from 'services'

interface Props {}
interface State {}

const ReAuth: FunctionComponent<Props> = ({ children }) => {
  const { user, setUser } = useUser()
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && !!session) {
        setUser(session.user)
      }
    })
    const currentUser = supabase.auth.user()
    if (!user && !!currentUser) setUser(currentUser)
  }, [])
  return <>{children}</>
}

export default ReAuth
