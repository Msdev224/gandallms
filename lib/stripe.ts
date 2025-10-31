import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-10-29.clover',
    typescript: true,

})