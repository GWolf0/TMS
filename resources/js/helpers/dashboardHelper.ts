import { DashboardSection, DashboardSectionDef } from "../types/dashboardTypes";
import { UserRole } from "../types/enums";

export function getDashboardSectionsByUserRole(userRole: UserRole): DashboardSectionDef[] {
    switch(userRole) {
        case UserRole.admin:
            return [
                {name: "users", displayName: "users"},
                {name: "tms_system", displayName: "tms system"},
                {name: "organizations", displayName: "organizations"},
                {name: "trajects", displayName: "trajects"},
                {name: "vehicles", displayName: "vehicles"},
                {name: "reservations", displayName: "reservations"},
                {name: "shifts", displayName: "shifts"},
                {name: "conflicts", displayName: "conflicts"},
                {name: "actions", displayName: "actions"},
                {name: "profile", displayName: "profile"},
            ];
        case UserRole.employee:
            return [
                {name: "reserve", displayName: "reserve"},
                {name: "reservations", displayName: "reservations"},
                {name: "profile", displayName: "profile"},
            ];
        case UserRole.driver:
            return [
                {name: "shifts", displayName: "shifts"},
                {name: "profile", displayName: "profile"},
        ];
    }
}