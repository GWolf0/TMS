import { ZodNumber, ZodObject, ZodString, ZodType, ZodTypeAny } from "zod";
import { JSONType, PaginatedData } from "../types/common";
import { FormItemType } from "../types/uiTypes";
import { formFKLabelKey } from "./formHelper";

// *** Helper functions for data manipulation/conversion

// data to paginated data
// convert json data from backend to paginated data, (assuming backend is laravel)
export function dataToPaginatedData<T>(json: any, convertItemsToDataTypeFn?: (d: any) => T): PaginatedData<T>{
    // check if is a paginated data structure
    const isPaginated: boolean = !Array.isArray(json) && 
        Object.keys(json).includes("data");
    
    const rawData: any[] = isPaginated ? json["data"] : json;
    
    const meta = isPaginated && Object.keys(json).includes("meta") ? json["meta"] : json;

    const pdata: PaginatedData<T> = {
        data: rawData.map((d: any) => convertItemsToDataTypeFn ? convertItemsToDataTypeFn(d) : d as T),
        total: isPaginated ? Number(meta["total"] ?? 0) : rawData.length,
        current_page: isPaginated ? Number(meta["current_page"] ?? 1) : 1,
        last_page: isPaginated ? Number(meta["last_page"] ?? 1) : 1,
        per_page: isPaginated ? Number(meta["per_page"] ?? 0) : rawData.length,
    };
    return pdata;
}

// convert from json data to form data
export function jsonToFormData(json: JSONType): FormData {
    const formData = new FormData();
    
    for(const key in json) if(json.hasOwnProperty(key)) formData.append(key, json[key]);
    
    return formData;
}

// data to string (based on form item type return adequate string representation)
export function dataToString(name: string, data: any, dataType: FormItemType, labels?: JSONType): string{
    if(data === null || data === undefined) return "N/A";
    
    switch(dataType){
        case "boolean":
            return data ? "Yes" : "No";
        case "date":
            return new Date(Date.parse(String(data))).toISOString().substring(0, 10);
        case "time":
            return String(data);
        case "number":
            return String(data);
        case "fk":
            {
                if(labels && Object.hasOwn(labels, formFKLabelKey(name))) return labels[formFKLabelKey(name)];
                return String(data);
            }
        default:
            return String(data);
    }
}

// data to input data (make sure to format the data as expected for the input)
export function dataToInputData(name: string, data: any, dataType: FormItemType): any{
    if(data === null || data === undefined) return "N/A";
    
    switch(dataType){
        case "boolean":
            return Boolean(data);
        case "date":
            return new Date(Date.parse(String(data))).toISOString().substring(0, 10);
        case "time":
            return String(data);
        case "number":
            return Number(data);
        case "fk":
            return Number(data);
        default:
            return String(data);
    }
}
