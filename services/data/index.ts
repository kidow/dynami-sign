import { IItem } from 'types'

export const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://dynamisign.com'

export const theme: Array<IItem> = [{ name: 'light' }, { name: 'dark' }]
export const fileType: Array<IItem> = [{ name: 'png' }, { name: 'jpeg' }]
