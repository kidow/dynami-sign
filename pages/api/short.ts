import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { supabase } from 'services'
import shortid from 'shortid'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const short_id = req.query.id as string
  if (!short_id)
    return res.status(400).json({ message: 'short_id is missing.' })
  if (!shortid.isValid(short_id))
    return res.status(400).json({ message: 'short_id is not matched.' })

  try {
    const { data, error } = await supabase
      .from('uploads')
      .select('image_url')
      .eq('short_id', short_id)
      .single()
    if (error) return res.status(400).json({ message: 'supabase error' })
    const response = await axios.get(data.image_url, {
      responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(response.data, 'utf-8')
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/png')
    res.setHeader(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
    )
    res.end(buffer)
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>')
    console.error(err)
  }
}
