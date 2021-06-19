import { NextApiRequest, NextApiResponse } from 'next'
import { getHtml, getScreenshot } from 'utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const title = (req.query.title as string) || 'DynamiSign'
  const description =
    (req.query.description as string) ||
    '이미지를 동적으로 만들어 주는 서비스입니다. \n이미지 클릭 시 주소가 복사됩니다.'
  try {
    const html = getHtml({ title, description })
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
