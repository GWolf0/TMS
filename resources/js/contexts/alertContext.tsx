import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { AlertDef } from "../types/uiTypes";
import AlertService from "../services/AlertService";

// context type
interface AlertContextStateDef{
    alerts: AlertDef[],
    setAlerts: Dispatch<SetStateAction<AlertDef[]>>,
}

// context default value
const alertContextDefaultValue: AlertContextStateDef = {
    alerts: [],
    setAlerts: () => null,
}

// context
const alertContext: React.Context<AlertContextStateDef> = createContext(alertContextDefaultValue);

// provider
function AlertContextProvider({children}: {
    children: React.ReactNode,
}){
    const [loaded, setLoaded] = useState<boolean>(false);
    const [alerts, setAlerts] = useState<AlertDef[]>([]);

    useEffect(() => {
        // init service
        AlertService.init(setAlerts);
        // loaded
        setLoaded(true);
    }, []);

    return(
        <alertContext.Provider value={{ alerts, setAlerts }}>
            { loaded ? children : null }
        </alertContext.Provider>
    );

}

export {alertContext, AlertContextProvider};