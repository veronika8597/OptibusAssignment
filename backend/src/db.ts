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
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
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
