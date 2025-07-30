// zod related helpers

import { ModelsNames } from "@/requests/requests";
import { conflictValidation, organizationValidation, reservationValidation, shiftValidation, tmsSystemValidation, trajectValidation, userValidation, vehicleValidation } from "@/types/models";
import { FormItemType, FormItemMeta, FormItemDef } from "@/types/ui";
import { ZodObject, ZodTypeAny, ZodString, ZodNumber } from "zod";

// get zod schema from model name
export function getZodFromModelName(modelName: ModelsNames): ZodObject<any>{
    switch(modelName){
        case "conflict": return conflictValidation;
        case "organization": return organizationValidation;
        case "reservation": return reservationValidation;
        case "shift": return shiftValidation;
        case "tms_system": return tmsSystemValidation;
        case "traject": return trajectValidation;
        case "user": return userValidation;
        case "vehicle": return vehicleValidation;
    }
}

// pick from zod schema
export function pickFromZod(schema: ZodObject<any> | undefined, fields: string[] | undefined): ZodObject<any> | undefined{
    if(!schema) return undefined;
    if(!fields) return schema;

    return schema.pick(Object.fromEntries(fields.map((f) => [f, true])));
}


// helper to extract input validation attributes from zod definition
export function getInputAttributes(schema: ZodTypeAny) {
    const def = schema._def;
    const attrs: Record<string, any> = {};

    if (schema.isOptional()) {
        attrs.required = false;
    } else {
        attrs.required = true;
    }

    if (schema instanceof ZodString) {
    const checks = def.checks || [];
    for (const check of checks) {
        if (check.kind === "min") attrs.minLength = check.value;
        if (check.kind === "max") attrs.maxLength = check.value;
        if (check.kind === "regex") attrs.pattern = check.regex.source;
    }
    }

    if (schema instanceof ZodNumber) {
    const checks = def.checks || [];
    for (const check of checks) {
        if (check.kind === "min") attrs.min = check.value;
        if (check.kind === "max") attrs.max = check.value;
    }
    }

    return attrs;
}

// *** Helpers to convert from zod schema to form item definition *** //
export function getFormItemType(zodType: ZodTypeAny, isFK: boolean = false): FormItemType {
    const def = zodType._def;

    const isHidden: boolean = def.description && def.description.includes("hidden");

    if(isHidden) return "hidden";

    switch (def.typeName) {
        case "ZodString":
            if (def.checks?.some((c: any) => c.kind === "datetime")) return "date";
            if (def.checks?.some((c: any) => c.kind === "time")) return "time";
            return "text";
        case "ZodNumber":
            return isFK ? "fk" : "number";
        case "ZodBoolean":
            return "boolean";
        case "ZodEnum":
            return "options";
        case "ZodNativeEnum":
            return "options";
        default:
            return "text"; // fallback
    }
}

function extractMeta(name: string, zodType: ZodTypeAny): FormItemMeta | undefined {
    const meta: FormItemMeta = {};

    // Check for description metadata
    const desc = zodType.description;
    
    // Foreign key detection
    if (name.endsWith("_id") && desc) {
        const tableName = desc.match(/table=(\w+)/);
        if(tableName) meta.fkTable = tableName[1];
    }

    if (desc) {
        if (desc.includes("csv")) {
            meta.isCSV = true;
            const minMatch = desc.match(/min=(\d+)/);
            const maxMatch = desc.match(/max=(\d+)/);
            if (minMatch) meta.csvMinCount = parseInt(minMatch[1]);
            if (maxMatch) meta.csvMaxCount = parseInt(maxMatch[1]);
        }

        if (desc.includes("hidden")) {
            const value = desc.match(/value=([a-zA-Z0-9_,]+)/);
            if(value) meta.hiddenVal = value[1];
        }

        const optMatch = desc.match(/options:([a-zA-Z0-9_,]+)/);
        if (optMatch) {
            meta.optionsData = optMatch[1].split(",");
        }
    }

    // Enum or NativeEnum values
    const def = zodType._def;
    if (def.typeName === "ZodEnum") {
        meta.optionsData = def.values;
    }
    if (def.typeName === "ZodNativeEnum") {
        meta.optionsData = Object.values(def.values);
    }

    return Object.keys(meta).length > 0 ? meta : undefined;
}

export function getFormItemsFromZod(schema: ZodObject<any>): FormItemDef[] {
    const shape = schema.shape;

    return Object.entries(shape).map(([name, zodType]) => {
        let meta = extractMeta(name, zodType as ZodTypeAny);
        let type = getFormItemType(zodType as ZodTypeAny, meta && Object.hasOwn(meta, "fkTable"));
        const displayName = name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        const readonly = ["id", "created_at"].includes(name); // example readonly fields
        
        // for id
        if(name === "id") {
            type = "hidden";
        }

        return {
            name,
            displayName,
            type,
            meta,
            readonly,
        };
    });
}

