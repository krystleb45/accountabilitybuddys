import mongoose, { Schema, Document, Types, Model, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Payload type for the user
export interface UserPayload {
  id: string;
  role: "user" | "admin" | "moderator";
  isAdmin?: boolean;
}

// Settings interface
export interface UserSettings {
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  privacy?: {
    profileVisibility?: "public" | "friends" | "private";
    searchVisibility?: boolean;
  };
}

// User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin" | "moderator";
  isVerified: boolean;
  isLocked?: boolean; // Lock status
  active: boolean; // Active status
  profilePicture?: string;
  friends: Types.ObjectId[];
  friendRequests: Types.ObjectId[];
  points?: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  subscriptions?: Types.ObjectId[];
  settings?: UserSettings;
  twoFactorSecret?: string; // Added for 2FA functionality

  comparePassword(candidatePassword: string): Promise<boolean>;
  generateResetToken(): string;
}

// Define the schema
const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false }, // Lock status
    active: { type: Boolean, default: true }, // Active status
    profilePicture: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    points: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }],
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ["public", "friends", "private"],
          default: "public",
        },
        searchVisibility: { type: Boolean, default: true },
      },
    },
    twoFactorSecret: { type: String }, // Added for 2FA functionality
  },
  { timestamps: true }
);

// Pre-save hook to hash passwords
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate a reset token
UserSchema.methods.generateResetToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

// Export the model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
