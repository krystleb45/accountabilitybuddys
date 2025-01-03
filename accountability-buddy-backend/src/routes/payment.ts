import express, { Request, Response } from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware";
import logger from "../utils/winstonLogger"; // Use a logger utility

const router = express.Router();

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key is not defined in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-10-28" });

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests. Please try again later.",
});

router.use("/webhook", bodyParser.raw({ type: "application/json" }));

router.post(
  "/create-payment-intent",
  authMiddleware,
  rateLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount, currency } = req.body;

      if (!amount || !currency) {
        return res.status(400).json({ error: "Amount and currency are required." });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: { userId: req.user?.id || "unknown" },
      });

      res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Payment creation error: ${errorMessage}`);
      res.status(500).json({ error: "Failed to create payment intent." });
    }
  }
);

router.post(
  "/create-session",
  authMiddleware,
  rateLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { priceId } = req.body;

      if (!priceId) {
        return res.status(400).json({ success: false, message: "Price ID is required" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: req.user?.email,
        client_reference_id: req.user?.id,
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });

      res.json({ success: true, sessionId: session.id });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error creating Stripe session: ${errorMessage}`);
      res.status(500).json({ success: false, message: "Failed to create payment session" });
    }
  }
);

router.post(
  "/webhook",
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      return res.status(400).send("Webhook Error: Missing Stripe signature.");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Webhook signature verification failed: ${errorMessage}`);
      return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }

    try {
      switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        logger.info(`Payment successful for session: ${session.id}`);
        // TODO: Handle post-payment logic
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        logger.info(`Payment succeeded for invoice: ${invoice.id}`);
        // TODO: Handle subscription renewal logic
        break;

      case "invoice.payment_failed":
        const invoiceFailed = event.data.object as Stripe.Invoice;
        logger.error(`Payment failed for invoice: ${invoiceFailed.id}`);
        // TODO: Handle subscription payment failure
        break;

      default:
        logger.warn(`Unhandled event type: ${event.type}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error handling event ${event.type}: ${errorMessage}`);
      return res.status(500).send("Server error while processing event.");
    }

    res.json({ received: true });
  }
);

export default router;
