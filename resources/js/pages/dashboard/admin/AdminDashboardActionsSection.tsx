import React, { useRef, useState } from 'react'
import { AdminDashboardPageData } from '../../../types/responsesTypes'
import { Button } from '../../../components/ui/button'
import { DOE } from '../../../types/common';
import { sendRequest } from '../../../helpers/requestHelper';
import { ADMIN_START_RESERVATIONS_PROCESSING_REQ } from '../../../requests/requests';
import AlertService from '../../../services/AlertService';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';

function AdminDashboardActionsSection({data}: {
    data: AdminDashboardPageData,
}) {
    const isProcessingShifts: boolean = Boolean(data.is_processing_reservations);
    const autoDropoffProcessingTime: string = new Date(Date.parse(data.auto_dropoff_processing_time ?? "00:00")).toISOString().substr(11, 5);
    const autoPickupProcessingTime: string = new Date(Date.parse(data.auto_pickup_processing_time ?? "00:00")).toISOString().substr(11, 5);
    const canStartReservationsProcessing: boolean = Boolean(data.authorizations?.start_reservations_processing);

    const reservationsTypesRef = useRef<HTMLFormElement>(null);

    const [reservationsProcessingStarted, setReservationsProcessingStarted] = useState<boolean>(false);

    // actions
    async function onStartReservationsProcessing() {
        if(!reservationsTypesRef.current || isProcessingShifts || reservationsProcessingStarted || !canStartReservationsProcessing) return;
        if(!confirm(`Are you sure you want to start this action?`)) return;
        
        const fd = new FormData(reservationsTypesRef.current);
        const reservation_type = fd.get("reservation_type");
        if(!reservation_type) return;

        const doe: DOE = await sendRequest(ADMIN_START_RESERVATIONS_PROCESSING_REQ, {type: reservation_type.toString()});
        setReservationsProcessingStarted(true);

        if(doe.error) {
            AlertService.showAlert({id: 0, text: `Error starting processing: ${doe.error.message}`});
        }
    }

    return (
        <main>

            {/* // Start shifts processing action */}
            <section className='flex flex-col gap-2'>
                <div className='flex gap-4 justify-between items-center'>
                    <p>Shifts processing</p>

                    <div className='flex gap-2'>
                        <form className="flex items-center space-x-2" ref={reservationsTypesRef}>
                            <Label className='text-xs'>dropoff</Label>
                            <input type='radio' name="reservation_type" value="dropoff" />
                            
                            <Label className='text-xs'>pickup</Label>
                            <input type='radio' name="reservation_type" value="pickup" />
                        </form>

                        <Button onClick={onStartReservationsProcessing} disabled={isProcessingShifts || reservationsProcessingStarted || !canStartReservationsProcessing}>
                            { isProcessingShifts ? "Processing" : reservationsProcessingStarted ? "Just Started" : "Start" }
                        </Button>
                    </div>
                </div>

                <div className='text-xs p-1 bg-muted rounded w-fit'>
                    <p>
                        Dropoff auto processing time: {autoDropoffProcessingTime}
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        Pickup auto processing time: {autoPickupProcessingTime}
                    </p>
                </div>
            </section>

        </main>
    )

}

export default AdminDashboardActionsSection