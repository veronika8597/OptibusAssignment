import VehicleForm from "./components/VehicleForm";
import VehicleTable from "./components/VehicleTable";
import { useReducer } from "react";
import "./styles.css";

export default function App() {
  const [, force] = useReducer((x: number) => x + 1, 0);

  return (
    <div className="page">
      <div className="card">
        <h1>Vehicle Management</h1>
        <p className="muted">
          Create, edit, delete and manage vehicle statuses.
        </p>

        <VehicleForm onCreated={() => force()} />

        <div className="hr" />
        <VehicleTable />

        <p className="rules">
          Rules: Maintenance→only to Available. InUse/Maintenance cannot be
          deleted. Max 5% in Maintenance at once.
        </p>
      </div>
    </div>
  );
}
