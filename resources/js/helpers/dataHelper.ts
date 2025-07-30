import { ModelsNames } from "@/requests/requests";
import { JSONType, PaginatedData } from "@/types/common";
import { CONFLICT_FORM_ITEMS, CONFLICT_SEARCH_FIELDS, conflictValidation, ORGANIZATION_FORM_ITEMS, ORGANIZATION_SEARCH_FIELDS, organizationValidation, RESERVATION_FORM_ITEMS, RESERVATION_SEARCH_FIELDS, reservationValidation, SHIFT_FORM_ITEMS, SHIFT_SEARCH_FIELDS, shiftValidation, TMSSYSTEM_FORM_ITEMS, tmsSystemValidation, TRAJECT_FORM_ITEMS, TRAJECT_SEARCH_FIELDS, trajectValidation, USER_FORM_ITEMS, USER_SEARCH_FIELDS, userValidation, VEHICLE_FORM_ITEMS, VEHICLE_SEARCH_FIELDS, vehicleValidation } from "@/types/models";
import { FormItemDef, FormItemMeta, FormItemType } from "@/types/ui";
import { ZodNumber, ZodObject, ZodString, ZodType, ZodTypeAny } from "zod";
import { h_FormFKLabelKey } from "./formHelper";

// *** Helper functions for data manipulation/conversion

// data to paginated data
// convert json data from backend to paginated data, (assuming backend is laravel)
export function dataToPaginatedData<T>(json: any, convertItemsToDataTypeFn?: (d: any) => T): PaginatedData<T>{
    // check if is a paginated data structure
    const isPaginated: boolean = !Array.isArray(json) && (Object.keys(json).includes("current_page") || Object.keys(json).includes("links"));
    const rawData: any[] = isPaginated ? json["data"] : json;
    
    const meta = isPaginated && Object.keys(json).includes("links") ? json["meta"] : json;

    const pdata: PaginatedData<T> = {
        data: rawData.map((d: any) => convertItemsToDataTypeFn ? convertItemsToDataTypeFn(d) : d as T),
        total: isPaginated ? Number(meta["total"]) : rawData.length,
        current_page: isPaginated ? Number(meta["current_page"]) : 1,
        last_page: isPaginated ? Number(meta["last_page"]) : 1,
        per_page: isPaginated ? Number(meta["per_page"]) : rawData.length,
    };
    return pdata;
}

// convert from json data to form data
export function jsonToFormData(json: JSONType) {
    const formData = new FormData();
    
    for(const key in json) if(json.hasOwnProperty(key)) formData.append(key, json[key]);
    
    return formData;
}

// get form items from model name
export function getFormItemsFromModelName(modelName: ModelsNames): FormItemDef[]{
    switch(modelName){
        case "conflict": return CONFLICT_FORM_ITEMS;
        case "organization": return ORGANIZATION_FORM_ITEMS;
        case "reservation": return RESERVATION_FORM_ITEMS;
        case "shift": return SHIFT_FORM_ITEMS;
        case "tms_system": return TMSSYSTEM_FORM_ITEMS;
        case "traject": return TRAJECT_FORM_ITEMS;
        case "user": return USER_FORM_ITEMS;
        case "vehicle": return VEHICLE_FORM_ITEMS;
    }
}

// get searchable fields from model name
export function getSearchableFieldsFromModelName(modelName: ModelsNames): string[]{
    switch(modelName){
        case "conflict": return CONFLICT_SEARCH_FIELDS;
        case "organization": return ORGANIZATION_SEARCH_FIELDS;
        case "reservation": return RESERVATION_SEARCH_FIELDS;
        case "shift": return SHIFT_SEARCH_FIELDS;
        case "tms_system": return [];
        case "traject": return TRAJECT_SEARCH_FIELDS;
        case "user": return USER_SEARCH_FIELDS;
        case "vehicle": return VEHICLE_SEARCH_FIELDS;
    }
}

// data to string (based on form item type return adequate string representation)
export function dataToString(name: string, data: any, dataType: FormItemType, labels?: JSONType): string{
    switch(dataType){
        case "boolean":
            return data ? "Yes" : "No";
        case "date":
            return new Date(Date.parse(String(data))).toUTCString().substring(0, 10);
        case "time":
            return String(data);
        case "number":
            return String(data);
        case "fk":
            {
                if(labels && Object.hasOwn(labels, h_FormFKLabelKey(name))) return labels[h_FormFKLabelKey(name)];
                return String(data);
            }
        default:
            return String(data);
    }
}
