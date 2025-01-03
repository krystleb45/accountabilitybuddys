import nodemailer from "nodemailer";
import User from "../models/User";
import Goal from "../models/Goal";
import LoggingService from "./LoggingService";
import NotificationService from "./NotificationService";

// Predefined encouraging messages for different situations
const encouragementMessages = {
  milestone: [
    "Great job reaching a milestone! You're getting closer to your goal.",
    "You're doing fantastic! Keep pushing forward.",
    "Another milestone down, you're unstoppable!",
  ],
  goalCompletion: [
    "You did it! You've accomplished your goal. Time to celebrate!",
    "Fantastic work on completing your goal! You've earned it!",
    "Goal accomplished! What’s next on your journey?",
  ],
  motivational: [
    "Don't give up! You've got this!",
    "Remember, every step forward is progress.",
    "You are capable of amazing things. Keep going!",
  ],
};

/**
 * Randomly selects an encouragement message from the specified category.
 * @param type - The type of message (e.g., 'milestone', 'goalCompletion', 'motivational').
 * @returns The randomly selected encouragement message.
 */
const getRandomMessage = (type: keyof typeof encouragementMessages): string => {
  const messages = encouragementMessages[type] || [];
  return messages.length > 0
    ? messages[Math.floor(Math.random() * messages.length)]
    : "Keep going!";
};

/**
 * Sets up the email transporter with environment-based configuration.
 * @returns Nodemailer transporter object.
 */
const setupEmailTransporter = (): nodemailer.Transporter => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    LoggingService.logError("Missing email credentials in environment variables.");
    throw new Error("EMAIL_USER and EMAIL_PASS are required for sending emails.");
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};


/**
 * Sends an encouragement email to a user.
 * @param userEmail - Recipient's email address.
 * @param subject - Email subject.
 * @param message - Email body content.
 */
const sendEncouragementEmail = async (
  userEmail: string,
  subject: string,
  message: string
): Promise<void> => {
  if (!userEmail || !subject || !message) {
    LoggingService.logError("Invalid email parameters", { userEmail, subject });
    throw new Error("Email, subject, and message are required.");
  }

  const transporter = setupEmailTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: userEmail,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    LoggingService.logInfo(`Encouragement email sent to ${userEmail}`, { subject });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    LoggingService.logError("Failed to send encouragement email", { errorMessage, userEmail });
    throw new Error("Failed to send encouragement email.");
  }
};

/**
 * Sends an in-app encouragement notification to a user.
 * @param userId - User ID.
 * @param message - Notification message.
 */
const sendEncouragementNotification = async (
  userId: string,
  message: string
): Promise<void> => {
  if (!userId || !message) {
    LoggingService.logError("Invalid notification parameters", { userId });
    throw new Error("User ID and message are required.");
  }

  try {
    await NotificationService.sendInAppNotification(userId, message);
    LoggingService.logInfo(`Encouragement notification sent to user ${userId}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    LoggingService.logError("Failed to send in-app notification", { errorMessage, userId });
    throw new Error("Failed to send in-app notification.");
  }
};

/**
 * Sends encouragement when a user reaches a milestone.
 * @param userId - User ID.
 * @param goalId - Goal ID.
 */
export const encourageMilestone = async (
  userId: string,
  goalId: string
): Promise<void> => {
  try {
    const user = await User.findById(userId);
    const goal = await Goal.findById(goalId);

    if (!user || !goal) {
      LoggingService.logError("User or goal not found", { userId, goalId });
      throw new Error("User or Goal not found.");
    }

    const message = getRandomMessage("milestone");
    const subject = `Milestone reached: ${goal.title}`;

    await sendEncouragementEmail(user.email, subject, message);
    await sendEncouragementNotification(userId, message);

    LoggingService.logInfo("Milestone encouragement sent", { userId, goalId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    LoggingService.logError("Error encouraging milestone", { errorMessage, userId, goalId });
    throw new Error("Failed to encourage milestone.");
  }
};

/**
 * Sends encouragement when a user completes a goal.
 * @param userId - User ID.
 * @param goalId - Goal ID.
 */
export const encourageGoalCompletion = async (
  userId: string,
  goalId: string
): Promise<void> => {
  try {
    const user = await User.findById(userId);
    const goal = await Goal.findById(goalId);

    if (!user || !goal) {
      LoggingService.logError("User or goal not found", { userId, goalId });
      throw new Error("User or Goal not found.");
    }

    const message = getRandomMessage("goalCompletion");
    const subject = `Goal completed: ${goal.title}`;

    await sendEncouragementEmail(user.email, subject, message);
    await sendEncouragementNotification(userId, message);

    LoggingService.logInfo("Goal completion encouragement sent", { userId, goalId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    LoggingService.logError("Error encouraging goal completion", { errorMessage, userId, goalId });
    throw new Error("Failed to encourage goal completion.");
  }
};

/**
 * Sends a general motivational boost to a user.
 * @param userId - User ID.
 */
export const sendMotivationalBoost = async (userId: string): Promise<void> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      LoggingService.logError("User not found for motivational boost", { userId });
      throw new Error("User not found.");
    }

    const message = getRandomMessage("motivational");
    const subject = "Your motivational boost!";

    await sendEncouragementEmail(user.email, subject, message);
    await sendEncouragementNotification(userId, message);

    LoggingService.logInfo("Motivational boost sent", { userId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    LoggingService.logError("Error sending motivational boost", { errorMessage, userId });
    throw new Error("Failed to send motivational boost.");
  }
};

/**
 * Sends periodic encouragement to all active users.
 */
export const sendPeriodicEncouragement = async (): Promise<void> => {
  try {
    const users = await User.find({ isActive: true });

    for (const user of users) {
      const message = getRandomMessage("motivational");
      await sendEncouragementNotification(user._id.toString(), message);
      LoggingService.logInfo("Periodic encouragement sent", { userId: user._id.toString() });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    LoggingService.logError("Error sending periodic encouragement", { errorMessage });
    throw new Error("Failed to send periodic encouragement.");
  }
};
