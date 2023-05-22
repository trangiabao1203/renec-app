import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const proxyApiRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.apiUrl}${req.url}`,
      data: req.body,
      headers: req.headers,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying API request:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.status(200).end();
  } else {
    // Proxy the API request
    await proxyApiRequest(req, res);
  }
}
