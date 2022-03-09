import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { stripe } from '../../services/stripe';

// eslint-disable-next-line import/no-anonymous-default-export
export default  async (request: NextApiRequest, response: NextApiResponse) => {

  const session = await getSession({ req: request });

  const stripeCustomer = await stripe.customers.create({
    email: session.user.email,
    // metadata
  })

  if(request.method === 'POST') {
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      success_url: process.env.STIPE_SUCCESS_URL,
      cancel_url: process.env.STIPE_CANCEL_URL,
      line_items: [
        { price: process.env.PRODUCT_ID, quantity: 1 }
      ],
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      customer: stripeCustomer.id,
    });
    return response.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}