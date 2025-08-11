export type AdminDashboardSection = "users" | "tms_system" | "organizations" | "trajects" | "vehicles" | "shifts" | "reservations" | "conflicts" | "actions" | "profile";
export type EmployeeDashboardSection = "reserve" | "reservations" | "profile";
export type DriverDashboardSection = "shifts" | "profile";
export type DashboardSection = AdminDashboardSection | EmployeeDashboardSection | DriverDashboardSection;

export interface DashboardSectionDef {
    name: DashboardSection,
    displayName: string,
}