import { afterAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import fs from "fs";
import os from "os";
import path from "path";

/**
 * We use a temp JSON file as our "DB" so tests don't touch real data.
 * We set process.env.DB_PATH BEFORE importing the app.
 */

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vmapp-"));
const TMP_DB = path.join(tmpDir, "vehicles-test.json");

// seed used for each test
const seed = [
  {
    id: "v1",
    licensePlate: "123-45-601",
    status: "Available",
    createdAt: "2024-01-01T09:00:00.000Z",
  },
  {
    id: "v2",
    licensePlate: "987-65-432",
    status: "InUse",
    createdAt: "2024-02-15T11:30:00.000Z",
  },
  {
    id: "v3",
    licensePlate: "555-11-222",
    status: "Maintenance",
    createdAt: "2024-03-20T08:10:00.000Z",
  },
  {
    id: "v4",
    licensePlate: "444-22-333",
    status: "Available",
    createdAt: "2024-04-10T14:05:00.000Z",
  },
  {
    id: "v5",
    licensePlate: "333-99-888",
    status: "Available",
    createdAt: "2024-05-01T07:40:00.000Z",
  },
];

async function getApp() {
  // write fresh DB file for this test run
  fs.writeFileSync(TMP_DB, JSON.stringify(seed, null, 2));
  process.env.DB_PATH = TMP_DB;

  // import AFTER setting DB_PATH so db.ts picks it up
  const mod = await import("../src/server");
  return mod.default;
}

afterAll(() => {
  try {
    fs.unlinkSync(TMP_DB);
  } catch {}
  try {
    fs.rmdirSync(tmpDir);
  } catch {}
});

describe("Vehicle API", () => {
  let app: any;

  beforeEach(async () => {
    app = await getApp();
  });

  it("lists vehicles (and supports search/filter)", async () => {
    const all = await request(app).get("/api/vehicles");
    expect(all.status).toBe(200);
    expect(Array.isArray(all.body)).toBe(true);
    expect(all.body.length).toBe(5);

    const q = await request(app).get("/api/vehicles").query({ q: "333" });
    expect(
      q.body.every((v: any) => String(v.licensePlate).includes("333"))
    ).toBe(true);

    const onlyMaint = await request(app)
      .get("/api/vehicles")
      .query({ status: "Maintenance" });
    expect(onlyMaint.body.length).toBe(1);
    expect(onlyMaint.body[0].status).toBe("Maintenance");
  });

  it("creates a vehicle (default status = Available)", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({ licensePlate: "111-22-333" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      licensePlate: "111-22-333",
      status: "Available",
    });

    const list = await request(app).get("/api/vehicles");
    expect(list.body.length).toBe(6);
  });

  it("rejects invalid payloads via validation", async () => {
    const bad = await request(app)
      .post("/api/vehicles")
      .send({ licensePlate: "x" }); // too short
    expect(bad.status).toBe(400);
  });

  it("enforces: Maintenance can move only to Available", async () => {
    const bad = await request(app)
      .put("/api/vehicles/v3")
      .send({ status: "InUse" });
    expect(bad.status).toBe(400);

    const ok = await request(app)
      .put("/api/vehicles/v3")
      .send({ status: "Available" });
    expect(ok.status).toBe(200);
    expect(ok.body.status).toBe("Available");
  });

  it("prevents deleting InUse or Maintenance; allows Available", async () => {
    const delInUse = await request(app).delete("/api/vehicles/v2");
    expect(delInUse.status).toBe(400);

    const delMaint = await request(app).delete("/api/vehicles/v3");
    expect(delMaint.status).toBe(400);

    const delAvail = await request(app).delete("/api/vehicles/v1");
    expect(delAvail.status).toBe(204);

    const list = await request(app).get("/api/vehicles");
    expect(list.body.find((v: any) => v.id === "v1")).toBeUndefined();
  });

  it("enforces the 5% maintenance cap on create", async () => {
    // With 5 items and 1 maintenance, cap is 1 (min 1) - adding another Maintenance should fail
    const res = await request(app)
      .post("/api/vehicles")
      .send({ licensePlate: "999-99-999", status: "Maintenance" });
    expect(res.status).toBe(400);
  });

  it("enforces the 5% maintenance cap on update", async () => {
    // Make v4 become Maintenance (would exceed 1 allowed)
    const res = await request(app)
      .put("/api/vehicles/v4")
      .send({ status: "Maintenance" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when updating a non-existing vehicle", async () => {
    const res = await request(app)
      .put("/api/vehicles/does-not-exist")
      .send({ status: "Available" });
    expect(res.status).toBe(404);
  });
});
