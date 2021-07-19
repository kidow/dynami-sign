import { NextApiRequest, NextApiResponse } from 'next'
import { Params } from 'types'
import { getHtml, getScreenshot } from 'utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const title = (req.query.t as string) || '다이나미사인'
  const description = (req.query.d as string) || ''
  const theme = (req.query.m as Params['m']) || 'light'
  const fileType = (req.query.y as Params['y']) || 'png'
  let images = (req.query.i as Params['i']) || []
  if (typeof images === 'string') images = [images]
  try {
    const html = getHtml({
      t: title,
      d: description,
      m: theme,
      i: images.map((item) => encodeURI(item))
    })
    const file = await getScreenshot(html, fileType)
    res.statusCode = 200
    res.setHeader('Content-Type', `image/${fileType}`)
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
