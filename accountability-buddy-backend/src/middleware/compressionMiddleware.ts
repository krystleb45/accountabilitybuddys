import compression from "compression";
import { Request, Response} from "express";

/**
 * Middleware for request compression using gzip and Brotli.
 */
const compressionMiddleware = compression({
  // Filter responses to compress based on Content-Type
  filter: (req: Request, _res: Response): boolean => {
    const contentType = req.headers["content-type"] || ""; // Fixed 'headers' error by enforcing Express's Request type

    // Compress text, JSON, CSS, JavaScript, and HTML content
    const compressibleTypes = [
      "text/",
      "application/json",
      "application/javascript",
      "text/css",
      "text/html",
    ];

    return compressibleTypes.some((type) =>
      contentType.toString().includes(type),
    );
  },

  threshold: 1024, // Compress responses larger than 1 KB
});

export default compressionMiddleware;
