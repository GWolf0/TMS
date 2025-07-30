// Handle alerts

import { AlertDef } from "@/types/ui";

export default class AlertService{
    static setAlerts: React.Dispatch<React.SetStateAction<AlertDef[]>>;

    static init(setAlerts: React.Dispatch<React.SetStateAction<AlertDef[]>>){
        AlertService.setAlerts = setAlerts;
    }

    // appends alert
    static showAlert(alert: AlertDef){
        AlertService.setAlerts(prev => [...prev, alert]);
    }

    // close alert
    static closeAlert(id: number){
        AlertService.setAlerts(prev => prev.filter(a => a.id !== id));
    }

}
