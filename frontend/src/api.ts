import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

export type Status = "Available" | "InUse" | "Maintenance";

export interface Vehicle {
  id: string;
  licensePlate: string;
  status: Status;
  createdAt: string;
}
