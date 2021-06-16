import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from 'next/document'
import { Children } from 'react'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: Children.toArray(initialProps.styles)
    }
  }
  render() {
    return (
      <Html lang="ko" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#030cf0" />
          <meta name="robots" content="index, follow" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="msapplication-TileColor" content="#030cf0" />
        </Head>
        <body className="bg-gray-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
