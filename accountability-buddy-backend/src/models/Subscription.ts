import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  isActive: unknown;
  user: mongoose.Types.ObjectId;
  status:
    | "trial"
    | "active"
    | "inactive"
    | "expired"
    | "past_due"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "unpaid";
  plan: "free-trial" | "basic" | "standard" | "premium";
  trialEnd?: Date;
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  provider: "stripe" | "paypal";
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: [
        "trial",
        "active",
        "inactive",
        "expired",
        "past_due",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "unpaid",
      ],
      default: "trial",
    },
    plan: {
      type: String,
      enum: ["free-trial", "basic", "standard", "premium"],
      default: "free-trial",
    },
    trialEnd: { type: Date },
    subscriptionStart: { type: Date },
    subscriptionEnd: { type: Date },
    provider: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
    },
  },
  { timestamps: true },
);

SubscriptionSchema.pre<ISubscription>("save", function (next) {
  try {
    if (this.subscriptionEnd && new Date(this.subscriptionEnd) < new Date()) {
      this.status = "expired";
    }
    next();
  } catch (error) {
    // Cast error to Error
    const err = error instanceof Error ? error : new Error(String(error));
    next(err);
  }
});

const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema,
);

export default Subscription;
