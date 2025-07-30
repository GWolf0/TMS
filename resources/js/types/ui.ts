import { DOE, HTTPRequest, JSONType } from "./common";
import { z } from "zod";

// form component
export type FormItemType = "hidden" | "text" | "number" | "boolean" | "options" | "date" | "time" | "fk";
export interface FormItemMeta{
    fkTable?: string, // required to get fk label from table
    optionsData?: (string | number)[],
    hiddenVal?: string | number,
    isCSV?: boolean, csvMinCount?: number, csvMaxCount?: number,
}

export interface FormItemDef{
    name: string,
    displayName?: string,
    type: FormItemType,
    meta?: FormItemMeta,
    readonly?: boolean,
}

export interface FormAction{
    name: string,
    displayName: string,
    requiredFields?: string[], // all field required by default
    allowPageReload?: boolean, // do not prevent default page reload on submit
    validation?: z.AnyZodObject,
    httpRequest?: HTTPRequest, // the main request to send (after validation, if not undefined)
    onValidatedData?: (json: JSONType) => Promise<DOE>, // if defined it will be called (passing validated data)
    // onData?: (fd: FormData) => Promise<DOE>, // if defined it will be called (passing raw form data)
    authorized?: boolean, // if not authorized don't show action
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
    actions?: {name: string, action: () => any}[], // if action returns null (assume a closing request)
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