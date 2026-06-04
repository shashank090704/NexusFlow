import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient,Prisma } from "@prisma/client"; 
import pg from 'pg'; // Add this import

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:mysecretpassword@localhost:5432/zapier";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export { prisma }
export * from "@prisma/client";
export type { Prisma  } from "@prisma/client";
export type JsonObject = Prisma.JsonObject;