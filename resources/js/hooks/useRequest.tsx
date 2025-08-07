import { useState } from "react";
import { DOE, HTTPRequest, JSONType } from "../types/common";
import { UserType } from "../types/tablesModels";
import { sendRequest } from "../helpers/requestHelper";

// hook to handle fetching requests and loading (returns fetch handler, loading bool, doe object)
export default function useRequest(req: HTTPRequest, defaultLoadingState?: boolean): [
    (params?: JSONType, searchQuery?: string, user?: UserType | null) => Promise<DOE>, boolean, DOE | undefined,
] {
    const [loading, setLoading] = useState<boolean>(defaultLoadingState ?? false);
    const [doe, setDOE] = useState<DOE>();

    async function perform(params?: JSONType, searchQuery?: string, user: UserType | null = null): Promise<DOE>{
        setLoading(true);
        const doe: DOE = await sendRequest(req, params, user, searchQuery);
        setLoading(false);
        setDOE(doe);
        return doe;
    }

    return [perform, loading, doe];

}