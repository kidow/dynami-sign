import 'styles/globals.css'
import App from 'next/app'
import { ErrorInfo } from 'react'
import { ReAnalytics, ReAuth } from 'components'
import { ToastProvider } from 'react-toast-notifications'
import { RecoilRoot } from 'recoil'

interface Props {}
interface State {
  hasError: boolean
}

class MyApp extends App<Props, {}, State> {
  state = {
    hasError: false
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error) this.setState({ hasError: true })
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    const {} = this.state
    const { Component, pageProps } = this.props
    return (
      <ReAnalytics>
        <RecoilRoot>
          <ToastProvider autoDismiss placement="top-center">
            <ReAuth>
              <Component {...pageProps} />
            </ReAuth>
          </ToastProvider>
        </RecoilRoot>
      </ReAnalytics>
    )
  }
}

export default MyApp
