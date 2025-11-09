import express from "express";
import cors from "cors";
import crypto from "crypto";
import { db, type Vehicle, type Status } from "./db";
import {
  CreateVehicleSchema as CreateVehicle,
  UpdateVehicleSchema as UpdateVehicle,
} from "./schemas";
import {
  countMaintenance,
  maxMaintenanceAllowed,
  canChangeStatus,
} from "./rules";

process.on("uncaughtException", (err) => console.error("Uncaught:", err));

const app = express();
app.use(cors());
app.use(express.json());

// --- routes ---
app.get("/api/health", (_req, res) => res.send({ ok: true }));

// list
app.get("/api/vehicles", (req, res) => {
  const all = db.all();

  // simple search / filter / sort
  const q = (req.query.q as string)?.toLowerCase();
  const status = req.query.status as Status | undefined;
  const sort = (req.query.sort as string) || "createdAt:desc";

  let filtered = all;
  if (q)
    filtered = filtered.filter((v) => v.licensePlate.toLowerCase().includes(q));
  if (status) filtered = filtered.filter((v) => v.status === status);

  const [field, dir] = sort.split(":");
  filtered = filtered.sort((a: any, b: any) => {
    const va = a[field],
      vb = b[field];
    if (va < vb) return dir === "desc" ? 1 : -1;
    if (va > vb) return dir === "desc" ? -1 : 1;
    return 0;
  });

  res.send(filtered);
});

// create
app.post("/api/vehicles", (req, res) => {
  const parsed = CreateVehicle.safeParse(req.body);
  if (!parsed.success) return res.status(400).send(parsed.error);

  const all = db.all();
  const newVehicle: Vehicle = {
    id: crypto.randomUUID(),
    licensePlate: parsed.data.licensePlate,
    status: parsed.data.status ?? "Available",
    createdAt: new Date().toISOString(),
  };

  // rule: up to 5% in maintenance
  if (newVehicle.status === "Maintenance") {
    const allowed = maxMaintenanceAllowed(all.length + 1); // include new one
    if (countMaintenance(all) + 1 > allowed) {
      return res
        .status(400)
        .send({ message: `Maintenance cap reached (max ${allowed}).` });
    }
  }

  all.push(newVehicle);
  db.save(all);
  res.status(201).send(newVehicle);
});

// update
app.put("/api/vehicles/:id", (req, res) => {
  const parsed = UpdateVehicle.safeParse(req.body);
  if (!parsed.success) return res.status(400).send(parsed.error);

  const all = db.all();
  const idx = all.findIndex((v) => v.id === req.params.id);
  if (idx === -1) return res.status(404).send({ message: "Not found" });

  const before = all[idx];

  // rule: Maintenance -> only to Available
  if (parsed.data.status && !canChangeStatus(before, parsed.data.status)) {
    return res
      .status(400)
      .send({ message: "Maintenance → only Allowed to switch to Available" });
  }

  // rule: up to 5% in maintenance
  if (parsed.data.status === "Maintenance" && before.status !== "Maintenance") {
    const allowed = maxMaintenanceAllowed(all.length);
    if (countMaintenance(all) + 1 > allowed) {
      return res
        .status(400)
        .send({ message: `Maintenance cap reached (max ${allowed}).` });
    }
  }

  const updated = { ...before, ...parsed.data };
  all[idx] = updated;
  db.save(all);
  res.send(updated);
});

// delete
app.delete("/api/vehicles/:id", (req, res) => {
  const all = db.all();
  const v = all.find((x) => x.id === req.params.id);
  if (!v) return res.status(404).send({ message: "Not found" });

  // rule: InUse or Maintenance cannot be deleted
  if (v.status === "InUse" || v.status === "Maintenance") {
    return res
      .status(400)
      .send({ message: "Only Available vehicles can be deleted" });
  }

  db.save(all.filter((x) => x.id !== v.id));
  res.status(204).send();
});

export default app;
