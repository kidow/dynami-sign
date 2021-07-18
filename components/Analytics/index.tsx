import { FunctionComponent, useEffect } from 'react'
import Head from 'next/head'

interface Props {}

const ReAnalytics: FunctionComponent<Props> = ({ children }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      window.dataLayer = window.dataLayer || []
      function gtag() {
        window.dataLayer.push(arguments)
      }
      // @ts-ignore
      gtag('js', new Date())
      // @ts-ignore
      gtag('config', 'G-G4WMM79303', {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: window.document.title
      })
    }
  }, [])
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>
  }
  return (
    <>
      <Head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-G4WMM79303"
        />
      </Head>
      {children}
    </>
  )
}

export default ReAnalytics
