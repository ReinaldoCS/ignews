import { NextApiRequest, NextApiResponse } from 'next';

import { Readable } from 'stream'
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed'
]);

export default async function (request: NextApiRequest , response: NextApiResponse) {
  if (request.method === 'POST') {
    const buf = await buffer(request)
    const secret = request.headers['stripe-signature']

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      return response.status(400).json({WebhooksError: error.message});
    }

    const { type } = event;

    if (!relevantEvents.has(type)) {
      // fazer algo
      console.log('evento recebido', event)
    }
  
    response.status(200).json({ received:true })
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}