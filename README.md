# Vehicle Management App

Full-stack TypeScript assignment implementing a simple vehicle management system.

---

## Tech Stack

**Backend:** Node.js, Express, TypeScript, Zod, CORS, JSON file storage

**Frontend:** React (Vite + TypeScript), Axios

## Run Instructions

### Backend

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### API Endpoints

| Method | Endpoint            | Description                                  |
| ------ | ------------------- | -------------------------------------------- |
| GET    | `/api/vehicles`     | List all vehicles (`?q`, `?status`, `?sort`) |
| POST   | `/api/vehicles`     | Create vehicle `{ licensePlate, status? }`   |
| PUT    | `/api/vehicles/:id` | Update vehicle `{ licensePlate?, status? }`  |
| DELETE | `/api/vehicles/:id` | Delete (only if Available)                   |
| GET    | `/api/health`       | Health check                                 |

---

### Business Rules

- Default status: Available
- Vehicles in **Maintenance** can move only to **Available**
- Vehicles in **InUse** or **Maintenance** cannot be deleted
- Up to **5%** of vehicles can be in Maintenance (min 1 allowed)
- Data persisted in backend/data/vehicles.json

---

### Features

- Create, edit, delete vehicles
- Filter and search by license plate or status
- Built with TypeScript on both frontend and backend
- Input validation via Zod
- Error handling and CORS enabled

#### The React + TypeScript frontend provides a minimal interface for managing vehicles with inline status updates, filters, and disabled actions based on business rules.
---

### Project Structure

```bash
backend/
  src/
    db.ts
    index.ts
    rules.ts
    schemas.ts
    server.ts
  data/
    vehicles.json
frontend/
  src/
    api.ts
    App.tsx
    main.tsx
    components/
      VehicleForm.tsx
      VehicleTable.tsx
tests/
  vehicles.spec.ts
```

---

### Tests

#### Run tests

```bash
cd backend
npm run test -- --coverage
```

#### Whats tested:

- **Vehicle creation** - ensures default status = Available and validates licensePlate format
- **Filtering & sorting** - `/api/vehicles` supports search `q`, `status` filtering and `sort`
- **Validation errors** - rejects invalid or incomplete payloads
- **Update rules** - vehicles in Maintenance can move only to Available
- **Deletion rules** - prevents deleting vehicles in InUse or Maintenance
- **Business constraint** - enforces the 5% maintenance cap (on create & update)

Tests run on an isolated temporary JSON database to ensure clean, reproducible results.
