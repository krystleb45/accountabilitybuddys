import Twilio from "twilio";

// Load environment variables
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

// Ensure required environment variables are set
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  throw new Error(
    "Twilio configuration error: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in environment variables."
  );
}

// Initialize Twilio client
const twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export default twilioClient;
