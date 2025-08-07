import { Dispatch, ReactNode, SetStateAction } from "react";
import { CustomModal, ModalDef } from "../types/uiTypes";

// As convention for this project
// modals with ids < 0 are considered custom modals, their ids must be defined in the same file as their component (must be unique and signed)
export default class ModalService{
    static setModals: Dispatch<SetStateAction<ModalDef[]>>;
    static setCustomModals: Dispatch<SetStateAction<CustomModal[]>>;

    // init (pass disptach)
    static init(setModals: Dispatch<SetStateAction<ModalDef[]>>, setCustomModals: Dispatch<SetStateAction<CustomModal[]>>){
        ModalService.setModals = setModals;
        ModalService.setCustomModals = setCustomModals;
    }

    // show modal
    static showModal(modal: ModalDef){
        modal.id = new Date().valueOf();
        ModalService.setModals(prev => [...prev, modal]);
    }

    // show alert modal
    static showAlert(message: string){
        const modal: ModalDef = {
            id: new Date().valueOf(),
            header: <p>Alert</p>,
            content: <p>{message}</p>,
            actions: [
                {name: "Ok", action: () => null},
            ]
        };
        ModalService.showModal(modal);
    }

    // show alert modal
    static showConfirm(message: string, onConfirm: (value: boolean) => void){
        const modal: ModalDef = {
            id: new Date().valueOf(),
            header: <p>Confirm</p>,
            content: <p>{message}</p>,
            actions: [
                {name: "Confirm", action: () => { onConfirm(true); return null;}}, // return null to close modal after action performed
                {name: "Cancel", action: () => { onConfirm(false); return null;}},
            ]
        };
        ModalService.showModal(modal);
    }
    
    // close modal
    static closeModal(id: number){
        if(id < 0) ModalService.closeCustomModal(id); // assume that modal with id < 0 are custom modals
        else ModalService.setModals(prev => prev.filter(m => m.id !== id));
    }

    // show custom modal
    static showCustomModal(modal: CustomModal){
        ModalService.setCustomModals(prev => [...prev, modal]);
    }

    // show custom modal
    static closeCustomModal(id: number){
        ModalService.setCustomModals(prev => prev.filter(m => m.id !== id));
    }

}