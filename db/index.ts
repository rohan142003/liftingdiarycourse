import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const db = process.env.DATABASE_URL
  ? drizzle(process.env.DATABASE_URL, { schema })
  : (undefined as unknown as NeonHttpDatabase<typeof schema>);

export { db };
