import 'styles/globals.css'
import App from 'next/app'
import { ErrorInfo } from 'react'
import { ReAnalytics } from 'components'
import { ToastProvider } from 'react-toast-notifications'

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
        <ToastProvider autoDismiss placement="top-center">
          <Component {...pageProps} />
        </ToastProvider>
      </ReAnalytics>
    )
  }
}

export default MyApp
