// Requests related types and constants

import { HTTPMethodType, HTTPRequest } from "../types/common";

// models (model name to table name)
export enum TableModel {
    user = "users", organization = "organizations", vehicle = "vehicles", traject = "trajects",
    reservation = "reservations", shift = "shifts", conflict = "conflicts", tms_system = "tms_system",
}
// crud operation segment to associated method
export enum CRUD_OPS {
    show = "get", index = "get", store = "post", update = "patch", destroy = "delete",
}
// types from above enums
export type TableModelName = keyof typeof TableModel;
export type CRUD_OPS_Name = keyof typeof CRUD_OPS;

// _________________________________________

// Pages requests
export const LOGIN_PAGE_REQ: HTTPRequest = {
    url: "/login",
    method: "GET",
}
export const DASHBOARD_PAGE_REQ: HTTPRequest = {
    url: "/dashboard/{section}",
    method: "GET",
}

// Login page
export const LOGIN_REQ: HTTPRequest = {
    url: "/auth/login",
    method: "POST",
}
export const LOGOUT_REQ: HTTPRequest = {
    url: "/auth/logout",
    method: "POST",
}

// Settings 
export const SEND_PWD_RESET_EMAIL_REQ: HTTPRequest = {
    url: "/settings/forgot-password",
    method: "POST",
}
export const RESET_PWD_REQ: HTTPRequest = {
    url: "/settings/reset-password",
    method: "POST",
}

// CRUD requests (ex: CRUD_REQ["user"]["show"], returns the request to show single users entry)
export const CRUD_REQ: Record<TableModelName, Record<CRUD_OPS_Name, HTTPRequest>> = Object.fromEntries(
    Object.entries(TableModel).map(([modelName, tableName]) => {
        const crudOps = Object.entries(CRUD_OPS).map(([crudKey, method]) => {
            const suffix = ["show", "update", "destroy"].includes(crudKey) ? "{id}" : "";
            return [crudKey, { url: `/crud/${tableName}/${suffix}`, method: (method.toUpperCase() as HTTPMethodType) }];
        });
        return [modelName, Object.fromEntries(crudOps)];
    })
) as Record<TableModelName, Record<CRUD_OPS_Name, HTTPRequest>>;
// helper function for crud requests get
export function GetCRUDREQUEST(modelName: TableModelName, op: CRUD_OPS_Name): HTTPRequest{
    return CRUD_REQ[modelName][op];
}

// Per role requests
// admin requests
export const ADMIN_SHOW_PROFILE_REQ: HTTPRequest = {
    url: "/roles/admin/show-profile",
    method: "GET",
};
export const ADMIN_START_RESERVATIONS_PROCESSING_REQ: HTTPRequest = {
    url: "/roles/admin/start-reservations-processing/{type}",
    method: "POST",
};

// employee requests
export const EMPLOYEE_SHOW_PROFILE_REQ: HTTPRequest = {
    url: "/roles/employee/show-profile",
    method: "GET",
};
export const EMPLOYEE_RESERVE_REQ: HTTPRequest = {
    url: "/roles/employee/reserve/{type}",
    method: "POST",
};
export const EMPLOYEE_CANCEL_RESERVATION_REQ: HTTPRequest = {
    url: "/roles/employee/cancel-reservation/{type}",
    method: "POST",
};
export const EMPLOYEE_SHOW_RESERVATIONS_REQ: HTTPRequest = {
    url: "/roles/employee/show-reservations",
    method: "GET",
};
export const EMPLOYEE_SHOW_RESERVATION_REQ: HTTPRequest = {
    url: "/roles/employee/show-reservation/{id}",
    method: "GET",
};
export const EMPLOYEE_SHOW_TODAYS_RESERVATIONS_REQ: HTTPRequest = {
    url: "/roles/employee/show-todays-reservations",
    method: "GET",
};

// driver requests
export const DRIVER_SHOW_PROFILE_REQ: HTTPRequest = {
    url: "/roles/driver/show-profile",
    method: "GET",
};
export const DRIVER_SHOW_CURRENT_SHIFTS_REQ: HTTPRequest = {
    url: "/roles/driver/show-current-shifts",
    method: "GET",
};
export const DRIVER_UPDATE_AVAILABILITY_REQ: HTTPRequest = {
    url: "/roles/driver/update-availability",
    method: "POST",
};

// Misc requests
export const MISC_FK_LABELS_REQ: HTTPRequest = {
    url: "/misc/fk-labels/{table_name}",
    method: "GET",
};
export const MISC_CONSTS_REQ: HTTPRequest = {
    url: "/misc/consts",
    method: "GET",
};
export const MISC_SET_LOCALE_REQ: HTTPRequest = {
    url: "/misc/locale/{locale}",
    method: "PUT",
};
