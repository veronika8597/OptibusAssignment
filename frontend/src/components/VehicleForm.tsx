import { useState } from "react";
import { api } from "../api";
import type { Vehicle, Status } from "../api";

export default function VehicleForm({
  onCreated,
}: {
  onCreated: (v: Vehicle) => void;
}) {
  const [licensePlate, setLicensePlate] = useState("");
  const [status, setStatus] = useState<Status>("Available");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<Vehicle>("/vehicles", {
        licensePlate,
        status,
      });
      onCreated(res.data);
      setLicensePlate("");
      setStatus("Available");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? (err instanceof Error ? err.message : "Failed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="toolbar" style={{ alignItems: "end" }}>
      <div style={{ minWidth: 220 }}>
        <label>License Plate</label>
        <br />
        <input
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          required
          placeholder="123-45-678"
        />
      </div>
      <div>
        <label>Status</label>
        <br />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option>Available</option>
          <option>InUse</option>
          <option>Maintenance</option>
        </select>
      </div>
      <button className="btn" disabled={loading}>
        Add Vehicle
      </button>
      {error && <span className="error">{error}</span>}
    </form>
  );
}
