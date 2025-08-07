import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { CustomModal, ModalDef } from "../types/uiTypes";
import ModalService from "../services/ModalService";

// context type
interface ModalContextStateDef{
    modals: ModalDef[],
    setModals: Dispatch<SetStateAction<ModalDef[]>>,
    customModals: CustomModal[],
    setCustomModals: Dispatch<SetStateAction<CustomModal[]>>,
}

// context default value
const modalContextDefaultValue: ModalContextStateDef = {
    modals: [],
    setModals: () => null,
    customModals: [],
    setCustomModals: () => null,
}

// context
const modalContext: React.Context<ModalContextStateDef> = createContext(modalContextDefaultValue);

// provider
function ModalContextProvider({children}: {
    children: React.ReactNode,
}){
    const [loaded, setLoaded] = useState<boolean>(false);
    const [modals, setModals] = useState<ModalDef[]>([]);
    const [customModals, setCustomModals] = useState<CustomModal[]>([]);

    useEffect(() => {
        // init service
        ModalService.init(setModals, setCustomModals);
        // loaded
        setLoaded(true);
    }, []);

    return(
        <modalContext.Provider value={{ modals, setModals, customModals, setCustomModals }}>
            { loaded ? children : null }
        </modalContext.Provider>
    );

}

export {modalContext, ModalContextProvider};