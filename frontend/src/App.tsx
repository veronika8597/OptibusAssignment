import VehicleForm from "./components/VehicleForm";
import VehicleTable from "./components/VehicleTable";
import { useReducer } from "react";

export default function App() {
  const [, force] = useReducer((x: number) => x + 1, 0); // no unused var warning

  return (
    <div
      style={{
        maxWidth: 980,
        margin: "40px auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Vehicle Management</h1>
      <p>Create, edit, delete and manage vehicle statuses.</p>
      <VehicleForm onCreated={() => force()} />
      <hr style={{ margin: "16px 0" }} />
      <VehicleTable />
      <p style={{ opacity: 0.7, marginTop: 16 }}>
        Rules: Maintenance→only to Available. InUse/Maintenance cannot be
        deleted. Max 5% in Maintenance at once.
      </p>
    </div>
  );
}
