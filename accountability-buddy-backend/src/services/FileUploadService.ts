import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/winstonLogger";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const s3 = new AWS.S3();

interface File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

const FileUploadService = {
  /**
   * Upload a file to S3
   * @param file - File object (e.g., from Multer)
   * @returns Upload result containing URL and key
   */
  uploadToS3: async (file: File): Promise<{ success: boolean; url: string; key: string }> => {
    try {
      if (!file || !file.buffer || !file.originalname) {
        throw new Error("Invalid file input");
      }

      const uniqueFileName = `${uuidv4()}-${file.originalname}`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET as string,
        Key: uniqueFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "private", // Adjust based on your needs (e.g., 'public-read' for public files)
        ContentDisposition: "inline",
      };

      const data = await s3.upload(params).promise();

      logger.info(`File uploaded to S3: ${data.Location}`);

      return {
        success: true,
        url: data.Location,
        key: data.Key,
      };
    } catch (error: unknown) {
      logger.error(`Error uploading file to S3: ${(error as Error).message}`);
      throw new Error("File upload failed");
    }
  },

  /**
   * Delete a file from S3
   * @param fileKey - S3 key of the file to delete
   * @returns Result of file deletion
   */
  deleteFromS3: async (fileKey: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!fileKey) {
        throw new Error("File key is required for deletion");
      }

      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: process.env.S3_BUCKET as string,
        Key: fileKey,
      };

      await s3.deleteObject(params).promise();

      logger.info(`File deleted from S3: ${fileKey}`);

      return { success: true, message: "File deleted successfully" };
    } catch (error: unknown) {
      logger.error(`Error deleting file from S3: ${(error as Error).message}`);
      throw new Error("File deletion failed");
    }
  },

  /**
   * Generate a signed URL for accessing files securely
   * @param fileKey - S3 key of the file
   * @param expires - Expiration time for the signed URL in seconds
   * @returns Signed URL
   */
  generateSignedUrl: (fileKey: string, expires: number = 60 * 5): string => {
    try {
      if (!fileKey) {
        throw new Error("File key is required to generate a signed URL");
      }

      const params: AWS.S3.GetObjectRequest & { Expires: number } = {
        Bucket: process.env.S3_BUCKET as string,
        Key: fileKey,
        Expires: expires,
      };

      const signedUrl = s3.getSignedUrl("getObject", params);

      logger.info(`Signed URL generated for file: ${fileKey}`);

      return signedUrl;
    } catch (error: unknown) {
      logger.error(`Error generating signed URL for file: ${(error as Error).message}`);
      throw new Error("Failed to generate signed URL");
    }
  },
};

export default FileUploadService;
