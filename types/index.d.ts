import { ScreenshotOptions } from 'puppeteer-core'

export interface Params {
  /**
   * title
   */
  t: string
  /**
   * description
   */
  d: string
  /**
   * theme
   */
  m: 'dark' | 'light'
  y: ScreenshotOptions['type']
}

export interface IItem {
  name: string
}

export type MaxWidth =
  | 'container'
  | 'max-w-screen-2xl'
  | 'max-w-screen-xl'
  | 'max-w-screen-lg'
  | 'max-w-screen-md'
  | 'max-w-screen-sm'
  | 'max-w-full'
  | 'max-w-7xl'
  | 'max-w-6xl'
  | 'max-w-5xl'
  | 'max-w-4xl'
  | 'max-w-3xl'
  | 'max-w-2xl'
  | 'max-w-xl'
  | 'max-w-lg'
  | 'max-w-md'
  | 'max-w-sm'
  | 'max-w-xs'
