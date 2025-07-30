// users roles
export enum UserRole {
    admin = "admin",
    employee = "employee",
    driver = "driver",
}

// vehicle status
export enum VehicleStatus {
    available = "available",
    not_available = "not available",
}

// reservation statuses and types
export enum ReservationStatus {
    pending = "pending",
    success = "success",
    failure = "failure",
}
export enum ReservationTypeEnum {
    dropoff = "dropoff",
    pickup = "pickup",
}

// conflicts types
export enum ConflictTypeEnum {
    no_seats_remaining = "no seats remaining",
}