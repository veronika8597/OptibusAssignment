import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import type { Vehicle, Status } from "../api";

export default function VehicleTable() {
  const [rows, setRows] = useState<Vehicle[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (statusFilter) params.status = statusFilter;
    try {
      const res = await api.get<Vehicle[]>("/vehicles", { params });
      setRows(res.data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      setError(msg);
    }
  }, [q, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onStatusChange(id: string, status: Status) {
    try {
      const res = await api.put<Vehicle>(`/vehicles/${id}`, { status });
      setRows((x) => x.map((v) => (v.id === id ? res.data : v)));
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? (e instanceof Error ? e.message : "Failed");
      alert(msg);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setRows((x) => x.filter((v) => v.id !== id));
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? (e instanceof Error ? e.message : "Failed");
      alert(msg);
    }
  }

  return (
    <>
      <div className="toolbar">
        <input
          placeholder="Search plate…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "" | Status)}
        >
          <option value="">All statuses</option>
          <option>Available</option>
          <option>InUse</option>
          <option>Maintenance</option>
        </select>
        <button className="btn" onClick={() => void load()}>
          Reload
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>id</th>
            <th>license plate</th>
            <th>status</th>
            <th>created at</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td style={{ fontWeight: 600 }}>{v.licensePlate}</td>
              <td>
                <select
                  className="inline"
                  value={v.status}
                  onChange={(e) =>
                    onStatusChange(v.id, e.target.value as Status)
                  }
                >
                  <option>Available</option>
                  <option>InUse</option>
                  <option>Maintenance</option>
                </select>
              </td>
              <td>{new Date(v.createdAt).toLocaleString()}</td>
              <td className="actions">
                <button
                  className="btn delete"
                  onClick={() => remove(v.id)}
                  disabled={v.status !== "Available"}
                  title={
                    v.status !== "Available"
                      ? "Make vehicle Available to delete"
                      : undefined
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && (
        <div className="error" style={{ marginTop: 8 }}>
          {error}
        </div>
      )}
    </>
  );
}
