import { ConflictTypeEnum, ReservationStatus, ReservationTypeEnum, UserRole, VehicleStatus } from "./enums";
import { z } from "zod";


// TMSSystem
export const tmsSystemValidation = z.object({
    id: z.number({coerce: true}),
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

// Organization
export const organizationValidation = z.object({
    id: z.number({coerce: true}),
    name: z.string(),
    email: z.string().email(),
    phone_number: z.string(),
    contract_end_date: z.string().datetime(),
    created_at: z.string().datetime(),
});
export type OrganizationType = typeof organizationValidation._type;

// Vehicle
export const vehicleValidation = z.object({
    id: z.number({coerce: true}),
    model_name: z.string(),
    capacity: z.number().gte(0),
    status: z.nativeEnum(VehicleStatus),
    created_at: z.string().datetime(),
});
export type VehicleType = typeof vehicleValidation._type;

// Traject
export const trajectValidation = z.object({
    id: z.number({coerce: true}),
    name: z.string(),
    stop_areas: z.string().nullable(),
    created_at: z.string().datetime(),
});
export type TrajectType = typeof trajectValidation._type;

// Reservation
export const reservationValidation = z.object({
    id: z.number({coerce: true}),
    type: z.nativeEnum(ReservationTypeEnum),
    status: z.nativeEnum(ReservationStatus),
    date: z.string().date(),
    time: z.string().time(),
    traject_id: z.number({coerce: true}).nullable(),
    shift_id: z.number({coerce: true}).nullable(),
    user_id: z.number({coerce: true}).nullable(),
    created_at: z.string().datetime(),
    labels: z.object({
        shift: z.string().nullable(),
        user: z.string().nullable(),
        traject: z.string().nullable(),
    }).nullable(),
});
export type ReservationType = typeof reservationValidation._type;

// Shift
export const shiftValidation = z.object({
    id: z.number({coerce: true}),
    number: z.number(),
    type: z.nativeEnum(ReservationTypeEnum),
    date: z.string().date(),
    time: z.string().time(),
    driver_id: z.number({coerce: true}).nullable(),
    traject_id: z.number({coerce: true}).nullable(),
    vehicle_id: z.number({coerce: true}).nullable(),
    created_at: z.string().datetime(),
    labels: z.object({
        driver: z.string().nullable(),
        traject: z.string().nullable(),
        vehicle: z.string().nullable(),
    }).nullable(),
});
export type ShiftType = typeof shiftValidation._type;

// Conflict
export const conflictValidation = z.object({
    id: z.number({coerce: true}),
    type: z.nativeEnum(ConflictTypeEnum),
    data: z.string().nullable(),
    created_at: z.string().datetime(),
});
export type ConflictType = typeof conflictValidation._type;
