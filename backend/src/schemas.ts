import { z } from "zod";

const LicensePlateSchema = z
  .string()
  .trim()
  .refine((v) => /^\d+(?:-\d+)*$/.test(v.replace(/\s+/g, "")), "Invalid format")
  .refine((v) => v.replace(/[-\s]/g, "").length >= 7, "Too short");

export const CreateVehicleSchema = z.object({
  licensePlate: LicensePlateSchema,
  status: z.enum(["Available", "InUse", "Maintenance"]).optional(),
});

export const UpdateVehicleSchema = z.object({
  status: z.enum(["Available", "InUse", "Maintenance"]).optional(),
});
