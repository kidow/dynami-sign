import { NextApiRequest, NextApiResponse } from 'next'
import { getHtml, getScreenshot } from 'utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('req.url', req.url)
  // if (!req.query.html) {
  //   res.statusCode = 404
  //   res.setHeader('Content-Type', 'text/html')
  //   res.end('<h1>Not Found</h1>')
  //   return
  // }
  const title = req.query.title || 'Dynamic Sign'
  const description = req.query.description || 'Dynamic open graph image maker'
  try {
    const html = getHtml()
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
