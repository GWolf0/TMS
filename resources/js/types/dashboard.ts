// Dashboard types definitions

import { ModelsNames } from "@/requests/requests";
import { JSONType, PaginatedData } from "./common";
import { FormItemDef } from "./ui";
import { z, ZodObject } from 'zod';

// dashboard widgets types and options
export type DWType = "single_record_editor" | "data_table" | "custom";

export interface DWSingleRecordEditorOptions{
    title: string,
    modelName: ModelsNames,
    fields: FormItemDef[],
    data?: JSONType,
    createValidations?: z.AnyZodObject,
    updateableFields?: string[], // if not specified consider all fields
}
export interface DWDataTableOptions{
    title: string,
    modelName: ModelsNames,
    fields: FormItemDef[],
    data: any, // should be an array of data, or a paginated data format
    withEdit?: boolean,
    withDelete?: boolean,
}
export interface DWCustomOptions{
    component: React.ReactNode,
}

export type DWOptions = DWSingleRecordEditorOptions | DWDataTableOptions | DWCustomOptions;

// dashboard widget
export interface DashboardWidgetDef{
    type: DWType,
    options: DWOptions,
}

// dashboard section
export interface DashboardSectionDef{
    name: string,
    pathName: string,
    widgets: DashboardWidgetDef[],
}

// dashboard definition
export interface DashboardDef{
    name: string,
    sections: DashboardSectionDef[],
}
