// zod related helpers
import { ZodObject, ZodTypeAny, ZodString, ZodNumber } from "zod";


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

