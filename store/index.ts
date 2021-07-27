import { User } from '@supabase/supabase-js'
import { atom } from 'recoil'
import { TUpload } from 'types'

export const authState = atom<User | null>({
  key: 'authState',
  default: null,
  dangerouslyAllowMutability: true
})

export const imageState = atom<Array<TUpload>>({
  key: 'imageState',
  default: []
})
