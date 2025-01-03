import { Request, Response, NextFunction } from "express-serve-static-core";
import logger from "../utils/winstonLogger";

// Define the available languages
const availableLanguages = ["en", "de", "es", "fr", "jp"];

// Extend the Express Request object to include the `lang` property
declare module "express" {
  interface Request {
    lang?: string;
  }
}

/**
 * Middleware to switch language based on user preference.
 * Checks `Accept-Language` header, cookies, or query parameters for language selection.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
const languageSwitcher = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Extract language preference from headers, cookies, or query parameters
    let lang: string | undefined =
      req.headers["accept-language"] ||
      req.cookies?.lang ||
      (req.query["lang"] as string);

    // Normalize the language code (e.g., 'en-US' to 'en')
    if (lang) {
      lang = lang.split("-")[0].toLowerCase();
    }

    // Set the language to the requested one if available, otherwise default to 'en'
    req.lang = lang && availableLanguages.includes(lang) ? lang : "en";

    // Optionally, set a cookie to store the language preference
    res.cookie("lang", req.lang, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "lax", // Mitigate CSRF risks
    });

    next();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Error in languageSwitcher middleware: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "An error occurred while setting language preferences",
    });
  }
};

export default languageSwitcher;
