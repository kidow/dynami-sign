import Head from 'next/head'

interface State {
  title: string
  description: string
}

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://dynamisign.com'
const title = 'DynamiSign'
const description = 'Dynamic open graph image maker'
const image = `${baseURL}/api/sign`

const HomePage = () => {
  return (
    <>
      <Head>
        <title>DynamiSign</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={baseURL} />
        <meta property="og:image" content={image} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />
        <meta property="twitter:domain" content={baseURL} />
      </Head>

      <div className="container mx-auto">
        <div>Dynami Sign</div>
        <div>
          <img src={image} />
        </div>
      </div>
    </>
  )
}

export default HomePage
