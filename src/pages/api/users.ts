import { NextApiRequest, NextApiResponse } from 'next';

export default function users(request: NextApiRequest, response: NextApiResponse) {
  const user = [
    {id: 1, name: 'Reinaldo'},
    {id: 1, name: 'Correia'},
    {id: 1, name: 'Santos'},
  ]

  return response.json(user);
}