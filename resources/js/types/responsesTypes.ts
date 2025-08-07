// types expected to be received by pages

import { JSONType, PaginatedData } from "./common";

// Dashboard page
export interface AdminDashboardPageData{
    paginatedData?: PaginatedData<JSONType>,
    data?: JSONType,
    profile?: JSONType,
    authorizations?: { start_reservations_processing: boolean, },
}

export interface EmployeeDashboardPageData{
    todaysReservations?: JSONType[],
    authorizations?: { 
        reserve_dropoff: boolean,
        reserve_pickup: boolean,
        cancel_dropoff: boolean,
        cancel_pickup: boolean,
    },
    allowedTimes?: {
        dropoff: string[],
        pickup: string[],
    },
    trajects?: {id: number, label: string}[],
    paginatedReservations?: PaginatedData<JSONType>,
    profile?: JSONType,
}

export interface DriverDashboardPageData{
    assignedShifts?: JSONType[],
    authorizations?: { 
        update_availability: boolean,
    },
    availability?: boolean,
    profile?: JSONType,
}

export type DashboardPageData = AdminDashboardPageData | EmployeeDashboardPageData | DriverDashboardPageData;