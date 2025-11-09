import { z } from "zod";

export const StatusEnum = z.enum(["Available", "InUse", "Maintenance"]);
export const licensePattern = /^[A-Z0-9-]+$/i;

export const CreateVehicleSchema = z.object({
  licensePlate: z
    .string()
    .min(3)
    .max(20)
    .regex(licensePattern, "Invalid license plate format"),
  status: StatusEnum.optional(),
});

export const UpdateVehicleSchema = z.object({
  licensePlate: z
    .string()
    .min(3)
    .max(20)
    .regex(licensePattern, "Invalid license plate format")
    .optional(),
  status: StatusEnum.optional(),
});
