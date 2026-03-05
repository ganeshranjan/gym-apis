import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import app from "./app";
import prisma from "./lib/prisma";

const PORT = process.env.PORT || 3001;

async function startServer() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database");
    console.error(error);
    process.exit(1);
  }
}

startServer();
