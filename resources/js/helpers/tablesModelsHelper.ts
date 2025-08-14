import { z } from "zod";
import { TableModel, TableModelName } from "../requests/requests";
import { FormItemDef } from "../types/uiTypes";
import { ConflictTypeEnum, ReservationStatus, ReservationTypeEnum, UserRole, VehicleStatus } from "../types/enums";
import { getInputAttributes, pickFromZod } from "./zodHelper";
import { conflictValidation, organizationValidation, reservationValidation, shiftValidation, tmsSystemValidation, trajectValidation, userValidation, vehicleValidation } from "../types/tablesModels";

// Data holder for table models definitions (boring but needed)

export interface TableModelDef {
    model: TableModel,
    name: TableModelName,
    fields: string[],
    formItems: FormItemDef[],
    searchFields: string[],
    createFields: string[],
    updateFields: string[],
    createValidation: z.AnyZodObject | undefined,
    updateValidation: z.AnyZodObject | undefined,
}

// get table model definition
export function getTableModelDef(table: TableModel): TableModelDef {
    switch(table) {
        case TableModel.user:
            {
                const fileds = ["id", "name", "email", "password", "role", "meta", "organization_id", "email_verified_at", "created_at", "updated_at"];
                const createFields = fileds.filter(f => ["name", "email", "password", "role", "organization_id"].includes(f));
                const updateFields = fileds.filter(f => ["id", "name", "email", "role", "organization_id"].includes(f));
                return {
                    name: "user",
                    model: TableModel.user,
                    fields: fileds,
                    searchFields: fileds.filter(f => ["name", "role"].includes(f)),
                    createFields: createFields,
                    updateFields: updateFields,
                    formItems: [
                        {name: "id", displayName: "id", type: "hidden", meta: {hiddenValAuto: true}, readonly: true},
                        {name: "name", displayName: "name", type: "text"},
                        {name: "email", displayName: "email", type: "text"},
                        {name: "password", displayName: "password", type: "text"},
                        {name: "role", displayName: "role", type: "options", meta: {optionsData: Object.values(UserRole).map(val => ({id: val, label: val}))}},
                        {name: "meta", displayName: "meta", type: "text"},
                        {name: "organization_id", displayName: "organization", type: "fk", meta: {fkTable: "organizations"}},
                        {name: "email_verified_at", displayName: "email verified at", type: "date"},
                        {name: "created_at", displayName: "created at", type: "date", readonly: true},
                        {name: "updated_at", displayName: "updated at", type: "date", readonly: true},
                    ],
                    createValidation: pickFromZod(userValidation, createFields),
                    updateValidation: pickFromZod(userValidation, updateFields),
                }
            }
        case TableModel.organization:
            {
                const fileds = ["id", "name", "email", "phonenumber", "contract_end_date", "created_at", "updated_at"];
                const createFields = fileds.filter(f => ["name", "email", "phonenumber", "contract_end_date"].includes(f));
                const updateFields = fileds.filter(f => ["id", "name", "email", "phonenumber", "contract_end_date"].includes(f));
                return {
                    name: "organization",
                    model: TableModel.organization,
                    fields: fileds,
                    searchFields: fileds.filter(f => ["name"].includes(f)),
                    createFields: createFields,
                    updateFields: updateFields,
                    formItems: [
                        {name: "id", displayName: "id", type: "hidden", meta: {hiddenValAuto: true}, readonly: true},
                        {name: "name", displayName: "name", type: "text"},
                        {name: "email", displayName: "email", type: "text"},
                        {name: "phonenumber", displayName: "phonenumber", type: "text"},
                        {name: "contract_end_date", displayName: "contract end date", type: "date"},                        
                        {name: "created_at", displayName: "created at", type: "date", readonly: true},
                        {name: "updated_at", displayName: "updated at", type: "date", readonly: true},
                    ],
                    createValidation: pickFromZod(organizationValidation, createFields),
                    updateValidation: pickFromZod(organizationValidation, updateFields),
                }
            }
        case TableModel.vehicle:
            {
                const fileds = ["id", "model_name", "capacity", "status", "created_at", "updated_at"];
                const createFields = fileds.filter(f => ["model_name", "capacity", "status"].includes(f));
                const updateFields = fileds.filter(f => ["id", "model_name", "capacity", "status"].includes(f));
                return {
                    name: "vehicle",
                    model: TableModel.vehicle,
                    fields: fileds,
                    searchFields: fileds.filter(f => ["model_name", "status", "capacity"].includes(f)),
                    createFields: createFields,
                    updateFields: updateFields,
                    formItems: [
                        {name: "id", displayName: "id", type: "hidden", meta: {hiddenValAuto: true}, readonly: true},
                        {name: "model_name", displayName: "model name", type: "text"},
                        {name: "capacity", displayName: "capacity", type: "number"},
                        {name: "status", displayName: "status", type: "options", meta: {optionsData: Object.values(VehicleStatus).map(val=>({id: val, label: val}))}},
                        {name: "created_at", displayName: "created at", type: "date", readonly: true},
                        {name: "updated_at", displayName: "updated at", type: "date", readonly: true},
                    ],
                    createValidation: pickFromZod(vehicleValidation, createFields),
                    updateValidation: pickFromZod(vehicleValidation, updateFields),
                }
            }
        case TableModel.traject:
            {
                const fileds = ["id", "name", "stop_areas", "created_at", "updated_at"];
                const createFields = fileds.filter(f => ["name", "stop_areas"].includes(f));
                const updateFields = fileds.filter(f => ["id", "name", "stop_areas"].includes(f));
                return {
                    name: "traject",
                    model: TableModel.traject,
                    fields: fileds,
                    searchFields: fileds.filter(f => ["name"].includes(f)),
                    createFields: createFields,
                    updateFields: updateFields,
                    formItems: [
                        {name: "id", displayName: "id", type: "hidden", meta: {hiddenValAuto: true}, readonly: true},
                        {name: "name", displayName: "name", type: "text"},
                        {name: "stop_areas", displayName: "stop areas", type: "text"},
                        {name: "created_at", displayName: "created at", type: "date", readonly: true},
                        {name: "updated_at", displayName: "updated at", type: "date", readonly: true},
                    ],
                    createValidation: pickFromZod(trajectValidation, createFields),
                    updateValidation: pickFromZod(trajectValidation, updateFields),
                }
            }
        case TableModel.reservation:
            {
                const fileds = ["id", "type", "status", "date", "time", "traject_id", "shift_id", "user_id", "created_at", "updated_at"];
                const createFields = fileds.filter(f => ["type", "status", "date", "time", "traject_id", "shift_id", "user_id"].includes(f));
                const updateFields = fileds.filter(f => ["id", "type", "status", "date", "time", "traject_id", "shift_id", "user_id"].includes(f));
                return {
                    name: "reservation",
                    model: TableModel.reservation,
                    fields: fileds,
                    searchFields: fileds.filter(f => ["type", "status", "traject_id", "user_id"].includes(f)),
                    createFields: createFields,
                    updateFields: updateFields,
                    formItems: [
                        {name: "id", displayName: "id", type: "hidden", meta: {hiddenValAuto: true}, readonly: true},
                        {name: "type", displayName: "type", type: "options", meta: {optionsData: Object.values(ReservationTypeEnum).map(val=>({id: val, label: val}))}},
                        {name: "status", displayName: "status", type: "options", meta: {optionsData: Object.values(ReservationStatus).map(val=>({id: val, label: val}))}},
                        {name: "date", displayName: "date", type: "date"},
                        {name: "time", displayName: "time", type: "time"},
                        {name: "traject_id", displayName: "traject", type: "fk", meta: {fkTable: "trajects"}},
                        {name: "shift_id", displayName: "shift", type: "fk", meta: {fkTable: "shifts"}},
                        {name: "user_id", displayName: "user", type: "fk", meta: {fkTable: "users"}},
                        {name: "created_at", displayName: "created at", type: "date", readonly: true},
                        {name: "updated_at", displayName: "updated at", type: "date", readonly: true},
                    ],
                    createValidation: pickFromZod(reservationValidation, createFields),
                    updateValidation: pickFromZod(reservationValidation, updateFields),
                }
            }
        case TableModel.shift:
            {
                const fileds = ["id", "number", "type", "date", "time", "driver_id", "traject_id", "vehicle_id", "created_at", "updated_at"];
                const createFields = fileds.filter(f => ["number", "type", "date", "time", "driver_id", "traject_id", "vehicle_id"].includes(f));
                const updateFields = fileds.filter(f => ["id", "number", "type", "date", "time", "driver_id", "traject_id", "vehicle_id"].includes(f));
                return {
                    name: "shift",
                    model: TableModel.shift,
                    fields: fileds,
                    searchFields: fileds.filter(f => ["number", "type", "driver_id", "traject_id", "vehicle_id"].includes(f)),
                    createFields: createFields,
                    updateFields: updateFields,
                    formItems: [
                        {name: "id", displayName: "id", type: "hidden", meta: {hiddenValAuto: true}, readonly: true},
                        {name: "number", displayName: "number", type: "number"},
                        {name: "type", displayName: "type", type: "options", meta: {optionsData: Object.values(ReservationTypeEnum).map(val=>({id: val, label: val}))}},
                        {name: "date", displayName: "date", type: "date"},
                        {name: "time", displayName: "time", type: "time"},
                        {name: "driver_id", displayName: "driver", type: "fk", meta: {fkTable: "users"}},
                        {name: "traject_id", displayName: "traject", type: "fk", meta: {fkTable: "trajects"}},
                        {name: "vehicle_id", displayName: "vehicle", type: "fk", meta: {fkTable: "vehicles"}},
                        {name: "created_at", displayName: "created at", type: "date", readonly: true},
                        {name: "updated_at", displayName: "updated at", type: "date", readonly: true},
                    ],
                    createValidation: pickFromZod(shiftValidation, createFields),
                    updateValidation: pickFromZod(shiftValidation, updateFields),
                }
            }
        case TableModel.conflict:
            {
                const fileds = ["id", "type", "data", "created_at", "updated_at"];
                const createFields = fileds.filter(f => ["type", "data"].includes(f));
                const updateFields = fileds.filter(f => ["id", "type", "data"].includes(f));
                return {
                    name: "conflict",
                    model: TableModel.conflict,
                    fields: fileds,
                    searchFields: fileds.filter(f => ["type"].includes(f)),
                    createFields: createFields,
                    updateFields: updateFields,
                    formItems: [
                        {name: "id", displayName: "id", type: "hidden", meta: {hiddenValAuto: true}, readonly: true},
                        {name: "type", displayName: "type", type: "options", meta: {optionsData: Object.values(ConflictTypeEnum).map(val=>({id: val, label: val}))}},
                        {name: "data", displayName: "data", type: "text"},
                        {name: "created_at", displayName: "created at", type: "date", readonly: true},
                        {name: "updated_at", displayName: "updated at", type: "date", readonly: true},
                    ],
                    createValidation: pickFromZod(conflictValidation, createFields),
                    updateValidation: pickFromZod(conflictValidation, updateFields),
                }
            }
        case TableModel.tms_system:
            {
                const fileds = ["id", "organization_name", "organization_email", "organization_phonenumber", "automatic_dropoff_processing_time", "automatic_pickup_processing_time", "reservation_span", "allowed_dropoff_times", "allowed_pickup_times", "created_at", "updated_at"];
                const createFields = fileds.filter(f => ["organization_name", "organization_email", "organization_phonenumber", "automatic_dropoff_processing_time", "automatic_pickup_processing_time", "reservation_span", "allowed_dropoff_times", "allowed_pickup_times"].includes(f));
                const updateFields = fileds.filter(f => ["id", "organization_name", "organization_email", "organization_phonenumber", "automatic_dropoff_processing_time", "automatic_pickup_processing_time", "reservation_span", "allowed_dropoff_times", "allowed_pickup_times"].includes(f));
                return {
                    name: "tms_system",
                    model: TableModel.tms_system,
                    fields: fileds,
                    searchFields: fileds.filter(f => [""].includes(f)),
                    createFields: createFields,
                    updateFields: updateFields,
                    formItems: [
                        {name: "id", displayName: "id", type: "hidden", meta: {hiddenValAuto: true}, readonly: true},
                        {name: "organization_name", displayName: "organization name", type: "text"},
                        {name: "organization_email", displayName: "organization email", type: "text"},
                        {name: "organization_phonenumber", displayName: "organization phonenumber", type: "text"},
                        {name: "automatic_dropoff_processing_time", displayName: "automatic dropoff processing time", type: "time"},
                        {name: "automatic_pickup_processing_time", displayName: "automatic pickup processing time", type: "time"},
                        {name: "reservation_span", displayName: "reservation span", type: "text"},
                        {name: "allowed_dropoff_times", displayName: "allowed dropoff times", type: "text"},
                        {name: "allowed_pickup_times", displayName: "allowed pickup times", type: "text"},
                        {name: "created_at", displayName: "created at", type: "date", readonly: true},
                        {name: "updated_at", displayName: "updated at", type: "date", readonly: true},
                    ],
                    createValidation: pickFromZod(tmsSystemValidation, createFields),
                    updateValidation: pickFromZod(tmsSystemValidation, updateFields),
                }
            }
    }
}
