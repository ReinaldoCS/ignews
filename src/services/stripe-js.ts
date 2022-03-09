import { loadStripe } from '@stripe/stripe-js';

export async function getStripeJs() {
  const stypeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST);

  return stypeJs;
}