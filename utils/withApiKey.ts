import { NextApiRequest, NextApiResponse } from 'next'

export function withApiKey(handler: (req: NextApiRequest, res: NextApiResponse) => void) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const apiKey = req.headers['x-api-key']
    if (!apiKey) {
      return res.status(403).json({ error: 'No API key provided' })
    }
    if (apiKey !== process.env.APP_API_KEY) {
      return res.status(403).json({ error: 'Invalid API key' })
    }
    return handler(req, res)
  }
}