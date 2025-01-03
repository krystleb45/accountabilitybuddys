import mongoose from "mongoose";
import Role from "../models/Role"; // Corrected import path
import dotenv from "dotenv";
import logger from "../utils/winstonLogger"; // Corrected logger import path

dotenv.config();

// Define the type for roles to be seeded
interface SeedRole {
  roleName: string;
  permissions: string[];
}

const seedRoles = async (): Promise<void> => {
  if (!process.env.MONGO_URI) {
    logger.error("Error: MONGO_URI is not defined in the environment variables.");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to MongoDB");

    // Define roles to seed
    const roles: SeedRole[] = [
      { roleName: "admin", permissions: ["manage_users", "view_reports"] },
      { roleName: "user", permissions: ["view_content"] },
    ];

    // Seed roles if they do not exist
    for (const role of roles) {
      const existingRole = await Role.findOne({ roleName: role.roleName });
      if (!existingRole) {
        await Role.create(role);
        logger.info(`Created role: ${role.roleName}`);
      } else {
        logger.info(`Role already exists: ${role.roleName}`);
      }
    }

    logger.info("Roles seeded successfully");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error seeding roles: ${error.message}`);
    } else {
      logger.error("An unknown error occurred during role seeding");
    }
  } finally {
    // Ensure the connection is closed
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
};

// Handle process termination and ensure disconnection
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  logger.info("Disconnected from MongoDB due to process termination");
  process.exit(0);
});

// Execute the seeding function
seedRoles();
