# Vehicle Management App

Full-stack TypeScript assignment implementing a simple vehicle management system.

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

### Business Rules

- Default status: Available
- Vehicles in Maintenance can move only to Available
- Vehicles in InUse or Maintenance cannot be deleted
- Up to 5% of vehicles can be in Maintenance (min 1 allowed)
- Data persisted in backend/data/vehicles.json

### Features

- Create, edit, delete vehicles
- Filter and search by license plate or status
- Frontend and backend both in TypeScript
- Validation via Zod
- Error handling and CORS enabled

### Project Structure

```bash
backend/
  src/
    db.ts
    server.ts
  data/vehicles.json
frontend/
  src/
    api.ts
    main.tsx
    App.tsx
    components/
      VehicleForm.tsx
      VehicleTable.tsx
```

### Tests

```bash
cd backend
npm run test
```

Tests cover validation and rule enforcement.
