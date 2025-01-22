import Stripe from 'stripe';

declare module 'stripe' {
  export interface CustomCharge extends Stripe.Charge {
    metadata: {
      orderId: string;
    };
  }
}
