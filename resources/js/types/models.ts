import { ConflictTypeEnum, ReservationStatus, ReservationTypeEnum, UserRole, VehicleStatus } from "./enums";
import { z } from "zod";
import { FormItemDef } from "./ui";
import { getFormItemsFromZod } from "@/helpers/zodHelper";

// Models based on backend db tables
// Each foreign key may have an assosiated label in "labels" nullable field if exists
// Defining zod object, typescript types, form items, and searchable fields for each model

// TMSSystem
export const tmsSystemValidation = z.object({
    id: z.number(),
    organization_name: z.string(),
    organization_email: z.string().email(),
    organization_phonenumber: z.string(),
    automatic_dropoff_processing_time: z.string().time(),
    automatic_pickup_processing_time: z.string().time(),
    reservation_span: z.string(),
    allowed_dropoff_times: z.string(),
    allowed_pickup_times: z.string(),
    is_processing_shifts: z.boolean().readonly(),
    created_at: z.string().datetime(),
});
export type TMSSystemType = typeof tmsSystemValidation._type;
export const TMSSYSTEM_FORM_ITEMS: FormItemDef[] = getFormItemsFromZod(tmsSystemValidation);

// User
export const userValidation = z.object({
    id: z.number({coerce: true}),
    name: z.string().max(128),
    email: z.string().email(),
    role: z.nativeEnum(UserRole),
    organization_id: z.number({coerce: true}).describe("table=organizations"),
    email_verified_at: z.string().datetime().nullable(),
    created_at: z.string().datetime(),
    labels: z.object({
        organization: z.string().nullable(),
    }).nullable(),
});
export type UserType = typeof userValidation._type;
export const USER_FORM_ITEMS: FormItemDef[] = getFormItemsFromZod(userValidation);
export const USER_SEARCH_FIELDS = ["name", "role"];

// Organization
export const organizationValidation = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    phone_number: z.string(),
    contract_end_date: z.string().datetime(),
    created_at: z.string().datetime(),
});
export type OrganizationType = typeof organizationValidation._type;
export const ORGANIZATION_FORM_ITEMS: FormItemDef[] = getFormItemsFromZod(organizationValidation);
export const ORGANIZATION_SEARCH_FIELDS = ["name"];

// Vehicle
export const vehicleValidation = z.object({
    id: z.number(),
    model_name: z.string(),
    capacity: z.number().gte(0),
    status: z.nativeEnum(VehicleStatus),
    created_at: z.string().datetime(),
});
export type VehicleType = typeof vehicleValidation._type;
export const VEHICLE_FORM_ITEMS: FormItemDef[] = getFormItemsFromZod(vehicleValidation);
export const VEHICLE_SEARCH_FIELDS = ["model_name", "capacity", "status"];

// Traject
export const trajectValidation = z.object({
    id: z.number(),
    name: z.string(),
    stop_areas: z.string().nullable(),
    created_at: z.string().datetime(),
});
export type TrajectType = typeof trajectValidation._type;
export const TRAJECT_FORM_ITEMS: FormItemDef[] = getFormItemsFromZod(trajectValidation);
export const TRAJECT_SEARCH_FIELDS = ["name"];

// Reservation
export const reservationValidation = z.object({
    id: z.number(),
    type: z.nativeEnum(ReservationTypeEnum),
    status: z.nativeEnum(ReservationStatus),
    date: z.string().date(),
    time: z.string().time(),
    traject_id: z.number().nullable(),
    shift_id: z.number().nullable(),
    user_id: z.number().nullable(),
    created_at: z.string().datetime(),
    labels: z.object({
        shift: z.string().nullable(),
        user: z.string().nullable(),
        traject: z.string().nullable(),
    }).nullable(),
});
export type ReservationType = typeof reservationValidation._type;
export const RESERVATION_FORM_ITEMS: FormItemDef[] = getFormItemsFromZod(reservationValidation);
export const RESERVATION_SEARCH_FIELDS = ["type", "status", "date", "time", "traject_id", "user_id"];

// Shift
export const shiftValidation = z.object({
    id: z.number(),
    number: z.number(),
    type: z.nativeEnum(ReservationTypeEnum),
    date: z.string().date(),
    time: z.string().time(),
    driver_id: z.number().nullable(),
    traject_id: z.number().nullable(),
    vehicle_id: z.number().nullable(),
    created_at: z.string().datetime(),
    labels: z.object({
        driver: z.string().nullable(),
        traject: z.string().nullable(),
        vehicle: z.string().nullable(),
    }).nullable(),
});
export type ShiftType = typeof shiftValidation._type;
export const SHIFT_FORM_ITEMS: FormItemDef[] = getFormItemsFromZod(shiftValidation);
export const SHIFT_SEARCH_FIELDS = ["number", "type", "date", "time", "driver_id", "traject_id", "vehicle_id"];

// Conflict
export const conflictValidation = z.object({
    id: z.number(),
    type: z.nativeEnum(ConflictTypeEnum),
    data: z.string().nullable(),
    created_at: z.string().datetime(),
});
export type ConflictType = typeof conflictValidation._type;
export const CONFLICT_FORM_ITEMS: FormItemDef[] = getFormItemsFromZod(conflictValidation);
export const CONFLICT_SEARCH_FIELDS = ["type"];















// User
// export interface User {
//     id: number;
//     name: string;
//     email: string;
//     role: UserRole,
//     email_verified_at: string | null;
//     created_at: string;
//     updated_at: string;
//     [key: string]: unknown; // This allows for additional properties...
// }
