import type { Vehicle, Status } from "./db";

export function maxMaintenanceAllowed(total: number) {
  return Math.max(1, Math.floor(total * 0.05));
}

export function countMaintenance(list: Vehicle[]) {
  return list.filter((v) => v.status === "Maintenance").length;
}

export function canChangeStatus(before: Vehicle, next: Status) {
  if (before.status === "Maintenance" && next !== "Available") return false;
  return true;
}
