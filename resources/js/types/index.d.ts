import { UserType } from "./tablesModels";

export interface Auth {
    user: UserType;
}

export interface SharedData {
    name: string;
    auth: Auth;
    // ziggy: Config & { location: string };
    [key: string]: unknown;
}
