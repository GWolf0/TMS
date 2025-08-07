import { DOE, HTTPRequest, JSONType } from "./common";
import { z } from "zod";

// form component
export type FormItemType = "hidden" | "text" | "number" | "boolean" | "options" | "date" | "time" | "fk";

export type FormItemOptionDataPair = {id: number | string, label: string | number};
export interface FormItemMeta{
    fkTable?: string, // required to get fk label from table
    optionsData?: FormItemOptionDataPair[],
    hiddenVal?: string | number, hiddenValAuto?: boolean, // if true then take the hidden value from the passed data to the form
    isCSV?: boolean, csvMinCount?: number, csvMaxCount?: number,
}

export interface FormItemDef{
    name: string,
    displayName: string,
    type: FormItemType,
    meta?: FormItemMeta,
    readonly?: boolean,
    inputProps?: JSONType,
}

export interface FormAction{
    name: string,
    displayName: string,
    requiredFields?: string[], // all field required by default
    allowPageReload?: boolean, // do not prevent default page reload on submit
    validation?: z.AnyZodObject,
    onValidatedData?: (json: JSONType) => Promise<DOE>, // if defined it will be called (passing validated data)
    authorization?: boolean,
    oneTimePerPageLoad?: boolean, // if true, then action can be performed once per page load
}

export interface FormDef{
    id: string,
    title: string,
    items: FormItemDef[],
    action: FormAction,
}

// modal
export interface ModalDef{
    id: number,
    isCustom?: boolean,
    header: React.ReactNode,
    content: React.ReactNode,
    actions?: {name: string, action: () => any}[], // if action returns null (assume a close request)
}
export interface CustomModal{
    id: number,
    component: React.ReactNode,
}

// alert/notification
export type AlertSeverity = "info" | "warning" | "error";
export interface AlertDef{
    id: number,
    severity?: AlertSeverity,
    text: string,
}