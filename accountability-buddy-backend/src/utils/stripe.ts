import Stripe from "stripe";

// Initialize Stripe with API Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

export default stripe;