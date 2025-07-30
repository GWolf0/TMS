import { AlertDef } from '@/types/ui'
import React, { useContext } from 'react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import AlertService from '@/services/AlertService';
import { alertContext, AlertContextProvider } from '@/contexts/alertContext';

// Alert/Notificaton component
// To add: action button
function AlertComp({alert}: {
    alert: AlertDef,
}) {

    // on close
    const onClose = () => AlertService.closeAlert(alert.id);

    return (
        <Alert variant={alert.severity === "error" ? "destructive" : "default"} className='flex justify-between items-center text-xs md:text-sm'>
            <AlertTitle>{alert.text}</AlertTitle>
            <Button size={'sm'} variant={'ghost'} onClick={onClose}><i className='bi bi-x-lg'></i></Button>
        </Alert>
    )

}

export default AlertComp

// alerts component (wrap the consumer with provider to give access to the alerts objects from context)
export function AlertsComp(){

    return (
        <AlertContextProvider>
            <AlertCompHelperComp />
        </AlertContextProvider>
    )

}
    // provider consumer (renders all alerts from context at once)
function AlertCompHelperComp(){
    const {alerts} = useContext(alertContext);

    return (
        <div className='w-full flex flex-col gap-2 my-4'>
            { alerts.map((a, i) => ( <AlertComp key={i} alert={a} /> )) }
        </div>
    )
}