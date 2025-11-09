import fs from "fs";
import path from "path";

const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, "..", "data", "vehicles.json");

export type Status = "Available" | "InUse" | "Maintenance";

export interface Vehicle {
  id: string;
  licensePlate: string;
  status: Status;
  createdAt: string; // ISO date
}

function read(): Vehicle[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // create file if it doesn’t exist
      fs.writeFileSync(DB_PATH, "[]", "utf-8");
      return [];
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8").trim();
    if (!raw) return []; // empty file
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read DB:", err);
    return [];
  }
}

function write(all: Vehicle[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(all, null, 2));
}

export const db = {
  all(): Vehicle[] {
    return read();
  },
  save(all: Vehicle[]) {
    write(all);
  },
};
