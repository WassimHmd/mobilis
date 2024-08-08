import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// test connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

// Call the function to test the connection
testConnection();

export default prisma;
