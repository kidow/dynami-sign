import { IItem } from 'types'

export const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://dynamisign.com'

export const theme: Array<IItem> = [{ name: 'light' }, { name: 'dark' }]
export const fileType: Array<IItem> = [{ name: 'png' }, { name: 'jpeg' }]
export const basicImage =
  'https://raw.githubusercontent.com/kidow/dynami-sign/cb400c00901b54c282a9a1dd66b89aa87c5c3680/public/media/logo-initial.svg'
