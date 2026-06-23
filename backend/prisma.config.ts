
import "dotenv/config";
import { defineConfig } from "prisma/config";
import { envVerse } from "./src/config/env";

export default defineConfig({
  // migration will be in this folder for all the '.schema' files
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: envVerse.DATABASE_URL,
  },
});
