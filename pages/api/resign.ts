import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from 'services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = JSON.parse(req.body).uid
  if (!uid) return res.status(400).json({ error: 'Missing uid' })
  const { error } = await supabase.auth.api.deleteUser(
    uid,
    process.env.SUPABASE_KEY
  )
  if (error) {
    console.error(error)
    res.status(400).json(error)
  }
}
