import { User } from '@supabase/supabase-js'
import { atom } from 'recoil'

export const authState = atom<User | null>({
  key: 'authState',
  default: null,
  dangerouslyAllowMutability: true
})
