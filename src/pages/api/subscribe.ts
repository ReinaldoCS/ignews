import { Query } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';
import { fauna } from '../../services/fauna';
import { query as q } from 'faunadb';

import { stripe } from '../../services/stripe';


interface User {
  ref: {
    id: string;
  }

  data: {
    stripe_customer_id: string;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default  async (request: NextApiRequest, response: NextApiResponse) => {

  if (request.method === 'POST') {


    const session = await getSession({ req: request });

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let stripeCustomerId = user.data.stripe_customer_id;

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      })
    
    await fauna.query(
      q.Update(
        q.Ref(q.Collection('users'), user.ref.id),
        {
          data: {
            stripe_customer_id: stripeCustomer.id,
          }
        }
      )
    )

    stripeCustomerId = stripeCustomer.id;
  }

  const stripeCheckoutSession = await stripe.checkout.sessions.create({
    success_url: process.env.STIPE_SUCCESS_URL,
    cancel_url: process.env.STIPE_CANCEL_URL,
    line_items: [
      { price: process.env.PRODUCT_ID, quantity: 1 }
    ],
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    allow_promotion_codes: true,
    mode: 'subscription',
    customer: stripeCustomerId,
  });

    return response.status(200).json({ sessionId: stripeCheckoutSession.id });

  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}