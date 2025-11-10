import VehicleForm from "./components/VehicleForm";
import VehicleTable, {
  type VehicleTableHandle,
} from "./components/VehicleTable";
import { useRef } from "react";
import "./styles.css";

export default function App() {
  const tableRef = useRef<VehicleTableHandle>(null);

  return (
    <div className="page">
      <div className="card">
        <h1>Vehicle Management</h1>
        <p className="muted">
          Create, edit, delete and manage vehicle statuses.
        </p>
        <VehicleForm onCreated={() => tableRef.current?.reload()} />
        <div className="hr" />
        <VehicleTable ref={tableRef} />
        <p className="rules">
          Rules: Maintenance→only to Available. InUse/Maintenance cannot be
          deleted. Max 5% in Maintenance at once.
        </p>
      </div>
    </div>
  );
}
