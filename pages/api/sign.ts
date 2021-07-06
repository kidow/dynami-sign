import { NextApiRequest, NextApiResponse } from 'next'
import { Params } from 'types'
import { getHtml, getScreenshot } from 'utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const title = (req.query.t as string) || 'DynamiSign'
  const description = (req.query.d as string) || ''
  const theme = (req.query.m as Params['m']) || 'light'
  try {
    const html = getHtml({ t: title, d: description, m: theme })
    const file = await getScreenshot(html)
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/png')
    res.setHeader(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
    )
    res.end(file)
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>')
    console.error(err)
  }
}
